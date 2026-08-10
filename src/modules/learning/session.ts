import "server-only";

import mongoose from "mongoose";
import { adaptiveLearningCatalog } from "@/data/adaptiveLearningCatalog";
import {
  OWNER_LEARNER_ID,
  ensureLearningFoundation,
  getCatalogTopic,
  getLearnerProfile,
} from "@/modules/learning/catalog";
import {
  ensureSharedArticle,
  getArticleVersionById,
} from "@/modules/learning/content";
import {
  LearningSessionModel,
  LearningTopicStateModel,
  LearningTopicRevisionModel,
  type LearningSessionRecord,
  type TopicStateRecord,
} from "@/modules/learning/models";
import { getFreshTopicSignals } from "@/modules/learning/research";
import {
  rankLearningTopics,
  selectLearningTopic,
} from "@/modules/learning/selection";
import { fingerprint } from "@/modules/learning/fingerprint";
import {
  canonicalizeCompletionPayload,
  fixedEvidenceStepIds,
  getFieldworkMutationDecision,
  validateLearningCompletion,
} from "@/modules/learning/workflow";
import type {
  LearningArticle,
  AtlasTopic,
  DueReview,
  FieldworkEntry,
  LearningResponse,
  LearningSession,
  LearningSessionBundle,
  LearningSessionMode,
  NotebookEntry,
  TopicMastery,
} from "@/modules/learning/types";

export class LearningConflictError extends Error {}
export class LearningValidationError extends Error {}
export class LearningPersistenceError extends Error {}

function createCompletionPayloadHash(
  mode: LearningSessionMode,
  responses: readonly LearningResponse[],
) {
  return fingerprint(canonicalizeCompletionPayload(mode, responses));
}

function completionRequestHash(input: {
  expectedRevision: number;
  mode: LearningSessionMode;
  currentStep: number;
  responses: readonly LearningResponse[];
}) {
  return fingerprint({
    expectedRevision: input.expectedRevision,
    currentStep: input.currentStep,
    payloadHash: createCompletionPayloadHash(input.mode, input.responses),
  });
}

