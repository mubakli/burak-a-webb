import type { TopicDefinition } from "@/data/adaptiveLearningCatalog";
import type {
  LearnerProfileRecord,
  TopicStateRecord,
} from "@/modules/learning/models";
import type { TopicSelection } from "@/modules/learning/types";

export type FreshTopicSignal = {
  topicSlug: string;
  strength: number;
  reason: string;
};

type SelectionInput = {
  topics: readonly TopicDefinition[];
  profile: LearnerProfileRecord;
  states: readonly TopicStateRecord[];
  recentTopicSlugs: readonly string[];
  freshSignals?: readonly FreshTopicSignal[];
  now?: Date;
};

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function masteryAverage(state: TopicStateRecord | undefined) {
  if (!state) return 0;
  return (state.recall + state.conditional + state.application + state.transfer) / 4;
}

function practiceReadiness(state: TopicStateRecord | undefined) {
  if (!state) return 0;
  const assessedEvidence = clamp(masteryAverage(state) / 0.55);
  const completedPractice = clamp(
    state.successfulAttemptCount * 0.3 + state.exposureCount * 0.08,
    0,
    0.85,
  );
  return Math.max(assessedEvidence, completedPractice);
}

function learningGap(state: TopicStateRecord | undefined) {
  if (!state) return 1;
  const assessedEvidence = masteryAverage(state);
  const completedPractice = clamp(
    state.successfulAttemptCount * 0.12 + state.exposureCount * 0.03,
    0,
    0.45,
  );
  return 1 - Math.max(assessedEvidence, completedPractice);
}

function dueScore(state: TopicStateRecord | undefined, now: Date) {
  if (!state) return 14;
  if (!state.nextReviewAt) return Math.max(4, 12 - state.exposureCount * 2);

  const daysUntilReview =
    (new Date(state.nextReviewAt).valueOf() - now.valueOf()) / (24 * 60 * 60 * 1000);
  if (daysUntilReview <= 0) return Math.min(25, 18 + Math.abs(daysUntilReview));
  return Math.max(0, 8 - daysUntilReview * 2);
}

function getPrerequisiteReadiness(
  topic: TopicDefinition,
  stateByTopic: Map<string, TopicStateRecord>,
) {
  if (topic.prerequisites.length === 0) return 1;

  const readiness = topic.prerequisites.map((slug) => {
    return practiceReadiness(stateByTopic.get(slug));
  });

  return Math.min(...readiness);
}

function getRecentPenalty(slug: string, recent: readonly string[]) {
  const position = recent.indexOf(slug);
  if (position === -1) return 0;
  if (position < 3) return 45;
  if (position < 7) return 24;
  return 10;
}

function getDomainStreakPenalty(
  topic: TopicDefinition,
  recent: readonly string[],
  topicBySlug: Map<string, TopicDefinition>,
) {
  const leadingDomains = recent
    .slice(0, 3)
    .map((slug) => topicBySlug.get(slug)?.domain)
    .filter(Boolean);
  if (leadingDomains.length >= 3 && leadingDomains.every((domain) => domain === topic.domain)) {
    return 34;
  }
  if (leadingDomains.length >= 2 && leadingDomains.slice(0, 2).every((domain) => domain === topic.domain)) {
    return 18;
  }
  return 0;
}

function getFreshSignal(
  slug: string,
  freshSignals: readonly FreshTopicSignal[],
) {
  return freshSignals
    .filter((signal) => signal.topicSlug === slug)
    .sort((left, right) => right.strength - left.strength)[0];
}

function projectRelevance(topic: TopicDefinition, profile: LearnerProfileRecord) {
  const profileContexts = profile.projectContexts.map((context) =>
    context.toLocaleLowerCase("tr-TR"),
  );
  const matches = topic.projectContexts.filter((topicContext) => {
    const normalized = topicContext.toLocaleLowerCase("tr-TR");
    return profileContexts.some((profileContext) => {
      const anchors = ["vtrade", "code-review", "converter", "taskmanagment", "next.js", "asp.net"];
      return anchors.some(
        (anchor) => normalized.includes(anchor) && profileContext.includes(anchor),
      );
    });
  });
  return { score: Math.min(10, matches.length * 4), matches };
}

