import "server-only";

import mongoose, { Schema, type Model } from "mongoose";
import type { TopicDefinition } from "@/data/adaptiveLearningCatalog";
import type {
  DueReview,
  LearningArticleContent,
  LearningLevel,
  LearningResponse,
  LearningSessionMode,
} from "@/modules/learning/types";

export type TopicRecord = {
  slug: string;
  status: "published" | "retired";
  domain: string;
  category: string;
  currentRevision: number;
  currentRevisionHash: string;
};

export type TopicRevisionRecord = {
  topicSlug: string;
  revision: number;
  revisionHash: string;
  definition: TopicDefinition;
  publishedAt: Date;
};

export type SourceRecord = {
  key: string;
  label: string;
  url: string;
  kind: string;
  authority: string;
  domains: string[];
  refreshHours: number | null;
  storagePolicy: string;
  searchQueries: string[];
  githubRepository?: { owner: string; repo: string };
  lastFetchedAt?: Date;
};

export type SourceSnapshotRecord = {
  snapshotKey: string;
  sourceKey: string;
  externalId?: string;
  title: string;
  url: string;
  excerpt: string;
  authority: string;
  contentHash: string;
  publishedAt?: Date;
  fetchedAt: Date;
  metadata?: Record<string, unknown>;
};

export type SharedArticleRecord = {
  reuseKey: string;
  topicSlug: string;
  topicRevision: number;
  topicRevisionHash: string;
  locale: string;
  level: LearningLevel;
  schemaVersion: number;
  pedagogyVersion: number;
  currentVersion: number;
  currentVersionId: mongoose.Types.ObjectId;
  status: "published" | "refreshing";
  refreshAfter?: Date;
  refreshClaimedAt?: Date;
  refreshClaimId?: string;
};

export type ArticleVersionRecord = {
  reuseKey: string;
  version: number;
  topicSlug: string;
  topicRevision: number;
  locale: string;
  level: LearningLevel;
  origin: "curated" | "deepseek" | "hybrid";
  status: "published" | "superseded" | "retracted";
  content: LearningArticleContent;
  citationKeys: string[];
  sourceSnapshotKeys: string[];
  citations: {
    key: string;
    snapshotKey?: string;
    label: string;
    url: string;
    authority: "primary" | "strong-secondary" | "discovery-only";
    excerpt?: string;
    publishedAt?: string;
    fetchedAt?: string;
  }[];
  provenance: {
    schemaVersion: number;
    pedagogyVersion: number;
    promptVersion: number;
    model?: string;
    generatedAt: Date;
    sourceFingerprint: string;
    contentHash: string;
    inputTokens?: number;
    outputTokens?: number;
  };
  quality?: {
    schemaPassed: boolean;
    citationCoverage: number;
  };
};

export type LearnerProfileRecord = {
  learnerId: string;
  locale: string;
  timeZone: string;
  preferredMode: LearningSessionMode;
  goals: string[];
  domainWeights: Record<string, number>;
  designPatternPriority: number;
  projectContexts: string[];
  profileVersion: number;
};

export type TopicStateRecord = {
  learnerId: string;
  topicSlug: string;
  recall: number;
  conditional: number;
  application: number;
  transfer: number;
  confidence: number;
  exposureCount: number;
  successfulAttemptCount: number;
  misconceptions: string[];
  evidenceReceiptKeys: string[];
  lastAttemptAt?: Date;
  nextReviewAt?: Date;
};

