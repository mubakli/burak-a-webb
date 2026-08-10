import { z } from "zod";
import { getLearningIdentity } from "@/modules/learning/auth";
import {
  LearningConflictError,
  LearningValidationError,
  saveFieldwork,
} from "@/modules/learning/session";

export const runtime = "nodejs";

const fieldworkSchema = z.object({
  sessionId: z.string().min(1).max(100),
  expectedRevision: z.number().int().min(0),
  status: z.enum(["not_started", "in_progress", "applied"]),
  evidence: z.string().max(4_000).optional(),
}).superRefine((value, context) => {
  if (value.status === "applied" && (value.evidence?.trim().length ?? 0) < 40) {
    context.addIssue({
      code: "custom",
      path: ["evidence"],
      message: "Applied fieldwork requires evidence.",
    });
  }
});

export async function POST(request: Request) {
  const learnerId = await getLearningIdentity();
  if (!learnerId) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const parsed = fieldworkSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid fieldwork evidence." }, { status: 400 });
  }

  try {
    const result = await saveFieldwork({ learnerId, ...parsed.data });
    if (!result.saved) {
      return Response.json({ error: "Completed session was not found." }, { status: 409 });
    }
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof LearningConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof LearningValidationError) {
      return Response.json({ error: error.message }, { status: 422 });
    }
    console.error("Fieldwork evidence could not be saved.", error);
    return Response.json({ error: "Fieldwork could not be saved." }, { status: 500 });
  }
}
