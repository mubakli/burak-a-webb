import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  OWNER_LEARNER_ID,
  connectLearningDatabase,
} from "@/modules/learning/catalog";
import { LearningLoginAttemptModel } from "@/modules/learning/models";

const COOKIE_NAME = "burak_learning_session";
const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;

type LearningAuthPayload = {
  sub: string;
  exp: number;
  version: 1;
};

function sessionSecret() {
  return process.env.LEARNING_SESSION_SECRET;
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function createToken() {
  const secret = sessionSecret();
  if (!secret) throw new Error("LEARNING_SESSION_SECRET is not configured.");

  const payload: LearningAuthPayload = {
    sub: OWNER_LEARNER_ID,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    version: 1,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

function verifyToken(token: string) {
  const secret = sessionSecret();
  if (!secret) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const expected = sign(encoded, secret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as Partial<LearningAuthPayload>;
    return (
      payload.sub === OWNER_LEARNER_ID &&
      payload.version === 1 &&
      typeof payload.exp === "number" &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

function authBypassed() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.LEARNING_AUTH_DISABLED === "true"
  ) {
    throw new Error("LEARNING_AUTH_DISABLED cannot be enabled in production.");
  }

  return (
    process.env.NODE_ENV === "development" &&
    (process.env.LEARNING_AUTH_DISABLED === "true" ||
      !process.env.LEARNING_ACCESS_KEY ||
      !process.env.LEARNING_SESSION_SECRET)
  );
}

export function isLearningAuthConfigured() {
  return Boolean(process.env.LEARNING_ACCESS_KEY && process.env.LEARNING_SESSION_SECRET);
}

export async function getLearningIdentity() {
  if (authBypassed()) return OWNER_LEARNER_ID;

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token && verifyToken(token) ? OWNER_LEARNER_ID : null;
}

export async function requireLearningIdentity() {
  const identity = await getLearningIdentity();
  if (!identity) redirect("/learning/login");
  return identity;
}

export function verifyLearningAccessKey(candidate: string) {
  const configured = process.env.LEARNING_ACCESS_KEY;
  if (!configured) return false;

  const left = createHash("sha256").update(candidate).digest();
  const right = createHash("sha256").update(configured).digest();
  return timingSafeEqual(left, right);
}

export async function consumeLearningLoginAttempt(request: Request) {
  if (authBypassed()) return { allowed: true, retryAfter: 0 };
  const secret = sessionSecret();
  if (!secret || !(await connectLearningDatabase())) {
    return { allowed: false, retryAfter: 60, unavailable: true };
  }

  const windowSeconds = 15 * 60;
  const nowSeconds = Math.floor(Date.now() / 1000);
  const windowNumber = Math.floor(nowSeconds / windowSeconds);
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress =
    request.headers.get("x-real-ip") ?? forwardedFor ?? "unknown-client";
  const bucketKey = createHmac("sha256", secret)
    .update(`${clientAddress}:${windowNumber}`)
    .digest("hex");
  const expiresAt = new Date((windowNumber + 1) * windowSeconds * 1000);
  let attempt;
  try {
    await LearningLoginAttemptModel.init();
    attempt = await LearningLoginAttemptModel.findOneAndUpdate(
      { bucketKey },
      {
        $inc: { attempts: 1 },
        $setOnInsert: { bucketKey, expiresAt },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
  } catch {
    return { allowed: false, retryAfter: 60, unavailable: true };
  }

  return {
    allowed: attempt.attempts <= 8,
    retryAfter: Math.max(1, expiresAt.valueOf() / 1000 - nowSeconds),
  };
}

export async function createLearningLogin() {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearLearningLogin() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