export type LearningSessionRecord = {
  sessionKey: string;
  revision: number;
  learnerId: string;
  localDate: string;
  status: "assigned" | "in_progress" | "completed";
  mode: LearningSessionMode;
  currentStep: number;
  topicSlug: string;
  topicTitle: string;
  topicDomain: string;
  articleReuseKey: string;
  articleVersionId: mongoose.Types.ObjectId;
  selectionScore: number;
  selectionReasons: string[];
  reasonCodes: string[];
  rejectedTopicSlugs: string[];
  reviewAssignments: DueReview[];
  responses: LearningResponse[];
  completionPayloadHash?: string;
  completionRequestHash?: string;
  fieldworkStatus: "not_started" | "in_progress" | "applied";
  fieldworkRevision: number;
  fieldworkTask?: string;
  fieldworkDoneWhen?: string;
  fieldworkEvidence?: string;
  fieldworkEvidenceHash?: string;
  fieldworkUpdatedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  completionProjectionAppliedAt?: Date;
  notificationSentAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ResearchRunRecord = {
  runKey: string;
  kind: "source_refresh" | "article_generation" | "daily_orchestration";
  status: "running" | "succeeded" | "failed";
  claimId: string;
  topicSlug?: string;
  sourceKeys: string[];
  sourceSnapshotKeys: string[];
  providerCalls: {
    provider: string;
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
    latencyMs: number;
  }[];
  safeError?: string;
  startedAt: Date;
  completedAt?: Date;
};

export type LoginAttemptRecord = {
  bucketKey: string;
  attempts: number;
  expiresAt: Date;
};

function existingModel<T>(name: string) {
  return mongoose.models[name] as Model<T> | undefined;
}

const topicSchema = new Schema<TopicRecord>(
  {
    slug: { type: String, required: true },
    status: { type: String, enum: ["published", "retired"], required: true },
    domain: { type: String, required: true },
    category: { type: String, required: true },
    currentRevision: { type: Number, required: true },
    currentRevisionHash: { type: String, required: true },
  },
  { collection: "learning_topics", timestamps: true },
);
topicSchema.index({ slug: 1 }, { unique: true });

const topicRevisionSchema = new Schema<TopicRevisionRecord>(
  {
    topicSlug: { type: String, required: true },
    revision: { type: Number, required: true },
    revisionHash: { type: String, required: true },
    definition: { type: Schema.Types.Mixed, required: true },
    publishedAt: { type: Date, required: true },
  },
  { collection: "learning_topic_revisions", timestamps: true },
);
topicRevisionSchema.index({ topicSlug: 1, revision: 1 }, { unique: true });
topicRevisionSchema.index({ topicSlug: 1, revisionHash: 1 }, { unique: true });

const sourceSchema = new Schema<SourceRecord>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    kind: { type: String, required: true },
    authority: { type: String, required: true },
    domains: [{ type: String, required: true }],
    refreshHours: { type: Number, default: null },
    storagePolicy: { type: String, required: true },
    searchQueries: [{ type: String, required: true }],
    githubRepository: {
      _id: false,
      owner: String,
      repo: String,
    },
    lastFetchedAt: Date,
  },
  { collection: "learning_sources", timestamps: true },
);
sourceSchema.index({ key: 1 }, { unique: true });

const sourceSnapshotSchema = new Schema<SourceSnapshotRecord>(
  {
    snapshotKey: { type: String, required: true },
    sourceKey: { type: String, required: true },
    externalId: String,
    title: { type: String, required: true },
    url: { type: String, required: true },
    excerpt: { type: String, required: true },
    authority: { type: String, required: true },
    contentHash: { type: String, required: true },
    publishedAt: Date,
    fetchedAt: { type: Date, required: true },
    metadata: Schema.Types.Mixed,
  },
  { collection: "learning_source_snapshots", timestamps: true },
);
sourceSnapshotSchema.index({ snapshotKey: 1 }, { unique: true });
sourceSnapshotSchema.index({ sourceKey: 1, fetchedAt: -1 });

const sharedArticleSchema = new Schema<SharedArticleRecord>(
  {
    reuseKey: { type: String, required: true },
    topicSlug: { type: String, required: true },
    topicRevision: { type: Number, required: true },
    topicRevisionHash: { type: String, required: true },
    locale: { type: String, required: true },
    level: { type: String, required: true },
    schemaVersion: { type: Number, required: true },
    pedagogyVersion: { type: Number, required: true },
    currentVersion: { type: Number, required: true },
    currentVersionId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ["published", "refreshing"], required: true },
    refreshAfter: Date,
    refreshClaimedAt: Date,
    refreshClaimId: String,
  },
  { collection: "learning_shared_articles", timestamps: true },
);
sharedArticleSchema.index({ reuseKey: 1 }, { unique: true });
sharedArticleSchema.index({ topicSlug: 1, locale: 1, level: 1 });

