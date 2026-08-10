import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookOpenText, ShieldCheck } from "lucide-react";
import LearningLoginForm from "@/components/learning/LearningLoginForm";
import {
  getLearningIdentity,
  isLearningAuthConfigured,
} from "@/modules/learning/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Kanıt Defteri Girişi",
  robots: { index: false, follow: false },
};

export default async function LearningLoginPage() {
  if (await getLearningIdentity()) redirect("/learning");

  return (
    <main className="academy-login" id="academy-primary-content" tabIndex={-1} lang="tr">
      <div className="academy-login-copy">
        <div className="academy-login-mark"><BookOpenText aria-hidden="true" /></div>
        <p>Private learning workspace</p>
        <h1>Okuduklarını değil, kanıtlayabildiklerini hatırla.</h1>
        <p>
          Full-stack geliştirme, design pattern’lar ve production muhakemesi için
          geçmişini bilen kişisel teknik saha defteri.
        </p>
        <div>
          <ShieldCheck aria-hidden="true" size={18} />
          Cevapların ve proje kanıtların ortak makale içeriğinden ayrı tutulur.
        </div>
      </div>
      <LearningLoginForm configured={isLearningAuthConfigured()} />
    </main>
  );
}
