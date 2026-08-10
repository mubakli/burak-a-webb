import "server-only";

import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { siteConfig } from "@/data/portfolio";
import { LearningSessionModel } from "@/modules/learning/models";
import type { LearningArticle, LearningSession } from "@/modules/learning/types";

export async function sendLearningReadyNotification(input: {
  session: LearningSession;
  article: LearningArticle;
}) {
  const recipient = process.env.LEARNING_NOTIFICATION_EMAIL;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!recipient || !user || !pass || !mongoose.isValidObjectId(input.session.id)) {
    return { sent: false, reason: "not_configured" as const };
  }

  const notificationSentAt = new Date();
  const claimed = await LearningSessionModel.findOneAndUpdate(
    {
      _id: input.session.id,
      learnerId: input.session.learnerId,
      revision: input.session.revision,
      status: "assigned",
      topicSlug: input.session.topicSlug,
      articleVersionId: new mongoose.Types.ObjectId(input.article.versionId),
      notificationSentAt: { $exists: false },
    },
    { $set: { notificationSentAt } },
    { new: true },
  ).lean();
  if (!claimed) return { sent: false, reason: "already_sent" as const };

  const learningUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url}/learning`;
  const reasons = input.session.selectionReasons.map((reason) => `- ${reason}`).join("\n");

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: user,
      to: recipient,
      subject: `Kanıt Defteri: ${input.article.content.title}`,
      text: [
        "Bugünkü öğrenme oturumu hazır.",
        "",
        input.article.content.title,
        "",
        "Neden bugün?",
        reasons,
        "",
        `Çalışma alanı: ${learningUrl}`,
        "",
        "Önce kendi tahminini yaz; açıklamayı daha sonra aç.",
      ].join("\n"),
    });
    return { sent: true, reason: "sent" as const };
  } catch (error) {
    await LearningSessionModel.updateOne(
      { _id: input.session.id, notificationSentAt },
      { $unset: { notificationSentAt: 1 } },
    );
    throw error;
  }
}