const articleVersionSchema = new Schema<ArticleVersionRecord>(
  {
    reuseKey: { type: String, required: true },
    version: { type: Number, required: true },
    topicSlug: { type: String, required: true },
    topicRevision: { type: Number, required: true },
    locale: { type: String, required: true },
    level: { type: String, required: true },
    origin: { type: String, enum: ["curated", "deepseek", "hybrid"], required: true },
    status: {
      type: String,
      enum: ["published", "superseded", "retracted"],
      required: true,
    },
    content: { type: Schema.Types.Mixed, required: true },
    citationKeys: [{ type: String, required: true }],
    sourceSnapshotKeys: [{ type: String, required: true }],
    citations: [{ type: Schema.Types.Mixed, required: true }],
    provenance: { type: Schema.Types.Mixed, required: true },
    quality: Schema.Types.Mixed,
  },
  { collection: "learning_article_versions", timestamps: true },
);
articleVersionSchema.index({ reuseKey: 1, version: 1 }, { unique: true });

const learnerProfileSchema = new Schema<LearnerProfileRecord>(
  {
    learnerId: { type: String, required: true },
    locale: { type: String, required: true },
    timeZone: { type: String, required: true },
    preferredMode: { type: String, enum: ["quick", "standard", "deep"], required: true },
    goals: [{ type: String, required: true }],
    domainWeights: { type: Schema.Types.Mixed, required: true },
    designPatternPriority: { type: Number, required: true },
    projectContexts: [{ type: String, required: true }],
    profileVersion: { type: Number, required: true },
  },
  { collection: "learning_learner_profiles", timestamps: true },
);
learnerProfileSchema.index({ learnerId: 1 }, { unique: true });

const topicStateSchema = new Schema<TopicStateRecord>(
  {
    learnerId: { type: String, required: true },
    topicSlug: { type: String, required: true },
    recall: { type: Number, required: true, default: 0 },
    conditional: { type: Number, required: true, default: 0 },
    application: { type: Number, required: true, default: 0 },
    transfer: { type: Number, required: true, default: 0 },
    confidence: { type: Number, required: true, default: 0 },
    exposureCount: { type: Number, required: true, default: 0 },
    successfulAttemptCount: { type: Number, required: true, default: 0 },
    misconceptions: [{ type: String, required: true }],
    evidenceReceiptKeys: { type: [String], required: true, default: [] },
    lastAttemptAt: Date,
    nextReviewAt: Date,
  },
  { collection: "learning_topic_states", timestamps: true },
);
topicStateSchema.index({ learnerId: 1, topicSlug: 1 }, { unique: true });
topicStateSchema.index({ learnerId: 1, nextReviewAt: 1 });

const dueReviewSchema = new Schema<DueReview>(
  {
    topicSlug: { type: String, required: true },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    rubric: { type: String, required: true },
    lastSeenAt: String,
  },
  { _id: false },
);

const learningSessionSchema = new Schema<LearningSessionRecord>(
  {
    sessionKey: { type: String, required: true },
    revision: { type: Number, required: true, default: 0, min: 0 },
    learnerId: { type: String, required: true },
    localDate: { type: String, required: true },
    status: { type: String, enum: ["assigned", "in_progress", "completed"], required: true },
    mode: { type: String, enum: ["quick", "standard", "deep"], required: true },
    currentStep: { type: Number, required: true },
    topicSlug: { type: String, required: true },
    topicTitle: { type: String, required: true },
    topicDomain: { type: String, required: true },
    articleReuseKey: { type: String, required: true },
    articleVersionId: { type: Schema.Types.ObjectId, required: true },
    selectionScore: { type: Number, required: true },
    selectionReasons: [{ type: String, required: true }],
    reasonCodes: [{ type: String, required: true }],
    rejectedTopicSlugs: { type: [String], required: true, default: [] },
    reviewAssignments: { type: [dueReviewSchema], required: true, default: [] },
    responses: [{ type: Schema.Types.Mixed, required: true }],
    completionPayloadHash: String,
    completionRequestHash: String,
    fieldworkStatus: {
      type: String,
      enum: ["not_started", "in_progress", "applied"],
      default: "not_started",
      required: true,
    },
    fieldworkRevision: { type: Number, required: true, default: 0, min: 0 },
    fieldworkTask: String,
    fieldworkDoneWhen: String,
    fieldworkEvidence: String,
    fieldworkEvidenceHash: String,
    fieldworkUpdatedAt: Date,
    startedAt: Date,
    completedAt: Date,
    completionProjectionAppliedAt: Date,
    notificationSentAt: Date,
  },
  { collection: "learning_sessions", timestamps: true },
);
learningSessionSchema.index({ sessionKey: 1 }, { unique: true });
learningSessionSchema.index({ learnerId: 1, localDate: 1 }, { unique: true });
learningSessionSchema.index({ learnerId: 1, status: 1, localDate: -1 });

