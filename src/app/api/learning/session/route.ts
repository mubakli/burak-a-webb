import { z } from "zod";
import { getLearningIdentity } from "@/modules/learning/auth";
import {
  LearningConflictError,
  LearningPersistenceError,
  LearningValidationError,
  saveLearningSessionProgress,
} from "@/modules/learning/session";

export const runtime = "nodejs";

const responseSchema = z.object({
  stepId: z.string().min(1).max(100),
  answer: z.string().max(8_000).optional(),
  confidence: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  checkedItems: z.array(z.string().max(500)).max(20).optional(),
  selfRating: z
    .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
    .optional(),
  updatedAt: z.string().datetime(),
});

const progressSchema = z
  .object({
    sessionId: z.string().min(1).max(100),
    expectedRevision: z.number().int().min(0),
    mode: z.enum(["quick", "standard", "deep"]).optional(),
    currentStep: z.number().int().min(0).max(8),
    response: responseSchema.optional(),
    responses: z.array(responseSchema).max(8).optional(),
    complete: z.boolean().optional(),
  })
  .superRefine((value, context) => {
    const stepIds = [
      ...(value.responses ?? []).map((response) => response.stepId),
      ...(value.response ? [value.response.stepId] : []),
    ];
    if (new Set(stepIds).size !== stepIds.length) {
      context.addIssue({
        code: "custom",
        path: ["responses"],
        message: "Response step IDs must be unique.",
      });
    }
  });

export async function POST(request: Request) {
  const learnerId = await getLearningIdentity();
  if (!learnerId) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const parsed = progressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid learning progress." }, { status: 400 });
  }

  try {
    const result = await saveLearningSessionProgress({
      learnerId,
      ...parsed.data,
    });
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof LearningConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof LearningValidationError) {
      return Response.json({ error: error.message }, { status: 422 });
    }
    if (error instanceof LearningPersistenceError) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    console.error("Learning progress could not be saved.", error);
    return Response.json({ error: "Progress could not be saved." }, { status: 500 });
  }
}