function getDateInTimeZone(timeZone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function toMastery(record: TopicStateRecord): TopicMastery {
  return {
    topicSlug: record.topicSlug,
    recall: record.recall,
    conditional: record.conditional,
    application: record.application,
    transfer: record.transfer,
    confidence: record.confidence,
    exposureCount: record.exposureCount,
    lastAttemptAt: record.lastAttemptAt?.toISOString(),
    nextReviewAt: record.nextReviewAt?.toISOString(),
  };
}

function toSession(
  record: LearningSessionRecord & { _id?: mongoose.Types.ObjectId },
): LearningSession {
  return {
    id: record._id?.toString() ?? record.sessionKey,
    revision: record.revision ?? 0,
    learnerId: record.learnerId,
    localDate: record.localDate,
    status: record.status,
    mode: record.mode,
    currentStep: record.currentStep,
    topicSlug: record.topicSlug,
    topicTitle: record.topicTitle,
    topicDomain: record.topicDomain as LearningSession["topicDomain"],
    articleVersionId: record.articleVersionId.toString(),
    selectionScore: record.selectionScore,
    selectionReasons: [...record.selectionReasons],
    reasonCodes: [...record.reasonCodes],
    responses: record.responses.map((response) => ({ ...response })),
    startedAt: record.startedAt?.toISOString(),
    completedAt: record.completedAt?.toISOString(),
  };
}

async function loadDueReviews(
  learnerId: string,
  excludedTopicSlug?: string,
): Promise<DueReview[]> {
  const states = await LearningTopicStateModel.find({
    learnerId,
    nextReviewAt: { $lte: new Date() },
    ...(excludedTopicSlug ? { topicSlug: { $ne: excludedTopicSlug } } : {}),
  })
    .sort({ nextReviewAt: 1 })
    .limit(3)
    .lean();

  return states.flatMap((state) => {
    const topic = getCatalogTopic(state.topicSlug);
    if (!topic) return [];
    const index = state.exposureCount % topic.seed.reviewQuestions.length;
    return [
      {
        topicSlug: topic.slug,
        title: topic.title,
        prompt: topic.seed.reviewQuestions[index],
        rubric: `${topic.summary} Kontrol merceği: ${topic.seed.mentalModel}`,
        lastSeenAt: state.lastAttemptAt?.toISOString(),
      },
    ];
  });
}

async function loadStats(learnerId: string) {
  const [studiedTopics, appliedTopics, dueReviews, completedSessions] =
    await Promise.all([
      LearningTopicStateModel.countDocuments({ learnerId, exposureCount: { $gt: 0 } }),
      LearningSessionModel.distinct("topicSlug", {
        learnerId,
        fieldworkStatus: "applied",
      }).then((topicSlugs) => topicSlugs.length),
      LearningTopicStateModel.countDocuments({ learnerId, nextReviewAt: { $lte: new Date() } }),
      LearningSessionModel.countDocuments({ learnerId, status: "completed" }),
    ]);

  return { studiedTopics, appliedTopics, dueReviews, completedSessions };
}

function previewBundle(
  selection: ReturnType<typeof selectLearningTopic>,
  article: Awaited<ReturnType<typeof ensureSharedArticle>>,
  profile: Awaited<ReturnType<typeof getLearnerProfile>>,
): LearningSessionBundle {
  const localDate = getDateInTimeZone(profile.timeZone);
  return {
    session: {
      id: `preview-${localDate}`,
      revision: 0,
      learnerId: OWNER_LEARNER_ID,
      localDate,
      status: "assigned",
      mode: profile.preferredMode,
      currentStep: 0,
      topicSlug: selection.topic.slug,
      topicTitle: selection.topic.title,
      topicDomain: selection.topic.domain,
      articleVersionId: article.versionId,
      selectionScore: selection.score,
      selectionReasons: selection.reasons,
      reasonCodes: selection.reasonCodes,
      responses: [],
    },
    article,
    topic: selection.topic,
    dueReviews: [],
    mastery: null,
    stats: { studiedTopics: 0, appliedTopics: 0, dueReviews: 0, completedSessions: 0 },
    persistence: "preview",
  };
}

async function databaseBundleFromRecord(
  record: LearningSessionRecord & { _id: mongoose.Types.ObjectId },
): Promise<LearningSessionBundle> {
  const reviewAssignments = resolveReviewAssignments(record);
  if (
    !Array.isArray(record.reviewAssignments) ||
    record.reviewAssignments.some((review) => !review.rubric) ||
    (record.reviewAssignments.length === 0 && reviewAssignments.length > 0)
  ) {
    await LearningSessionModel.updateOne(
      { _id: record._id, revision: record.revision },
      { $set: { reviewAssignments } },
    );
    record.reviewAssignments = reviewAssignments;
  }
  if (record.status === "completed") {
    await updateMasteryFromSession(record);
    await updateDueReviewEvidence(record);
  }
  const article = await getArticleVersionById(
    record.articleVersionId.toString(),
    record.topicSlug,
    record.articleReuseKey,
  );
  const [topicRevision, state, stats] = await Promise.all([
    LearningTopicRevisionModel.findOne({
      topicSlug: record.topicSlug,
      revision: article.topicRevision,
    }).lean(),
    LearningTopicStateModel.findOne({
      learnerId: record.learnerId,
      topicSlug: record.topicSlug,
    }).lean(),
    loadStats(record.learnerId),
  ]);
  if (!topicRevision) {
    throw new LearningPersistenceError(
      "Pinned learning topic revision is unavailable.",
    );
  }
  return {
    session: toSession(record),
    article,
    topic: topicRevision.definition,
    dueReviews: record.reviewAssignments ?? [],
    mastery: state ? toMastery(state as unknown as TopicStateRecord) : null,
    stats,
    persistence: "database",
  };
}

function resolveReviewAssignments(record: LearningSessionRecord): DueReview[] {
  if (Array.isArray(record.reviewAssignments) && record.reviewAssignments.length > 0) {
    return record.reviewAssignments.map((review) => {
      if (review.rubric) return review;
      const topic = getCatalogTopic(review.topicSlug);
      return {
        ...review,
        rubric: topic
          ? `${topic.summary} Kontrol merceği: ${topic.seed.mentalModel}`
          : "Yanıtını mekanizma, sınır ve failure mode açısından kontrol et.",
      };
    });
  }
  const topicSlugs = [
    ...new Set(
      record.responses.flatMap((response) => {
        if (
          !response.stepId.startsWith("recall:") ||
          response.stepId === "recall:current"
        ) {
          return [];
        }
        return [response.stepId.slice("recall:".length)];
      }),
    ),
  ];
  return topicSlugs.flatMap((topicSlug) => {
    const topic = getCatalogTopic(topicSlug);
    return topic
      ? [
          {
            topicSlug,
            title: topic.title,
            prompt:
              topic.seed.reviewQuestions[0] ??
              `${topic.title} mekanizmasını yardımsız açıkla.`,
            rubric: `${topic.summary} Kontrol merceği: ${topic.seed.mentalModel}`,
          },
        ]
      : [];
  });
}

export async function getTodayLearningSession(
  learnerId = OWNER_LEARNER_ID,
): Promise<LearningSessionBundle> {
  const databaseReady = await ensureLearningFoundation();
  const profile = await getLearnerProfile(learnerId);
  const localDate = getDateInTimeZone(profile.timeZone);

  if (databaseReady) {
    const existing = await LearningSessionModel.findOne({ learnerId, localDate }).lean();
    if (existing) {
      const record = existing as unknown as LearningSessionRecord & {
        _id: mongoose.Types.ObjectId;
      };
      return databaseBundleFromRecord(record);
    }
  }

  const [states, recentSessions, freshSignals] = databaseReady
    ? await Promise.all([
        LearningTopicStateModel.find({ learnerId }).lean(),
        LearningSessionModel.find({ learnerId })
          .sort({ localDate: -1 })
          .limit(12)
          .select({ topicSlug: 1 })
          .lean(),
        getFreshTopicSignals(),
      ])
    : [[], [], []];
  const selection = selectLearningTopic({
    topics: adaptiveLearningCatalog,
    profile,
    states: states as unknown as TopicStateRecord[],
    recentTopicSlugs: recentSessions.map((session) => session.topicSlug),
    freshSignals,
  });
  const article = await ensureSharedArticle(selection.topic, selection.level);

  if (!databaseReady || !mongoose.isValidObjectId(article.versionId)) {
    return previewBundle(selection, article, profile);
  }

  const sessionKey = `${learnerId}:${localDate}`;
  const assignedRevision = await LearningTopicRevisionModel.findOne({
    topicSlug: selection.topic.slug,
    revision: article.topicRevision,
  }).lean();
  if (!assignedRevision) {
    throw new LearningPersistenceError(
      "Selected learning topic revision is unavailable.",
    );
  }
  const assignedTopic = assignedRevision.definition;
  const reviewAssignments = await loadDueReviews(learnerId, assignedTopic.slug);
  const created = await LearningSessionModel.findOneAndUpdate(
    { sessionKey },
    {
      $setOnInsert: {
        sessionKey,
        revision: 0,
        learnerId,
        localDate,
        status: "assigned",
        mode: profile.preferredMode,
        currentStep: 0,
        topicSlug: assignedTopic.slug,
        topicTitle: assignedTopic.title,
        topicDomain: assignedTopic.domain,
        articleReuseKey: article.reuseKey,
        articleVersionId: new mongoose.Types.ObjectId(article.versionId),
        selectionScore: selection.score,
        selectionReasons: selection.reasons,
        reasonCodes: selection.reasonCodes,
        rejectedTopicSlugs: [],
        reviewAssignments,
        responses: [],
        fieldworkStatus: "not_started",
        fieldworkRevision: 0,
        fieldworkTask: assignedTopic.seed.labTask,
        fieldworkDoneWhen: assignedTopic.seed.doneWhen,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  const record = created as unknown as LearningSessionRecord & {
    _id: mongoose.Types.ObjectId;
  };
  return databaseBundleFromRecord(record);
}

function responseValue(responses: LearningResponse[], stepId: string) {
  return responses.find((response) => response.stepId === stepId);
}

async function applyTopicEvidenceReceipt(input: {
  learnerId: string;
  topicSlug: string;
  receiptKey: string;
  attemptedAt: Date;
  nextReviewAt?: Date;
  confidenceEvidence?: number;
  incrementExposure?: boolean;
  incrementSuccessfulAttempt?: boolean;
}) {
  const receiptKeys = { $ifNull: ["$evidenceReceiptKeys", []] };
  const alreadyApplied = { $in: [input.receiptKey, receiptKeys] };
  const nextConfidence =
    typeof input.confidenceEvidence === "number"
      ? {
          $min: [
            1,
            {
              $max: [
                0,
                {
                  $add: [
                    { $multiply: ["$confidence", 0.65] },
                    input.confidenceEvidence * 0.35,
                  ],
                },
              ],
            },
          ],
        }
      : "$confidence";

  await LearningTopicStateModel.updateOne(
    { learnerId: input.learnerId, topicSlug: input.topicSlug },
    [
      {
        $set: {
          learnerId: { $ifNull: ["$learnerId", input.learnerId] },
          topicSlug: { $ifNull: ["$topicSlug", input.topicSlug] },
          recall: { $ifNull: ["$recall", 0] },
          conditional: { $ifNull: ["$conditional", 0] },
          application: { $ifNull: ["$application", 0] },
          transfer: { $ifNull: ["$transfer", 0] },
          confidence: { $ifNull: ["$confidence", 0] },
          exposureCount: { $ifNull: ["$exposureCount", 0] },
          successfulAttemptCount: { $ifNull: ["$successfulAttemptCount", 0] },
          misconceptions: { $ifNull: ["$misconceptions", []] },
          evidenceReceiptKeys: receiptKeys,
        },
      },
      {
        $set: {
          confidence: { $cond: [alreadyApplied, "$confidence", nextConfidence] },
          exposureCount: {
            $cond: [
              alreadyApplied,
              "$exposureCount",
              {
                $add: [
                  "$exposureCount",
                  input.incrementExposure === false ? 0 : 1,
                ],
              },
            ],
          },
          successfulAttemptCount: {
            $cond: [
              alreadyApplied,
              "$successfulAttemptCount",
              {
                $add: [
                  "$successfulAttemptCount",
                  input.incrementSuccessfulAttempt ? 1 : 0,
                ],
              },
            ],
          },
          lastAttemptAt: {
            $cond: [alreadyApplied, "$lastAttemptAt", input.attemptedAt],
          },
          ...(input.nextReviewAt
            ? {
                nextReviewAt: {
                  $cond: [alreadyApplied, "$nextReviewAt", input.nextReviewAt],
                },
              }
            : {}),
          evidenceReceiptKeys: {
            $cond: [
              alreadyApplied,
              "$evidenceReceiptKeys",
              { $concatArrays: ["$evidenceReceiptKeys", [input.receiptKey]] },
            ],
          },
        },
      },
    ],
    { upsert: true },
  );
}

async function updateMasteryFromSession(record: LearningSessionRecord) {
  const receiptKey = `session:${record.sessionKey}:completion:v2`;
  const receipt = responseValue(record.responses, "receipt");
  const prediction = responseValue(record.responses, "prediction");
  const transfer = responseValue(record.responses, "transfer");
  const rating = receipt?.selfRating ?? 2;
  const confidence = transfer?.confidence ?? prediction?.confidence ?? 1;
  const intervalDays = rating <= 1 ? 1 : rating === 2 ? 3 : rating === 3 ? 7 : 14;
  const attemptedAt = record.completedAt ?? new Date();
  const nextReviewAt = new Date(
    attemptedAt.valueOf() + intervalDays * 24 * 60 * 60 * 1000,
  );

  await applyTopicEvidenceReceipt({
    learnerId: record.learnerId,
    topicSlug: record.topicSlug,
    receiptKey,
    attemptedAt,
    nextReviewAt,
    confidenceEvidence: confidence / 3,
    incrementSuccessfulAttempt: false,
  });
  await applyTopicEvidenceReceipt({
    learnerId: record.learnerId,
    topicSlug: record.topicSlug,
    receiptKey: `session:${record.sessionKey}:practice:v1`,
    attemptedAt,
    incrementExposure: false,
    incrementSuccessfulAttempt: true,
  });
}

async function updateDueReviewEvidence(record: LearningSessionRecord) {
  const assignedTopicSlugs = new Set(
    (record.reviewAssignments ?? []).map((review) => review.topicSlug),
  );
  const reviewResponses = record.responses.filter(
    (response) =>
      response.stepId.startsWith("recall:") &&
      assignedTopicSlugs.has(response.stepId.slice("recall:".length)) &&
      (response.answer?.trim().length ?? 0) >= 20,
  );

  for (const response of reviewResponses) {
    const topicSlug = response.stepId.slice("recall:".length);
    if (!getCatalogTopic(topicSlug)) continue;
    const attemptedAt = record.completedAt ?? new Date();
    const selfRating = response.selfRating ?? 0;
    const intervalDays =
      selfRating <= 0
        ? 1
        : selfRating === 1
          ? 2
          : selfRating === 2
            ? 3
            : selfRating === 3
              ? 7
              : 14;
    await applyTopicEvidenceReceipt({
      learnerId: record.learnerId,
      topicSlug,
      receiptKey: `review:${record.sessionKey}:${response.stepId}:v1`,
      attemptedAt,
      nextReviewAt: new Date(
        attemptedAt.valueOf() + intervalDays * 24 * 60 * 60 * 1000,
      ),
    });
  }
}

export async function saveLearningSessionProgress(input: {
  learnerId?: string;
  sessionId: string;
  expectedRevision: number;
  mode?: LearningSessionMode;
  currentStep: number;
  response?: LearningResponse;
  responses?: LearningResponse[];
  complete?: boolean;
}) {
  const learnerId = input.learnerId ?? OWNER_LEARNER_ID;
  if (!mongoose.isValidObjectId(input.sessionId)) {
    throw new LearningPersistenceError("Learning progress requires database persistence.");
  }

  const session = await LearningSessionModel.findOne({
    _id: input.sessionId,
    learnerId,
  }).lean();
  if (!session) throw new Error("Learning session was not found.");
  const record = session as unknown as LearningSessionRecord;
  const reviewAssignments = resolveReviewAssignments(record);
  if (
    !Array.isArray(record.reviewAssignments) ||
    record.reviewAssignments.some((review) => !review.rubric) ||
    (record.reviewAssignments.length === 0 && reviewAssignments.length > 0)
  ) {
    record.reviewAssignments = reviewAssignments;
  }

  const incomingResponses = [
    ...(input.responses ?? []),
    ...(input.response ? [input.response] : []),
  ];
  const incomingStepIds = new Set(
    incomingResponses.map((response) => response.stepId),
  );
  if (incomingStepIds.size !== incomingResponses.length) {
    throw new LearningValidationError("Learning response step IDs must be unique.");
  }

  if (record.status === "completed") {
    if (input.complete) {
      const retryRequestHash = completionRequestHash({
        expectedRevision: input.expectedRevision,
        mode: input.mode ?? record.mode,
        currentStep: input.currentStep,
        responses: incomingResponses,
      });
      const legacyPayloadHash = createCompletionPayloadHash(
        input.mode ?? record.mode,
        incomingResponses,
      );
      if (
        record.completionRequestHash
          ? retryRequestHash !== record.completionRequestHash
          : !record.completionPayloadHash ||
            legacyPayloadHash !== record.completionPayloadHash
      ) {
        throw new LearningConflictError(
          "Completed learning sessions accept only an exact completion retry.",
        );
      }
      await updateMasteryFromSession(record);
      await updateDueReviewEvidence(record);
      return { saved: true, preview: false, revision: record.revision };
    }
    throw new LearningConflictError("Completed learning sessions are immutable.");
  }
  if ((record.revision ?? 0) !== input.expectedRevision) {
    throw new LearningConflictError("Learning session changed in another request.");
  }

  if (record.status !== "assigned" && input.mode && input.mode !== record.mode) {
    throw new LearningConflictError("Learning mode is locked after the session starts.");
  }

  const dueReviews = reviewAssignments;
  const allowedRecallIds = new Set([
    ...(dueReviews.length === 0 ? ["recall:current"] : []),
    ...dueReviews.map((review) => `recall:${review.topicSlug}`),
  ]);
  const allowedStepIds = new Set([
    ...fixedEvidenceStepIds,
    ...allowedRecallIds,
  ]);
  for (const response of incomingResponses) {
    if (!allowedStepIds.has(response.stepId)) {
      throw new LearningValidationError("Response was not assigned to this session.");
    }
  }

  const responses = [
    ...record.responses.filter(
      (response) =>
        allowedStepIds.has(response.stepId) &&
        !incomingStepIds.has(response.stepId),
    ),
    ...incomingResponses,
  ];
  const now = new Date();
  const selectedMode = input.mode ?? record.mode;
  let payloadHash: string | undefined;
  let requestHash: string | undefined;

  if (input.complete) {
    let articleVersion: LearningArticle;
    try {
      articleVersion = await getArticleVersionById(
        record.articleVersionId.toString(),
        record.topicSlug,
        record.articleReuseKey,
      );
    } catch {
      throw new LearningValidationError("Pinned learning article is not available.");
    }
    const validation = validateLearningCompletion({
      responses,
      mode: selectedMode,
      recallStepIds: [...allowedRecallIds],
      labSteps: articleVersion.content.lab.steps,
    });
    if (!validation.valid) {
      throw new LearningValidationError(validation.message);
    }
    payloadHash = createCompletionPayloadHash(selectedMode, responses);
    requestHash = completionRequestHash({
      expectedRevision: input.expectedRevision,
      mode: selectedMode,
      currentStep: input.currentStep,
      responses: incomingResponses,
    });
  }

  const updated = await LearningSessionModel.findOneAndUpdate(
    {
      _id: input.sessionId,
      learnerId,
      revision: input.expectedRevision,
      status: { $ne: "completed" },
    },
    {
      $set: {
        responses,
        reviewAssignments,
        currentStep: Math.max(
          record.currentStep,
          Math.max(0, Math.min(8, input.currentStep)),
        ),
        status: input.complete ? "completed" : "in_progress",
        startedAt: record.startedAt ?? now,
        ...(input.mode && record.status === "assigned" ? { mode: input.mode } : {}),
        ...(input.complete
          ? {
              completedAt: now,
              completionPayloadHash: payloadHash,
              completionRequestHash: requestHash,
            }
          : {}),
      },
      $inc: { revision: 1 },
    },
    { new: true },
  ).lean();
  if (!updated) throw new LearningConflictError("Learning session update was stale.");

  if (input.complete) {
    const completedRecord = {
      ...(updated as unknown as LearningSessionRecord),
      responses,
    };
    await updateMasteryFromSession(completedRecord);
    await updateDueReviewEvidence(completedRecord);
  }

  return {
    saved: true,
    preview: false,
    revision: (updated.revision ?? input.expectedRevision + 1),
  };
}

export async function saveFieldwork(input: {
  learnerId?: string;
  sessionId: string;
  expectedRevision: number;
  status: "not_started" | "in_progress" | "applied";
  evidence?: string;
}) {
  const learnerId = input.learnerId ?? OWNER_LEARNER_ID;
  if (!mongoose.isValidObjectId(input.sessionId)) return { saved: false };
  const evidence = input.evidence?.trim().slice(0, 4_000) ?? "";
  if (input.status === "applied" && evidence.length < 40) {
    throw new LearningValidationError(
      "Applied fieldwork requires a meaningful commit, test, ADR, or evidence note.",
    );
  }

  const current = await LearningSessionModel.findOne({
    _id: input.sessionId,
    learnerId,
    status: "completed",
  }).lean();
  if (!current) return { saved: false };
  const evidenceHash = fingerprint({ status: input.status, evidence });
  const mutationDecision = getFieldworkMutationDecision({
    currentStatus: current.fieldworkStatus,
    currentRevision: current.fieldworkRevision ?? 0,
    currentEvidenceHash: current.fieldworkEvidenceHash,
    expectedRevision: input.expectedRevision,
    nextStatus: input.status,
    nextEvidenceHash: evidenceHash,
  });
  if (mutationDecision === "exact_retry") {
      return {
        saved: true,
        revision: current.fieldworkRevision ?? 0,
        updatedAt: current.fieldworkUpdatedAt?.toISOString(),
      };
  }
  if (mutationDecision === "immutable_conflict") {
    throw new LearningConflictError("Submitted fieldwork evidence is immutable.");
  }
  if (mutationDecision === "stale_conflict") {
    throw new LearningConflictError("Fieldwork changed in another request.");
  }

  const result = await LearningSessionModel.findOneAndUpdate(
    {
      _id: input.sessionId,
      learnerId,
      status: "completed",
      ...(input.expectedRevision === 0
        ? {
            $or: [
              { fieldworkRevision: 0 },
              { fieldworkRevision: { $exists: false } },
            ],
          }
        : { fieldworkRevision: input.expectedRevision }),
      fieldworkStatus: { $ne: "applied" },
    },
    {
      $set: {
        fieldworkStatus: input.status,
        fieldworkEvidence: evidence,
        ...(input.status === "applied" ? { fieldworkEvidenceHash: evidenceHash } : {}),
        fieldworkUpdatedAt: new Date(),
      },
      $inc: { fieldworkRevision: 1 },
    },
    { new: true },
  );
  if (!result) throw new LearningConflictError("Fieldwork update was stale.");

  return {
    saved: true,
    revision: result.fieldworkRevision,
    updatedAt: result.fieldworkUpdatedAt?.toISOString(),
  };
}

export async function promoteAssignedSessionArticle(
  session: LearningSession,
  article: LearningArticle,
) {
  if (
    !mongoose.isValidObjectId(session.id) ||
    !mongoose.isValidObjectId(article.versionId)
  ) {
    return null;
  }

  const result = await LearningSessionModel.findOneAndUpdate(
    {
      _id: session.id,
      learnerId: session.learnerId,
      revision: session.revision,
      status: "assigned",
      topicSlug: session.topicSlug,
      articleReuseKey: article.reuseKey,
    },
    {
      $set: {
        articleReuseKey: article.reuseKey,
        articleVersionId: new mongoose.Types.ObjectId(article.versionId),
      },
      $inc: { revision: 1 },
    },
    { new: true },
  ).lean();
  return result
    ? toSession(
        result as unknown as LearningSessionRecord & {
          _id: mongoose.Types.ObjectId;
        },
      )
    : null;
}

export async function reselectTodayTopic(
  sessionId: string,
  expectedRevision: number,
  learnerId = OWNER_LEARNER_ID,
) {
  if (!mongoose.isValidObjectId(sessionId)) throw new Error("Invalid learning session.");
  const session = await LearningSessionModel.findOne({
    _id: sessionId,
    learnerId,
    revision: expectedRevision,
    status: "assigned",
  }).lean();
  if (!session) throw new Error("Learning session cannot be reselected.");

  const profile = await getLearnerProfile(learnerId);
  const [states, recentSessions, freshSignals] = await Promise.all([
    LearningTopicStateModel.find({ learnerId }).lean(),
    LearningSessionModel.find({ learnerId, _id: { $ne: sessionId } })
      .sort({ localDate: -1 })
      .limit(12)
      .select({ topicSlug: 1 })
      .lean(),
    getFreshTopicSignals(),
  ]);
  const rejected = new Set([
    ...(session.rejectedTopicSlugs ?? []),
    session.topicSlug,
  ]);
  const selection = rankLearningTopics({
    topics: adaptiveLearningCatalog,
    profile,
    states: states as unknown as TopicStateRecord[],
    recentTopicSlugs: recentSessions.map((item) => item.topicSlug),
    freshSignals,
  }).find((candidate) => !rejected.has(candidate.topic.slug));
  if (!selection) throw new Error("No alternative learning topic is available.");

  const article = await ensureSharedArticle(selection.topic, selection.level);
  if (!mongoose.isValidObjectId(article.versionId)) {
    return { changed: false, preview: true };
  }
  const assignedRevision = await LearningTopicRevisionModel.findOne({
    topicSlug: selection.topic.slug,
    revision: article.topicRevision,
  }).lean();
  if (!assignedRevision) {
    throw new LearningPersistenceError(
      "Alternative learning topic revision is unavailable.",
    );
  }
  const assignedTopic = assignedRevision.definition;
  const reviewAssignments = await loadDueReviews(learnerId, assignedTopic.slug);

  const updateResult = await LearningSessionModel.updateOne(
    {
      _id: sessionId,
      learnerId,
      revision: expectedRevision,
      status: "assigned",
    },
    {
      $set: {
        status: "assigned",
        currentStep: 0,
        topicSlug: assignedTopic.slug,
        topicTitle: assignedTopic.title,
        topicDomain: assignedTopic.domain,
        articleReuseKey: article.reuseKey,
        articleVersionId: new mongoose.Types.ObjectId(article.versionId),
        selectionScore: selection.score,
        selectionReasons: selection.reasons,
        reasonCodes: selection.reasonCodes,
        reviewAssignments,
        responses: [],
        fieldworkStatus: "not_started",
        fieldworkRevision: 0,
        fieldworkTask: assignedTopic.seed.labTask,
        fieldworkDoneWhen: assignedTopic.seed.doneWhen,
      },
      $addToSet: { rejectedTopicSlugs: session.topicSlug },
      $inc: { revision: 1 },
      $unset: {
        startedAt: 1,
        completedAt: 1,
        completionProjectionAppliedAt: 1,
        fieldworkEvidence: 1,
        fieldworkEvidenceHash: 1,
        fieldworkUpdatedAt: 1,
      },
    },
  );

  if (updateResult.modifiedCount !== 1) {
    throw new LearningConflictError("Learning session changed before reselection.");
  }

  return { changed: true, preview: false, topicSlug: assignedTopic.slug };
}

export async function getLearningAtlas(
  learnerId = OWNER_LEARNER_ID,
): Promise<AtlasTopic[]> {
  const databaseReady = await ensureLearningFoundation();
  const states = databaseReady
    ? await LearningTopicStateModel.find({ learnerId }).lean()
    : [];
  const stateByTopic = new Map(
    states.map((state) => [state.topicSlug, state as unknown as TopicStateRecord]),
  );

  return adaptiveLearningCatalog.map((topic) => ({
    slug: topic.slug,
    title: topic.title,
    domain: topic.domain,
    category: topic.category,
    difficulty: topic.difficulty,
    summary: topic.summary,
    prerequisites: [...topic.prerequisites],
    related: [...topic.related],
    patternWeight: topic.patternWeight,
    mastery: stateByTopic.has(topic.slug)
      ? toMastery(stateByTopic.get(topic.slug) as TopicStateRecord)
      : null,
  }));
}

export async function getLearningNotebook(
  learnerId = OWNER_LEARNER_ID,
): Promise<NotebookEntry[]> {
  if (!(await ensureLearningFoundation())) return [];

  const sessions = await LearningSessionModel.find({ learnerId, status: "completed" })
    .sort({ localDate: -1 })
    .limit(50)
    .lean();

  return sessions.map((session) => ({
    id: session._id.toString(),
    localDate: session.localDate,
    topicSlug: session.topicSlug,
    topicTitle: session.topicTitle,
    status: session.status,
    mode: session.mode,
    selectionReasons: [...session.selectionReasons],
    responses: session.responses.map((response) => ({ ...response })),
    completedAt: session.completedAt?.toISOString(),
    articleVersionId: session.articleVersionId.toString(),
  }));
}

export async function getFieldworkEntries(
  learnerId = OWNER_LEARNER_ID,
): Promise<FieldworkEntry[]> {
  if (!(await ensureLearningFoundation())) return [];

  const sessions = await LearningSessionModel.find({ learnerId, status: "completed" })
    .sort({ localDate: -1 })
    .limit(50)
    .lean();

  return sessions.flatMap((session) => {
    return [
      {
        sessionId: session._id.toString(),
        topicSlug: session.topicSlug,
        topicTitle: session.topicTitle,
        domain: session.topicDomain as FieldworkEntry["domain"],
        task: session.fieldworkTask ?? "Tarihsel saha görevi açıklaması mevcut değil.",
        doneWhen:
          session.fieldworkDoneWhen ?? "Kanıtı doğrulanabilir bir notla kaydet.",
        status: session.fieldworkStatus,
        immutable: session.fieldworkStatus === "applied",
        revision: session.fieldworkRevision ?? 0,
        evidence: session.fieldworkEvidence,
        updatedAt: session.fieldworkUpdatedAt?.toISOString(),
      },
    ];
  });
}
