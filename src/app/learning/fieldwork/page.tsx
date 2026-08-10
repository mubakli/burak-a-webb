import type { Metadata } from "next";
import FieldworkBoard from "@/components/learning/FieldworkBoard";
import LearningHeader from "@/components/learning/LearningHeader";
import { requireLearningIdentity } from "@/modules/learning/auth";
import { getFieldworkEntries } from "@/modules/learning/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = { title: "Saha Görevleri", robots: { index: false } };

export default async function LearningFieldworkPage() {
  const learnerId = await requireLearningIdentity();
  const entries = await getFieldworkEntries(learnerId);

  return (
    <div className="academy-app" lang="tr">
      <LearningHeader />
      <main id="academy-primary-content" tabIndex={-1}>
        <header className="academy-page-header">
          <p>Kanıt, tamamlandı işaretinden önce gelir</p>
          <h1>Saha Görevleri</h1>
          <p>
            Günlük kısa oturumdan ayrılan, gerçek repo üzerinde test, diagram, ADR,
            commit veya ölçüm üretmeni isteyen uzun biçimli görevler.
          </p>
        </header>
        <div className="academy-fieldwork">
          <FieldworkBoard
            key={entries.map((entry) => `${entry.sessionId}:${entry.revision}`).join("|")}
            initialEntries={entries}
          />
        </div>
      </main>
    </div>
  );
}
