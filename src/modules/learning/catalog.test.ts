import { describe, expect, it } from "vitest";
import { adaptiveLearningCatalog } from "@/data/adaptiveLearningCatalog";
import { learningSourceRegistry } from "@/data/learningSourceRegistry";

describe("adaptive learning catalog", () => {
  it("keeps canonical slugs and graph references valid", () => {
    const slugs = adaptiveLearningCatalog.map((topic) => topic.slug);
    const knownSlugs = new Set(slugs);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(adaptiveLearningCatalog.length).toBeGreaterThanOrEqual(48);

    for (const topic of adaptiveLearningCatalog) {
      for (const prerequisite of topic.prerequisites) {
        expect(knownSlugs.has(prerequisite), `${topic.slug} -> ${prerequisite}`).toBe(true);
      }
      for (const related of topic.related) {
        expect(knownSlugs.has(related), `${topic.slug} -> ${related}`).toBe(true);
      }
      for (const edge of topic.seed.diagram.edges) {
        expect(edge.from).toBeGreaterThanOrEqual(0);
        expect(edge.to).toBeGreaterThanOrEqual(0);
        expect(edge.from).toBeLessThan(topic.seed.diagram.nodes.length);
        expect(edge.to).toBeLessThan(topic.seed.diagram.nodes.length);
      }
      expect(topic.seed.reviewQuestions.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("prioritizes full-stack reasoning and design patterns", () => {
    const patternTopics = adaptiveLearningCatalog.filter(
      (topic) => topic.domain === "architecture" && topic.patternWeight >= 4,
    );
    const highCareerTopics = adaptiveLearningCatalog.filter(
      (topic) => topic.careerWeight === 5,
    );

    expect(patternTopics.length).toBeGreaterThanOrEqual(16);
    expect(highCareerTopics.length).toBeGreaterThanOrEqual(20);
  });

  it("only references registered learning sources", () => {
    const sourceKeys = new Set(learningSourceRegistry.map((source) => source.key));

    for (const topic of adaptiveLearningCatalog) {
      for (const sourceKey of topic.sourceKeys) {
        expect(sourceKeys.has(sourceKey), `${topic.slug} -> ${sourceKey}`).toBe(true);
      }
    }
  });
});