export function rankLearningTopics({
  topics,
  profile,
  states,
  recentTopicSlugs,
  freshSignals = [],
  now = new Date(),
}: SelectionInput): TopicSelection[] {
  const stateByTopic = new Map(states.map((state) => [state.topicSlug, state]));
  const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));

  return topics
    .map((topic) => {
      const state = stateByTopic.get(topic.slug);
      const prerequisiteReadiness = getPrerequisiteReadiness(topic, stateByTopic);
      const domainWeight = profile.domainWeights[topic.domain] ?? 2;
      const freshSignal = getFreshSignal(topic.slug, freshSignals);
      const project = projectRelevance(topic, profile);

      const gapScore = learningGap(state) * 20;
      const reviewScore = dueScore(state, now);
      const careerScore = topic.careerWeight * 4;
      const patternScore =
        topic.patternWeight * (profile.designPatternPriority / 5) * 3;
      const domainScore = domainWeight * 2;
      const readinessScore = prerequisiteReadiness * 8;
      const freshScore = freshSignal ? clamp(freshSignal.strength) * 5 : 0;
      const advancedPenalty =
        topic.difficulty === "advanced" && prerequisiteReadiness < 0.65 ? 14 : 0;
      const prerequisitePenalty = (1 - prerequisiteReadiness) * 22;
      const recentPenalty = getRecentPenalty(topic.slug, recentTopicSlugs);
      const domainStreakPenalty = getDomainStreakPenalty(
        topic,
        recentTopicSlugs,
        topicBySlug,
      );
      const score =
        gapScore +
        reviewScore +
        careerScore +
        patternScore +
        domainScore +
        project.score +
        readinessScore +
        freshScore -
        advancedPenalty -
        prerequisitePenalty -
        recentPenalty -
        domainStreakPenalty;

      const reasons: string[] = [];
      const reasonCodes: string[] = [];

      if (topic.patternWeight >= 4) {
        reasons.push(
          "Design pattern ve mimari karar verme odağınla doğrudan ilişkili.",
        );
        reasonCodes.push("design_pattern_priority");
      }
      if (topic.careerWeight >= 5) {
        reasons.push(
          "Full-stack kariyerinde farklı katmanlara taşınabilen yüksek kaldıraçlı bir yetkinlik.",
        );
        reasonCodes.push("full_stack_career_value");
      }
      if (project.matches.length > 0) {
        reasons.push(
          `${project.matches.slice(0, 2).join(" ve ")} bağlamında doğrudan uygulama alanı taşıyor.`,
        );
        reasonCodes.push("active_project_relevance");
      }
      if (state?.nextReviewAt && new Date(state.nextReviewAt) <= now) {
        reasons.push("Önceki öğrenmenin kalıcı olup olmadığını kontrol etme zamanı geldi.");
        reasonCodes.push("review_due");
      } else if (!state) {
        reasons.push("Bu konuda henüz kayıtlı bir öğrenme kanıtın bulunmuyor.");
        reasonCodes.push("unexplored_gap");
      }
      if (prerequisiteReadiness >= 0.8 && topic.prerequisites.length > 0) {
        reasons.push("Ön koşullarda yeterli değerlendirme veya tamamlanmış pratik kanıtın var.");
        reasonCodes.push("prerequisites_ready");
      }
      if (freshSignal) {
        reasons.push(freshSignal.reason);
        reasonCodes.push("fresh_relevant_evidence");
      }

      return {
        topic,
        score: Math.round(score * 10) / 10,
        reasons: reasons.slice(0, 4),
        reasonCodes,
        level: topic.difficulty,
      };
    })
    .sort((left, right) => right.score - left.score || left.topic.slug.localeCompare(right.topic.slug));
}

export function selectLearningTopic(input: SelectionInput) {
  const [selection] = rankLearningTopics(input);
  if (!selection) throw new Error("Learning catalog does not contain a selectable topic.");
  return selection;
}
