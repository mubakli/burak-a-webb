import type { Metadata } from "next";
import LearningExperience from "@/components/learning/LearningExperience";
import LearningHeader from "@/components/learning/LearningHeader";
import { requireLearningIdentity } from "@/modules/learning/auth";
import { getTodayLearningSession } from "@/modules/learning/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Kanıt Defteri",
  description:
    "Full-stack mühendislik, design pattern ve production muhakemesi için adaptif kişisel öğrenme alanı.",
  robots: { index: false, follow: false },
};

export default async function LearningPage() {
  const learnerId = await requireLearningIdentity();
  const bundle = await getTodayLearningSession(learnerId);

  return (
    <div className="academy-app" lang="tr">
      <LearningHeader />
      <main id="academy-primary-content" tabIndex={-1}>
        <LearningExperience
          key={`${bundle.session.id}:${bundle.session.articleVersionId}:${bundle.session.revision}`}
          bundle={bundle}
        />
      </main>
    </div>
  );
}
