import { describe, expect, it } from "vitest";
import { adaptiveLearningCatalog } from "@/data/adaptiveLearningCatalog";
import {
  rankLearningTopics,
  selectLearningTopic,
} from "@/modules/learning/selection";
import type {
  LearnerProfileRecord,
  TopicStateRecord,
} from "@/modules/learning/models";

const profile: LearnerProfileRecord = {
  learnerId: "test",
  locale: "tr-TR",
  timeZone: "Europe/Istanbul",
  preferredMode: "standard",
  goals: ["full-stack", "design-patterns"],
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
  projectContexts: ["VTrade", "code-review"],
  profileVersion: 1,
};

function state(topicSlug: string, overrides: Partial<TopicStateRecord> = {}): TopicStateRecord {
  return {
    learnerId: "test",
    topicSlug,
    recall: 0.7,
    conditional: 0.7,
    application: 0.6,
    transfer: 0.5,
    confidence: 0.6,
    exposureCount: 2,
    successfulAttemptCount: 1,
    misconceptions: [],
    evidenceReceiptKeys: [],
    ...overrides,
  };
}

describe("adaptive topic selection", () => {
  it("starts from a high-value full-stack architecture foundation", () => {
    const selection = selectLearningTopic({
      topics: adaptiveLearningCatalog,
      profile,
      states: [],
      recentTopicSlugs: [],
      now: new Date("2026-08-10T08:00:00.000Z"),
    });

    expect(selection.topic.domain).toBe("architecture");
    expect(selection.topic.patternWeight).toBeGreaterThanOrEqual(4);
    expect(selection.reasonCodes).toContain("design_pattern_priority");
    expect(selection.reasonCodes).toContain("full_stack_career_value");
  });

  it("does not repeat the same recent topic when another foundation is available", () => {
    const first = selectLearningTopic({
      topics: adaptiveLearningCatalog,
      profile,
      states: [],
      recentTopicSlugs: [],
    });
    const next = selectLearningTopic({
      topics: adaptiveLearningCatalog,
      profile,
      states: [state(first.topic.slug)],
      recentTopicSlugs: [first.topic.slug],
    });

    expect(next.topic.slug).not.toBe(first.topic.slug);
  });

  it("brings a due concept back without making news the sole authority", () => {
    const dueTopic = "dependency-inversion-and-injection";
    const selection = selectLearningTopic({
      topics: adaptiveLearningCatalog,
      profile,
      states: [
        state(dueTopic, {
          recall: 0.2,
          conditional: 0.2,
          application: 0.1,
          transfer: 0.1,
          nextReviewAt: new Date("2026-08-01T08:00:00.000Z"),
        }),
      ],
      recentTopicSlugs: [],
      freshSignals: [
        {
          topicSlug: "ai-guardrails-and-human-review",
          strength: 1,
          reason: "Yeni bir AI haberi bulundu.",
        },
      ],
      now: new Date("2026-08-10T08:00:00.000Z"),
    });

    expect(selection.topic.slug).toBe(dueTopic);
    expect(selection.reasonCodes).toContain("review_due");
  });

  it("requires practice evidence for every prerequisite", () => {
    const topicSlug = "unit-of-work-pattern";
    const topic = adaptiveLearningCatalog.find((candidate) => candidate.slug === topicSlug);
    expect(topic).toBeDefined();
    const [firstPrerequisite, secondPrerequisite] = topic?.prerequisites ?? [];
    expect(firstPrerequisite).toBeDefined();
    expect(secondPrerequisite).toBeDefined();

    const incomplete = rankLearningTopics({
      topics: adaptiveLearningCatalog,
      profile,
      states: [
        state(firstPrerequisite, {
          recall: 0,
          conditional: 0,
          application: 0,
          transfer: 0,
          exposureCount: 3,
          successfulAttemptCount: 3,
        }),
      ],
      recentTopicSlugs: [],
    }).find((candidate) => candidate.topic.slug === topicSlug);
    const ready = rankLearningTopics({
      topics: adaptiveLearningCatalog,
      profile,
      states: [
        state(firstPrerequisite, { exposureCount: 3, successfulAttemptCount: 3 }),
        state(secondPrerequisite, { exposureCount: 3, successfulAttemptCount: 3 }),
      ],
      recentTopicSlugs: [],
    }).find((candidate) => candidate.topic.slug === topicSlug);

    expect(incomplete?.reasonCodes).not.toContain("prerequisites_ready");
    expect(ready?.reasonCodes).toContain("prerequisites_ready");
    expect(ready?.score ?? 0).toBeGreaterThan(incomplete?.score ?? 0);
  });

  it("penalizes a repeated domain streak independently of exact topic repetition", () => {
    const targetSlug = "dependency-inversion-and-injection";
    const architectureRecent = [
      "hexagonal-architecture",
      "bounded-contexts",
      "strategy-pattern",
    ];
    const mixedRecent = [
      "http-request-lifecycle",
      "relational-modeling-and-constraints",
      "react-state-ownership",
    ];
    const score = (recentTopicSlugs: string[]) =>
      rankLearningTopics({
        topics: adaptiveLearningCatalog,
        profile,
        states: [],
        recentTopicSlugs,
      }).find((candidate) => candidate.topic.slug === targetSlug)?.score ?? 0;

    expect(score(mixedRecent) - score(architectureRecent)).toBe(34);
  });

  it("uses completed practice to reduce an unassessed gap without inventing mastery", () => {
    const topicSlug = "dependency-inversion-and-injection";
    const score = (states: TopicStateRecord[]) =>
      rankLearningTopics({
        topics: adaptiveLearningCatalog,
        profile,
        states,
        recentTopicSlugs: [],
      }).find((candidate) => candidate.topic.slug === topicSlug)?.score ?? 0;
    const practiced = state(topicSlug, {
      recall: 0,
      conditional: 0,
      application: 0,
      transfer: 0,
      exposureCount: 3,
      successfulAttemptCount: 3,
    });

    expect(score([])).toBeGreaterThan(score([practiced]));
    expect(practiced.recall).toBe(0);
    expect(practiced.application).toBe(0);
  });
});