const researchRunSchema = new Schema<ResearchRunRecord>(
  {
    runKey: { type: String, required: true },
    kind: { type: String, required: true },
    status: { type: String, enum: ["running", "succeeded", "failed"], required: true },
    claimId: { type: String, required: true },
    topicSlug: String,
    sourceKeys: [{ type: String, required: true }],
    sourceSnapshotKeys: [{ type: String, required: true }],
    providerCalls: [{ type: Schema.Types.Mixed, required: true }],
    safeError: String,
    startedAt: { type: Date, required: true },
    completedAt: Date,
  },
  { collection: "learning_research_runs", timestamps: true },
);
researchRunSchema.index({ runKey: 1 }, { unique: true });

const loginAttemptSchema = new Schema<LoginAttemptRecord>(
  {
    bucketKey: { type: String, required: true },
    attempts: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { collection: "learning_login_attempts", timestamps: true },
);
loginAttemptSchema.index({ bucketKey: 1 }, { unique: true });
loginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const LearningTopicModel =
  existingModel<TopicRecord>("LearningTopic") ??
  mongoose.model<TopicRecord>("LearningTopic", topicSchema);

export const LearningTopicRevisionModel =
  existingModel<TopicRevisionRecord>("LearningTopicRevision") ??
  mongoose.model<TopicRevisionRecord>("LearningTopicRevision", topicRevisionSchema);

export const LearningSourceModel =
  existingModel<SourceRecord>("LearningSource") ??
  mongoose.model<SourceRecord>("LearningSource", sourceSchema);

export const LearningSourceSnapshotModel =
  existingModel<SourceSnapshotRecord>("LearningSourceSnapshot") ??
  mongoose.model<SourceSnapshotRecord>("LearningSourceSnapshot", sourceSnapshotSchema);

export const LearningSharedArticleModel =
  existingModel<SharedArticleRecord>("LearningSharedArticle") ??
  mongoose.model<SharedArticleRecord>("LearningSharedArticle", sharedArticleSchema);

export const LearningArticleVersionModel =
  existingModel<ArticleVersionRecord>("LearningArticleVersion") ??
  mongoose.model<ArticleVersionRecord>("LearningArticleVersion", articleVersionSchema);

export const LearningLearnerProfileModel =
  existingModel<LearnerProfileRecord>("LearningLearnerProfile") ??
  mongoose.model<LearnerProfileRecord>("LearningLearnerProfile", learnerProfileSchema);

export const LearningTopicStateModel =
  existingModel<TopicStateRecord>("LearningTopicState") ??
  mongoose.model<TopicStateRecord>("LearningTopicState", topicStateSchema);

export const LearningSessionModel =
  existingModel<LearningSessionRecord>("LearningSession") ??
  mongoose.model<LearningSessionRecord>("LearningSession", learningSessionSchema);

export const LearningResearchRunModel =
  existingModel<ResearchRunRecord>("LearningResearchRun") ??
  mongoose.model<ResearchRunRecord>("LearningResearchRun", researchRunSchema);

export const LearningLoginAttemptModel =
  existingModel<LoginAttemptRecord>("LearningLoginAttempt") ??
  mongoose.model<LoginAttemptRecord>("LearningLoginAttempt", loginAttemptSchema);
