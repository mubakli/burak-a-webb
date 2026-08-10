import type { Metadata } from "next";
import LearningHeader from "@/components/learning/LearningHeader";
import { requireLearningIdentity } from "@/modules/learning/auth";
import { getLearningNotebook } from "@/modules/learning/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = { title: "Kanıt Defteri", robots: { index: false } };

const modeLabels = { quick: "Kısa", standard: "Standart", deep: "Derin" } as const;
const statusLabels = {
  assigned: "Atandı",
  in_progress: "Devam ediyor",
  completed: "Tamamlandı",
} as const;

export default async function LearningNotebookPage() {
  const learnerId = await requireLearningIdentity();
  const entries = await getLearningNotebook(learnerId);

  return (
    <div className="academy-app" lang="tr">
      <LearningHeader />
      <main id="academy-primary-content" tabIndex={-1}>
        <header className="academy-page-header">
          <p>Değiştirilmeyen öğrenme kanıtları</p>
          <h1>Kanıt Defteri</h1>
          <p>
            Okunan yayınların arşivi değil; ilk tahminlerinin, transfer cevaplarının,
            bu yanıtlara verdiğin güvenin ve mental model revizyonlarının zaman çizgisi.
          </p>
        </header>
        <div className="academy-notebook">
          {entries.length === 0 ? (
            <div className="academy-empty-state">
              <p>İlk oturum henüz kaydedilmedi.</p>
              <span>Tamamlanan öğrenme döngüsü burada kanıt zinciri olarak görünecek.</span>
            </div>
          ) : (
            entries.map((entry, index) => {
              const prediction = entry.responses.find((response) => response.stepId === "prediction");
              const transfer = entry.responses.find((response) => response.stepId === "transfer");
              const reflection = entry.responses.find((response) => response.stepId === "reflection");
              const rating = entry.responses.find((response) => response.stepId === "receipt");
              return (
                <article key={entry.id}>
                  <div className="academy-notebook-date">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <time dateTime={entry.localDate}>{entry.localDate}</time>
                  </div>
                  <div className="academy-notebook-entry">
                    <header>
                      <p>{modeLabels[entry.mode]} / {statusLabels[entry.status]}</p>
                      <h2>{entry.topicTitle}</h2>
                      <span>Bağımsızlık {rating?.selfRating ?? "-"} / 4</span>
                    </header>
                    <div>
                      <section>
                        <h3>İlk hipotez · güven {prediction?.confidence ?? "-"} / 3</h3>
                        <p>{prediction?.answer || "Kayıt yok"}</p>
                      </section>
                      <section>
                        <h3>Transfer · güven {transfer?.confidence ?? "-"} / 3</h3>
                        <p>{transfer?.answer || "Kayıt yok"}</p>
                      </section>
                      <section><h3>Revize mental model</h3><p>{reflection?.answer || "Kayıt yok"}</p></section>
                    </div>
                    <footer>{entry.selectionReasons.join(" ")}</footer>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
