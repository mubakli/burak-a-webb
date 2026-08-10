import { z } from "zod";
import { getLearningIdentity } from "@/modules/learning/auth";
import { reselectTodayTopic } from "@/modules/learning/session";

export const runtime = "nodejs";

const schema = z.object({
  sessionId: z.string().min(1).max(100),
  expectedRevision: z.number().int().min(0),
});

export async function POST(request: Request) {
  const learnerId = await getLearningIdentity();
  if (!learnerId) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });

  try {
    return Response.json(
      await reselectTodayTopic(
        parsed.data.sessionId,
        parsed.data.expectedRevision,
        learnerId,
      ),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Learning topic could not be reselected.", error);
    return Response.json({ error: "No alternative topic is available." }, { status: 409 });
  }
}
