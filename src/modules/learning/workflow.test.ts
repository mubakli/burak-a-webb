import { describe, expect, it } from "vitest";
import {
  canonicalizeCompletionPayload,
  getFieldworkMutationDecision,
  getRequiredLabItems,
  validateLearningCompletion,
} from "@/modules/learning/workflow";
import type { LearningResponse } from "@/modules/learning/types";

const now = "2026-08-10T08:00:00.000Z";
const responses: LearningResponse[] = [
  {
    stepId: "recall:current",
    answer: "Yardımsız yazılmış yeterince uzun bir geri çağırma.",
    selfRating: 2,
    updatedAt: now,
  },
  {
    stepId: "prediction",
    answer: "Failure mode ve kırılan varsayım hakkında yeterince uzun tahmin.",
    confidence: 2,
    updatedAt: now,
  },
  { stepId: "lab", checkedItems: ["bir", "iki", "üç"], updatedAt: now },
  {
    stepId: "transfer",
    answer: "Yeni bağlamdaki değişen varsayımı açıklayan yeterince uzun karar.",
    confidence: 2,
    updatedAt: now,
  },
  {
    stepId: "reflection",
    answer: "Modelde değişen noktayı ve kalan belirsizliği anlatan açıklama.",
    updatedAt: now,
  },
  { stepId: "receipt", selfRating: 2, updatedAt: now },
];

describe("learning workflow evidence validation", () => {
  it("requires every pinned recall instead of any recall response", () => {
    const result = validateLearningCompletion({
      responses: responses.map((response) =>
        response.stepId === "recall:current"
          ? { ...response, stepId: "recall:first" }
          : response,
      ),
      mode: "standard",
      recallStepIds: ["recall:first", "recall:second"],
      labSteps: ["bir", "iki", "üç", "dört"],
    });

    expect(result.valid).toBe(false);
    expect(result.invalidStepIds).toEqual(["recall:second"]);
  });

  it("rejects arbitrary response IDs", () => {
    const result = validateLearningCompletion({
      responses: [...responses, { stepId: "arbitrary:payload", answer: "x", updatedAt: now }],
      mode: "standard",
      recallStepIds: ["recall:current"],
      labSteps: ["bir", "iki", "üç", "dört"],
    });

    expect(result.valid).toBe(false);
    expect(result.invalidStepIds).toContain("arbitrary:payload");
  });

  it("keeps deep mode completable for an older three-step article", () => {
    expect(getRequiredLabItems("deep", 3)).toBe(3);
  });

  it("recognizes only a semantically identical completion retry", () => {
    const reordered = [...responses]
      .reverse()
      .map((response) => ({ ...response, updatedAt: "2026-08-11T08:00:00.000Z" }));
    const changed = reordered.map((response) =>
      response.stepId === "prediction"
        ? { ...response, answer: `${response.answer} Değişti.` }
        : response,
    );

    expect(canonicalizeCompletionPayload("standard", reordered)).toEqual(
      canonicalizeCompletionPayload("standard", responses),
    );
    expect(canonicalizeCompletionPayload("standard", changed)).not.toEqual(
      canonicalizeCompletionPayload("standard", responses),
    );
  });

  it("makes submitted fieldwork immutable while preserving exact retries", () => {
    expect(
      getFieldworkMutationDecision({
        currentStatus: "applied",
        currentRevision: 2,
        currentEvidenceHash: "same",
        expectedRevision: 1,
        nextStatus: "applied",
        nextEvidenceHash: "same",
      }),
    ).toBe("exact_retry");
    expect(
      getFieldworkMutationDecision({
        currentStatus: "applied",
        currentRevision: 2,
        currentEvidenceHash: "same",
        expectedRevision: 2,
        nextStatus: "in_progress",
        nextEvidenceHash: "different",
      }),
    ).toBe("immutable_conflict");
    expect(
      getFieldworkMutationDecision({
        currentStatus: "in_progress",
        currentRevision: 2,
        expectedRevision: 1,
        nextStatus: "in_progress",
        nextEvidenceHash: "new",
      }),
    ).toBe("stale_conflict");
  });
});
