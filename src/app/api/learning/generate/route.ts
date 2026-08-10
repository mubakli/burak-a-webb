import { timingSafeEqual } from "node:crypto";
import { upgradeSharedArticleWithDeepSeek } from "@/modules/learning/content";
import { sendLearningReadyNotification } from "@/modules/learning/notification";
import {
  claimDailyLearningOrchestration,
  finishDailyLearningOrchestration,
  researchTopic,
} from "@/modules/learning/research";
import {
  getTodayLearningSession,
  promoteAssignedSessionArticle,
} from "@/modules/learning/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return Response.json(
      { error: "Daily learning pipeline is not configured." },
      { status: 503 },
    );
  }
  const authorization = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${cronSecret}`;
  const authBuffer = Buffer.from(authorization);
  const expectedBuffer = Buffer.from(expected);
  if (
    authBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(authBuffer, expectedBuffer)
  ) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let orchestration: { runKey: string; claimId: string } | null = null;
  try {
    const bundle = await getTodayLearningSession();
    if (bundle.persistence !== "database") {
      return Response.json(
        { error: "Daily learning pipeline requires database persistence." },
        { status: 503 },
      );
    }
    const claim = await claimDailyLearningOrchestration(bundle.session.localDate);
    if (claim.state === "running") {
      return Response.json(
        { status: "in_progress", topic: bundle.topic.slug },
        { status: 202, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (claim.state === "succeeded") {
      return Response.json(
        { status: "already_completed", topic: bundle.topic.slug },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    orchestration = { runKey: claim.runKey, claimId: claim.claimId };
    const snapshotKeys = await researchTopic(bundle.topic);
    if (snapshotKeys === null) {
      await finishDailyLearningOrchestration({
        ...orchestration,
        succeeded: false,
        safeError: "Authoritative source refresh is still in progress.",
      });
      orchestration = null;
      return Response.json(
        { status: "in_progress", topic: bundle.topic.slug },
        { status: 202, headers: { "Cache-Control": "no-store" } },
      );
    }
    const article = await upgradeSharedArticleWithDeepSeek(
      bundle.topic,
      bundle.article.level,
    );
    const promotedSession = await promoteAssignedSessionArticle(bundle.session, article);
    let notification = "not_configured";
    try {
      notification = promotedSession
        ? (
            await sendLearningReadyNotification({ session: promotedSession, article })
          ).reason
        : "session_changed";
    } catch (error) {
      console.error("Learning notification could not be sent.", error);
      notification = "failed";
    }
    const finalized = await finishDailyLearningOrchestration({
      ...orchestration,
      succeeded: true,
      sourceSnapshotKeys: snapshotKeys,
    });
    if (!finalized) throw new Error("Daily orchestration claim was superseded.");

    return Response.json(
      {
        date: bundle.session.localDate,
        topic: bundle.topic.slug,
        articleVersion: article.version,
        articleOrigin: article.origin,
        reused: article.version === bundle.article.version,
        evidenceSnapshots: snapshotKeys.length,
        notification,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (orchestration) {
      try {
        await finishDailyLearningOrchestration({
          ...orchestration,
          succeeded: false,
          safeError: error instanceof Error ? error.message : "Unknown pipeline error",
        });
      } catch (claimError) {
        console.error("Daily orchestration failure could not be recorded.", claimError);
      }
    }
    console.error("Daily learning pipeline failed.", error);
    return Response.json(
      { error: "Daily learning pipeline failed safely." },
      { status: 500 },
    );
  }
}
