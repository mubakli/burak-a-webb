import type { Metadata } from "next";
import LearningAtlasView from "@/components/learning/LearningAtlasView";
import LearningHeader from "@/components/learning/LearningHeader";
import { requireLearningIdentity } from "@/modules/learning/auth";
import { getLearningAtlas } from "@/modules/learning/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = { title: "Yetkinlik Atlası", robots: { index: false } };

export default async function LearningAtlasPage() {
  const learnerId = await requireLearningIdentity();
  const topics = await getLearningAtlas(learnerId);

  return (
    <div className="academy-app" lang="tr">
      <LearningHeader />
      <main id="academy-primary-content" tabIndex={-1}>
        <header className="academy-page-header">
          <p>58 kavram / sekiz alan / tek sıra yok</p>
          <h1>Yetkinlik Atlası</h1>
          <p>
            Takvim ilerlemesini değil; oturum, öz değerlendirme ve ayrıca doğrulanmış
            kanıt bulunduğunda açıklama, teşhis, uygulama ve transfer sinyallerini gösterir.
          </p>
        </header>
        <LearningAtlasView topics={topics} />
      </main>
    </div>
  );
}
