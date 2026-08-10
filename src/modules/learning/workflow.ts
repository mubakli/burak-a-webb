import type {
  LearningResponse,
  LearningSessionMode,
} from "@/modules/learning/types";

export const MIN_EVIDENCE_CHARACTERS = 20;
export const MIN_DEEP_LAB_CHARACTERS = 40;

export const fixedEvidenceStepIds = [
  "prediction",
  "lab",
  "transfer",
  "reflection",
  "receipt",
] as const;

export function getRequiredLabItems(
  mode: LearningSessionMode,
  availableItems: number,
) {
  const requested = mode === "quick" ? 1 : mode === "standard" ? 3 : 4;
  return Math.min(requested, availableItems);
}

function hasMeaningfulAnswer(response: LearningResponse | undefined) {
  return (response?.answer?.trim().length ?? 0) >= MIN_EVIDENCE_CHARACTERS;
}

export function validateLearningCompletion(input: {
  responses: readonly LearningResponse[];
  mode: LearningSessionMode;
  recallStepIds: readonly string[];
  labSteps: readonly string[];
}) {
  const allowedStepIds = new Set([
    ...fixedEvidenceStepIds,
    ...input.recallStepIds,
  ]);
  const unexpectedStepIds = input.responses
    .map((response) => response.stepId)
    .filter((stepId) => !allowedStepIds.has(stepId));
  if (unexpectedStepIds.length > 0) {
    return {
      valid: false,
      invalidStepIds: unexpectedStepIds,
      message: "Oturuma atanmamış bir yanıt gönderildi.",
    };
  }

  const byStep = new Map(
    input.responses.map((response) => [response.stepId, response]),
  );
  const invalidStepIds: string[] = [];

  for (const recallStepId of input.recallStepIds) {
    const recall = byStep.get(recallStepId);
    if (!hasMeaningfulAnswer(recall) || typeof recall?.selfRating !== "number") {
      invalidStepIds.push(recallStepId);
    }
  }

  const prediction = byStep.get("prediction");
  if (!hasMeaningfulAnswer(prediction) || !prediction?.confidence) {
    invalidStepIds.push("prediction");
  }

  const lab = byStep.get("lab");
  const allowedLabSteps = new Set(input.labSteps);
  const selectedLabSteps = [...new Set(lab?.checkedItems ?? [])];
  const requiredLabItems = getRequiredLabItems(
    input.mode,
    input.labSteps.length,
  );
  const validLab =
    requiredLabItems > 0 &&
    selectedLabSteps.length >= requiredLabItems &&
    selectedLabSteps.every((item) => allowedLabSteps.has(item)) &&
    (input.mode !== "deep" ||
      (lab?.answer?.trim().length ?? 0) >= MIN_DEEP_LAB_CHARACTERS);
  if (!validLab) invalidStepIds.push("lab");

  const transfer = byStep.get("transfer");
  if (!hasMeaningfulAnswer(transfer) || !transfer?.confidence) {
    invalidStepIds.push("transfer");
  }
  if (!hasMeaningfulAnswer(byStep.get("reflection"))) {
    invalidStepIds.push("reflection");
  }
  if (typeof byStep.get("receipt")?.selfRating !== "number") {
    invalidStepIds.push("receipt");
  }

  return invalidStepIds.length === 0
    ? { valid: true, invalidStepIds: [], message: "" }
    : {
        valid: false,
        invalidStepIds: [...new Set(invalidStepIds)],
        message:
          "Geri çağırma, tahmin, lab, transfer, yansıtma ve öz değerlendirme kanıtlarını tamamla.",
      };
}

export function canonicalizeCompletionPayload(
  mode: LearningSessionMode,
  responses: readonly LearningResponse[],
) {
  return {
    mode,
    responses: [...responses]
      .sort((left, right) => left.stepId.localeCompare(right.stepId))
      .map((response) => ({
        stepId: response.stepId,
        answer: response.answer,
        confidence: response.confidence,
        checkedItems: response.checkedItems,
        selfRating: response.selfRating,
      })),
  };
}

export function getFieldworkMutationDecision(input: {
  currentStatus: "not_started" | "in_progress" | "applied";
  currentRevision: number;
  currentEvidenceHash?: string;
  expectedRevision: number;
  nextStatus: "not_started" | "in_progress" | "applied";
  nextEvidenceHash: string;
}) {
  if (input.currentStatus === "applied") {
    return input.nextStatus === "applied" &&
      input.currentEvidenceHash === input.nextEvidenceHash
      ? "exact_retry"
      : "immutable_conflict";
  }
  return input.currentRevision === input.expectedRevision
    ? "update"
    : "stale_conflict";
}
