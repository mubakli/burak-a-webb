import "server-only";

import { randomUUID } from "node:crypto";
import type { TopicDefinition } from "@/data/adaptiveLearningCatalog";
import {
  learningSourceRegistry,
  type SourceDefinition,
} from "@/data/learningSourceRegistry";
import {
  connectLearningDatabase,
  ensureLearningFoundation,
} from "@/modules/learning/catalog";
import { fingerprint } from "@/modules/learning/fingerprint";
import {
  LearningResearchRunModel,
  LearningSourceModel,
  LearningSourceSnapshotModel,
  type SourceSnapshotRecord,
} from "@/modules/learning/models";
import type { FreshTopicSignal } from "@/modules/learning/selection";

const MAX_DOCUMENT_BYTES = 750_000;
const MAX_EXCERPT_LENGTH = 8_000;

type TavilyResult = {
  title: string;
  url: string;
  content: string;
  publishedDate?: string;
  score?: number;
};

function trustedHosts() {
  return new Set(
    learningSourceRegistry.flatMap((source) => {
      try {
        return [new URL(source.url).hostname];
      } catch {
        return [];
      }
    }),
  );
}

const allowedHosts = trustedHosts();

function isTrustedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return [...allowedHosts].some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

function isUrlAllowedForSource(value: string, source: SourceDefinition) {
  try {
    const candidateUrl = new URL(value);
    const sourceUrl = new URL(source.url);
    const hostMatches =
      candidateUrl.hostname === sourceUrl.hostname ||
      candidateUrl.hostname.endsWith(`.${sourceUrl.hostname}`);
    if (candidateUrl.protocol !== "https:" || !hostMatches) return false;

    if (source.githubRepository) {
      const repositoryPath = `/${source.githubRepository.owner}/${source.githubRepository.repo}`;
      return (
        candidateUrl.pathname === repositoryPath ||
        candidateUrl.pathname.startsWith(`${repositoryPath}/`)
      );
    }

    const sourcePath = sourceUrl.pathname.replace(/\/$/, "");
    return sourcePath === "" || candidateUrl.pathname.startsWith(sourcePath);
  } catch {
    return false;
  }
}

async function fetchTrustedUrl(
  initialUrl: string,
  source: SourceDefinition,
  init: Omit<RequestInit, "redirect">,
) {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= 3; redirectCount += 1) {
    if (!isUrlAllowedForSource(currentUrl, source)) {
      throw new Error("Research URL is outside the selected source boundary.");
    }

    const response = await fetch(currentUrl, { ...init, redirect: "manual" });
    if (response.status < 300 || response.status >= 400) return response;

    const location = response.headers.get("location");
    if (!location) throw new Error("Trusted source returned an invalid redirect.");
    currentUrl = new URL(location, currentUrl).toString();
  }

  throw new Error("Trusted source exceeded the redirect limit.");
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'");
}

function extractText(raw: string) {
  return decodeEntities(
    raw
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  ).slice(0, MAX_EXCERPT_LENGTH);
}

function extractTitle(raw: string, fallback: string) {
  const match = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeEntities(match[1].replace(/\s+/g, " ").trim()) : fallback;
}

