import type {
  TopicDefinition,
  TopicDifficulty,
  TopicDomain,
} from "@/data/adaptiveLearningCatalog";

export type LearningLevel = TopicDifficulty;
export type LearningDomain = TopicDomain;
export type LearningSessionMode = "quick" | "standard" | "deep";

export type EvidenceCitation = {
  key: string;
  snapshotKey?: string;
  label: string;
  url: string;
  authority: "primary" | "strong-secondary" | "discovery-only";
  excerpt?: string;
  publishedAt?: string;
  fetchedAt?: string;
};

export type LearningArticleSection = {
  id: string;
  heading: string;
  body: string;
  evidenceKeys: string[];
};

export type LearningArticleContent = {
  title: string;
  dek: string;
  durablePrinciple: string;
  openingCase: string;
  predictionPrompt: string;
  mentalModel: string;
  sections: LearningArticleSection[];
  diagram: {
    title: string;
    nodes: string[];
    edges: { from: number; to: number; label: string }[];
  };
  workedExample: string;
  comparison: {
    title: string;
    items: { name: string; whenToUse: string; tradeoff: string }[];
  };
  lab: {
    title: string;
    task: string;
    steps: string[];
    doneWhen: string;
  };
  transferPrompt: string;
  reviewQuestions: string[];
  reflectionPrompt: string;
  estimatedMinutes: number;
};

export type LearningArticle = {
  reuseKey: string;
  version: number;
  versionId: string;
  topicSlug: string;
  topicRevision: number;
  level: LearningLevel;
  locale: string;
  origin: "curated" | "deepseek" | "hybrid";
  content: LearningArticleContent;
  citations: EvidenceCitation[];
  provenance: {
    schemaVersion: number;
    pedagogyVersion: number;
    promptVersion: number;
    model?: string;
    generatedAt: string;
    sourceFingerprint: string;
    contentHash: string;
  };
};

export type TopicMastery = {
  topicSlug: string;
  recall: number;
  conditional: number;
  application: number;
  transfer: number;
  confidence: number;
  exposureCount: number;
  lastAttemptAt?: string;
  nextReviewAt?: string;
};

export type TopicSelection = {
  topic: TopicDefinition;
  score: number;
  reasons: string[];
  reasonCodes: string[];
  level: LearningLevel;
};

export type DueReview = {
  topicSlug: string;
  title: string;
  prompt: string;
  rubric: string;
  lastSeenAt?: string;
};

export type LearningResponse = {
  stepId: string;
  answer?: string;
  confidence?: 1 | 2 | 3;
  checkedItems?: string[];
  selfRating?: 0 | 1 | 2 | 3 | 4;
  updatedAt: string;
};

export type LearningSession = {
  id: string;
  revision: number;
  learnerId: string;
  localDate: string;
  status: "assigned" | "in_progress" | "completed";
  mode: LearningSessionMode;
  currentStep: number;
  topicSlug: string;
  topicTitle: string;
  topicDomain: LearningDomain;
  articleVersionId: string;
  selectionScore: number;
  selectionReasons: string[];
  reasonCodes: string[];
  responses: LearningResponse[];
  startedAt?: string;
  completedAt?: string;
};

export type LearningSessionBundle = {
  session: LearningSession;
  article: LearningArticle;
  topic: TopicDefinition;
  dueReviews: DueReview[];
  mastery: TopicMastery | null;
  stats: {
    studiedTopics: number;
    appliedTopics: number;
    dueReviews: number;
    completedSessions: number;
  };
  persistence: "database" | "preview";
};

export type AtlasTopic = {
  slug: string;
  title: string;
  domain: LearningDomain;
  category: string;
  difficulty: LearningLevel;
  summary: string;
  prerequisites: string[];
  related: string[];
  patternWeight: number;
  mastery: TopicMastery | null;
};

export type NotebookEntry = {
  id: string;
  localDate: string;
  topicSlug: string;
  topicTitle: string;
  status: LearningSession["status"];
  mode: LearningSessionMode;
  selectionReasons: string[];
  responses: LearningResponse[];
  completedAt?: string;
  articleVersionId: string;
};

export type FieldworkEntry = {
  sessionId: string;
  revision: number;
  topicSlug: string;
  topicTitle: string;
  domain: LearningDomain;
  task: string;
  doneWhen: string;
  status: "not_started" | "in_progress" | "applied";
  immutable: boolean;
  evidence?: string;
  updatedAt?: string;
};
