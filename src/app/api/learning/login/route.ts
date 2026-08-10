import { z } from "zod";
import {
  createLearningLogin,
  consumeLearningLoginAttempt,
  isLearningAuthConfigured,
  verifyLearningAccessKey,
} from "@/modules/learning/auth";

export const runtime = "nodejs";

const loginSchema = z.object({
  accessKey: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  if (!isLearningAuthConfigured()) {
    return Response.json(
      { error: "Learning access is not configured." },
      { status: 503 },
    );
  }

  const rateLimit = await consumeLearningLoginAttempt(request);
  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: rateLimit.unavailable
          ? "Learning login is temporarily unavailable."
          : "Too many login attempts.",
      },
      {
        status: rateLimit.unavailable ? 503 : 429,
        headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfter)) },
      },
    );
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !verifyLearningAccessKey(parsed.data.accessKey)) {
    return Response.json({ error: "Access key is invalid." }, { status: 401 });
  }

  await createLearningLogin();
  return Response.json({ authenticated: true });
}