async function persistSnapshot(input: Omit<SourceSnapshotRecord, "fetchedAt">) {
  const snapshot = await LearningSourceSnapshotModel.findOneAndUpdate(
    { snapshotKey: input.snapshotKey },
    { $setOnInsert: { ...input, fetchedAt: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  await LearningSourceModel.updateOne(
    { key: input.sourceKey },
    { $set: { lastFetchedAt: new Date() } },
  );

  return snapshot as unknown as SourceSnapshotRecord;
}

async function fetchRegisteredDocument(
  source: SourceDefinition,
  requestedUrl = source.url,
  extraMetadata: Record<string, unknown> = {},
) {
  if (!isUrlAllowedForSource(requestedUrl, source)) return [];

  const response = await fetchTrustedUrl(requestedUrl, source, {
    headers: {
      Accept: "text/html, text/plain, application/json",
      "User-Agent": "BurakLearningResearch/1.0 (+personal educational research)",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) throw new Error(`${source.key} returned ${response.status}.`);
  if (!isUrlAllowedForSource(response.url, source)) {
    throw new Error(`${source.key} redirected outside its registered boundary.`);
  }

  const contentLength = Number(response.headers.get("content-length") ?? 0);
  if (contentLength > MAX_DOCUMENT_BYTES) {
    throw new Error(`${source.key} exceeded the document size limit.`);
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_DOCUMENT_BYTES) {
    throw new Error(`${source.key} exceeded the document size limit.`);
  }

  const raw = new TextDecoder().decode(bytes);
  const excerpt = extractText(raw);
  if (excerpt.length < 80) throw new Error(`${source.key} did not yield useful text.`);

  const contentHash = fingerprint(excerpt);
  const snapshot = await persistSnapshot({
    snapshotKey: fingerprint({ sourceKey: source.key, url: response.url, contentHash }),
    sourceKey: source.key,
    title: extractTitle(raw, source.label),
    url: response.url,
    excerpt,
    authority: source.authority,
    contentHash,
    metadata: {
      contentType: response.headers.get("content-type"),
      storagePolicy: source.storagePolicy,
      ...extraMetadata,
    },
  });

  return [snapshot];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function fetchGitHubReleases(source: SourceDefinition) {
  if (!source.githubRepository) return [];

  const { owner, repo } = source.githubRepository;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "BurakLearningResearch/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases?per_page=3`,
    {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!response.ok) throw new Error(`${source.key} releases returned ${response.status}.`);

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error(`${source.key} releases were invalid.`);

  const snapshots: SourceSnapshotRecord[] = [];
  for (const item of payload.slice(0, 3)) {
    if (!isRecord(item)) continue;
    const id = typeof item.id === "number" ? String(item.id) : null;
    const title =
      typeof item.name === "string"
        ? item.name
        : typeof item.tag_name === "string"
          ? item.tag_name
          : null;
    const url = typeof item.html_url === "string" ? item.html_url : null;
    const body = typeof item.body === "string" ? item.body : "";
    if (!id || !title || !url || !isUrlAllowedForSource(url, source)) continue;

    const excerpt = body.replace(/\s+/g, " ").trim().slice(0, MAX_EXCERPT_LENGTH);
    const contentHash = fingerprint({ title, excerpt });
    const publishedAt =
      typeof item.published_at === "string" ? new Date(item.published_at) : undefined;
    snapshots.push(
      await persistSnapshot({
        snapshotKey: fingerprint({ sourceKey: source.key, externalId: id, contentHash }),
        sourceKey: source.key,
        externalId: id,
        title,
        url,
        excerpt: excerpt || `${title} release metadata`,
        authority: source.authority,
        contentHash,
        publishedAt:
          publishedAt &&
          !Number.isNaN(publishedAt.valueOf()) &&
          publishedAt.valueOf() <= Date.now() + 5 * 60 * 1000
            ? publishedAt
            : undefined,
        metadata: {
          tag: typeof item.tag_name === "string" ? item.tag_name : undefined,
          prerelease: item.prerelease === true,
        },
      }),
    );
  }

  return snapshots;
}

function sourceForUrl(url: string) {
  try {
    const candidateUrl = new URL(url);
    const hostname = candidateUrl.hostname;
    return learningSourceRegistry.find((source) => {
      try {
        const sourceUrl = new URL(source.url);
        const hostMatches =
          hostname === sourceUrl.hostname || hostname.endsWith(`.${sourceUrl.hostname}`);
        if (!hostMatches) return false;

        if (source.githubRepository) {
          const repositoryPath = `/${source.githubRepository.owner}/${source.githubRepository.repo}`;
          return candidateUrl.pathname === repositoryPath ||
            candidateUrl.pathname.startsWith(`${repositoryPath}/`);
        }

        return sourceUrl.pathname === "/" ||
          candidateUrl.pathname.startsWith(sourceUrl.pathname.replace(/\/$/, ""));
      } catch {
        return false;
      }
    });
  } catch {
    return undefined;
  }
}

async function searchWithTavily(topic: TopicDefinition) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey || topic.freshnessQueries.length === 0) return [];

  const query = topic.freshnessQueries[0];
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      topic: "general",
      max_results: 6,
      include_answer: false,
      include_raw_content: false,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error(`Tavily returned ${response.status}.`);

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.results)) return [];

  const snapshots: SourceSnapshotRecord[] = [];
  for (const rawResult of payload.results.slice(0, 6)) {
    if (!isRecord(rawResult)) continue;
    const result: TavilyResult = {
      title: typeof rawResult.title === "string" ? rawResult.title : "",
      url: typeof rawResult.url === "string" ? rawResult.url : "",
      content: typeof rawResult.content === "string" ? rawResult.content : "",
      publishedDate:
        typeof rawResult.published_date === "string"
          ? rawResult.published_date
          : undefined,
      score: typeof rawResult.score === "number" ? rawResult.score : undefined,
    };
    if (!result.title || !result.content || !isTrustedUrl(result.url)) continue;
    const source = sourceForUrl(result.url);
    if (!source || source.authority === "discovery-only") continue;

    try {
      const verifiedSnapshots = await fetchRegisteredDocument(source, result.url, {
          discoveredForTopic: topic.slug,
          tavilyScore: result.score,
          discoveryQuery: query,
          discoveryTitle: result.title,
          discoveryPublishedDate: result.publishedDate,
        });
      snapshots.push(...verifiedSnapshots);
    } catch (error) {
      console.error("A Tavily discovery candidate could not be verified.", error);
    }
  }

  return snapshots;
}

async function refreshSource(source: SourceDefinition) {
  if (source.kind === "github-releases") return fetchGitHubReleases(source);
  if (source.authority === "discovery-only") return [];
  return fetchRegisteredDocument(source);
}

function sourceKeysForTopic(topic: TopicDefinition) {
  const companions: Record<string, string[]> = {
    "react-docs": ["react-releases"],
    "next-docs": ["next-releases"],
    "docker-docs": ["docker-compose-releases"],
    opentelemetry: ["opentelemetry-js-releases"],
  };

  return [
    ...new Set(
      topic.sourceKeys.flatMap((sourceKey) => [
        sourceKey,
        ...(companions[sourceKey] ?? []),
      ]),
    ),
  ];
}

function dailyOrchestrationRunKey(localDate: string) {
  return fingerprint({ kind: "daily_orchestration", localDate });
}

export async function claimDailyLearningOrchestration(localDate: string) {
  if (!(await ensureLearningFoundation()) || !(await connectLearningDatabase())) {
    throw new Error("Daily learning orchestration requires database persistence.");
  }

  const runKey = dailyOrchestrationRunKey(localDate);
  const claimId = randomUUID();
  const runDocument = {
    runKey,
    claimId,
    kind: "daily_orchestration" as const,
    status: "running" as const,
    sourceKeys: [],
    sourceSnapshotKeys: [],
    providerCalls: [],
    startedAt: new Date(),
  };
  try {
    await LearningResearchRunModel.create(runDocument);
    return { state: "claimed" as const, runKey, claimId };
  } catch (error) {
    const existing = await LearningResearchRunModel.findOne({ runKey }).lean();
    if (existing?.status === "succeeded") {
      return { state: "succeeded" as const, runKey };
    }
    if (
      existing?.status === "running" &&
      new Date(existing.startedAt).valueOf() > Date.now() - 20 * 60 * 1000
    ) {
      return { state: "running" as const, runKey };
    }
    const claimed = await LearningResearchRunModel.findOneAndUpdate(
      {
        runKey,
        $or: [
          { status: "failed" },
          {
            status: "running",
            startedAt: { $lte: new Date(Date.now() - 20 * 60 * 1000) },
          },
        ],
      },
      {
        $set: runDocument,
        $unset: { completedAt: 1, safeError: 1 },
      },
      { new: true },
    ).lean();
    if (!claimed) throw error;
    return { state: "claimed" as const, runKey, claimId };
  }
}

export async function finishDailyLearningOrchestration(input: {
  runKey: string;
  claimId: string;
  succeeded: boolean;
  sourceSnapshotKeys?: string[];
  safeError?: string;
}) {
  const result = await LearningResearchRunModel.updateOne(
    { runKey: input.runKey, claimId: input.claimId, status: "running" },
    {
      $set: {
        status: input.succeeded ? "succeeded" : "failed",
        sourceSnapshotKeys: input.sourceSnapshotKeys ?? [],
        completedAt: new Date(),
        ...(!input.succeeded
          ? { safeError: input.safeError?.slice(0, 300) ?? "Daily pipeline failed." }
          : {}),
      },
      ...(input.succeeded ? { $unset: { safeError: 1 } } : {}),
    },
  );
  return result.modifiedCount === 1;
}

export async function researchTopic(topic: TopicDefinition) {
  if (!(await ensureLearningFoundation()) || !(await connectLearningDatabase())) {
    throw new Error("Learning research requires database persistence.");
  }

  const runKey = fingerprint({
    kind: "source_refresh",
    topicSlug: topic.slug,
    day: new Date().toISOString().slice(0, 10),
  });
  const researchSourceKeys = sourceKeysForTopic(topic);
  const claimId = randomUUID();
  const runDocument = {
    runKey,
    kind: "source_refresh" as const,
    status: "running" as const,
    claimId,
    topicSlug: topic.slug,
    sourceKeys: researchSourceKeys,
    sourceSnapshotKeys: [],
    providerCalls: [],
    startedAt: new Date(),
  };
  try {
    await LearningResearchRunModel.create(runDocument);
  } catch (error) {
    const existing = await LearningResearchRunModel.findOne({ runKey }).lean();
    if (existing?.status === "succeeded") return existing.sourceSnapshotKeys;
    if (
      existing?.status === "running" &&
      new Date(existing.startedAt).valueOf() > Date.now() - 20 * 60 * 1000
    ) {
      return null;
    }
    const claimed = await LearningResearchRunModel.findOneAndUpdate(
      {
        runKey,
        $or: [
          { status: "failed" },
          { status: "running", startedAt: { $lte: new Date(Date.now() - 20 * 60 * 1000) } },
        ],
      },
      {
        $set: runDocument,
        $unset: { completedAt: 1, safeError: 1 },
      },
      { new: true },
    ).lean();
    if (!claimed) throw error;
  }

  const snapshotKeys: string[] = [];
  try {
    for (const sourceKey of researchSourceKeys.slice(0, 5)) {
      const source = learningSourceRegistry.find((candidate) => candidate.key === sourceKey);
      if (!source) continue;

      const stored = await LearningSourceModel.findOne({ key: source.key }).lean();
      const refreshAfter =
        source.refreshHours && stored?.lastFetchedAt
          ? new Date(stored.lastFetchedAt).valueOf() + source.refreshHours * 60 * 60 * 1000
          : 0;
      if (refreshAfter > Date.now()) {
        const latest = await LearningSourceSnapshotModel.findOne({
          sourceKey: source.key,
        })
          .sort({ fetchedAt: -1 })
          .lean();
        if (latest) snapshotKeys.push(latest.snapshotKey);
        continue;
      }

      try {
        const snapshots = await refreshSource(source);
        snapshotKeys.push(...snapshots.map((snapshot) => snapshot.snapshotKey));
      } catch (error) {
        console.error(`Learning source ${source.key} could not be refreshed.`, error);
      }
    }

    try {
      const discovered = await searchWithTavily(topic);
      snapshotKeys.push(...discovered.map((snapshot) => snapshot.snapshotKey));
    } catch (error) {
      console.error("Tavily learning discovery failed.", error);
    }

    if (snapshotKeys.length > 0) {
      await LearningSourceSnapshotModel.updateMany(
        { snapshotKey: { $in: snapshotKeys } },
        { $addToSet: { "metadata.relatedTopicSlugs": topic.slug } },
      );
    }

    const uniqueSnapshotKeys = [...new Set(snapshotKeys)];
    const completed = await LearningResearchRunModel.updateOne(
      { runKey, claimId, status: "running" },
      {
        $set: {
          status: uniqueSnapshotKeys.length > 0 ? "succeeded" : "failed",
          sourceSnapshotKeys: uniqueSnapshotKeys,
          ...(uniqueSnapshotKeys.length === 0
            ? { safeError: "No authoritative evidence snapshot was available." }
            : {}),
          completedAt: new Date(),
        },
        ...(uniqueSnapshotKeys.length > 0 ? { $unset: { safeError: 1 } } : {}),
      },
    );
    return completed.modifiedCount === 1 ? uniqueSnapshotKeys : null;
  } catch (error) {
    await LearningResearchRunModel.updateOne(
      { runKey, claimId, status: "running" },
      {
        $set: {
          status: "failed",
          safeError: error instanceof Error ? error.message.slice(0, 300) : "Unknown research error",
          completedAt: new Date(),
        },
      },
    );
    throw error;
  }
}

export async function getFreshTopicSignals(): Promise<FreshTopicSignal[]> {
  if (!(await connectLearningDatabase())) return [];

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const snapshots = await LearningSourceSnapshotModel.find({
    publishedAt: { $gte: cutoff, $lte: new Date() },
    $or: [
      { "metadata.discoveredForTopic": { $exists: true } },
      { "metadata.relatedTopicSlugs": { $exists: true } },
    ],
  })
    .sort({ publishedAt: -1 })
    .limit(50)
    .lean();

  return snapshots.flatMap((snapshot) => {
    const metadata = snapshot.metadata as Record<string, unknown> | undefined;
    const topicSlugs = [
      ...(typeof metadata?.discoveredForTopic === "string"
        ? [metadata.discoveredForTopic]
        : []),
      ...(Array.isArray(metadata?.relatedTopicSlugs)
        ? metadata.relatedTopicSlugs.filter(
            (value): value is string => typeof value === "string",
          )
        : []),
    ];
    if (topicSlugs.length === 0) return [];
    const age = snapshot.publishedAt
      ? (Date.now() - new Date(snapshot.publishedAt).valueOf()) /
        (30 * 24 * 60 * 60 * 1000)
      : 1;
    return [...new Set(topicSlugs)].map((topicSlug) => ({
        topicSlug,
        strength: Math.max(0.1, 1 - age),
        reason: `Güvenilir bir kaynakta yakın zamanda yayımlanan “${snapshot.title}” içeriği bu kavramla ilişkili.`,
      }));
  });
}
