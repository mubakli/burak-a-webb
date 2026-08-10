import "server-only";

import { adaptiveLearningCatalog, type TopicDefinition } from "@/data/adaptiveLearningCatalog";
import { learningSourceRegistry } from "@/data/learningSourceRegistry";
import connectDB from "@/lib/db";
import { fingerprint } from "@/modules/learning/fingerprint";
import {
  LearningLearnerProfileModel,
  LearningSourceModel,
  LearningTopicModel,
  LearningTopicRevisionModel,
  type LearnerProfileRecord,
} from "@/modules/learning/models";

export const OWNER_LEARNER_ID = "owner";
export const ARTICLE_SCHEMA_VERSION = 3;
export const PEDAGOGY_VERSION = 3;
export const PROMPT_VERSION = 3;

export const defaultLearnerProfile: LearnerProfileRecord = {
  learnerId: OWNER_LEARNER_ID,
  locale: "tr-TR",
  timeZone: "Europe/Istanbul",
  preferredMode: "standard",
  goals: [
    "Full-stack geliştirmede katmanlar arası karar verebilmek",
    "Design pattern'ları isim olarak değil doğru problemde kullanabilmek",
    "Backend, veri ve güvenilirlik konularında production muhakemesi geliştirmek",
    "AI destekli sistemleri ölçülebilir ve güvenli biçimde inşa etmek",
  ],
  domainWeights: {
    architecture: 5,
    backend: 5,
    data: 5,
    frontend: 4,
    security: 4,
    reliability: 4,
    delivery: 4,
    ai: 3,
  },
  designPatternPriority: 5,
  projectContexts: [
    "VTrade",
    "Local-first code-review",
    "converter-pptx-to-pdf",
    "TaskManagment",
    "Production Next.js ve ASP.NET Core uygulamaları",
  ],
  profileVersion: 1,
};

let foundationPromise: Promise<boolean> | null = null;

export async function connectLearningDatabase() {
  if (!process.env.MONGODB_URI) return false;

  try {
    await connectDB();
    return true;
  } catch (error) {
    console.error("Learning database connection failed.", error);
    return false;
  }
}

async function seedTopics() {
  const existingTopics = await LearningTopicModel.find(
    { slug: { $in: adaptiveLearningCatalog.map(({ slug }) => slug) } },
    { slug: 1, currentRevision: 1, currentRevisionHash: 1 },
  ).lean();
  const existingBySlug = new Map(
    existingTopics.map((topic) => [
      topic.slug,
      {
        revision: topic.currentRevision,
        hash: topic.currentRevisionHash,
      },
    ]),
  );

  const changedTopics = adaptiveLearningCatalog.flatMap((definition) => {
    const revisionHash = fingerprint(definition);
    const existing = existingBySlug.get(definition.slug);
    if (existing?.hash === revisionHash) return [];

    return [
      {
        definition,
        revisionHash,
        revision: existing ? existing.revision + 1 : 1,
      },
    ];
  });

  if (changedTopics.length === 0) return;

  await LearningTopicRevisionModel.bulkWrite(
    changedTopics.map(({ definition, revision, revisionHash }) => ({
      updateOne: {
        filter: { topicSlug: definition.slug, revision },
        update: {
          $setOnInsert: {
            topicSlug: definition.slug,
            revision,
            revisionHash,
            definition,
            publishedAt: new Date(),
          },
        },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  await LearningTopicModel.bulkWrite(
    changedTopics.map(({ definition, revision, revisionHash }) => ({
      updateOne: {
        filter: { slug: definition.slug },
        update: {
          $set: {
            status: "published",
            domain: definition.domain,
            category: definition.category,
            currentRevision: revision,
            currentRevisionHash: revisionHash,
          },
          $setOnInsert: { slug: definition.slug },
        },
        upsert: true,
      },
    })),
    { ordered: false },
  );
}

async function seedSources() {
  await LearningSourceModel.bulkWrite(
    learningSourceRegistry.map((source) => ({
      updateOne: {
        filter: { key: source.key },
        update: {
          $set: {
            label: source.label,
            url: source.url,
            kind: source.kind,
            authority: source.authority,
            domains: source.domains,
            refreshHours: source.refreshHours,
            storagePolicy: source.storagePolicy,
            searchQueries: source.searchQueries,
            githubRepository: source.githubRepository,
          },
          $setOnInsert: { key: source.key },
        },
        upsert: true,
      },
    })),
    { ordered: false },
  );
}

async function seedLearnerProfile() {
  await LearningLearnerProfileModel.updateOne(
    { learnerId: OWNER_LEARNER_ID },
    { $setOnInsert: defaultLearnerProfile },
    { upsert: true },
  );
}

async function seedFoundation() {
  if (!(await connectLearningDatabase())) return false;

  await seedTopics();
  await seedSources();
  await seedLearnerProfile();
  return true;
}

export async function ensureLearningFoundation() {
  if (!foundationPromise) {
    foundationPromise = seedFoundation().catch((error) => {
      foundationPromise = null;
      console.error("Learning foundation could not be seeded.", error);
      return false;
    });
  }

  const ready = await foundationPromise;
  if (!ready) foundationPromise = null;
  return ready;
}

export function getCatalogTopic(slug: string) {
  return adaptiveLearningCatalog.find((topic) => topic.slug === slug) ?? null;
}

export function getCatalogTopics() {
  return adaptiveLearningCatalog;
}

export function getTopicRevisionHash(topic: TopicDefinition) {
  return fingerprint(topic);
}

export async function getLearnerProfile(learnerId = OWNER_LEARNER_ID) {
  if (!(await ensureLearningFoundation())) return defaultLearnerProfile;

  const profile = await LearningLearnerProfileModel.findOne({ learnerId }).lean();
  return profile
    ? (profile as unknown as LearnerProfileRecord)
    : defaultLearnerProfile;
}
