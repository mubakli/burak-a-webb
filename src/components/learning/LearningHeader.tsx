"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  clearLearningDraftStorage,
  hasDirtyLearningDrafts,
} from "@/components/learning/learningDraftStore";
import {
  ArrowLeft,
  BookOpenText,
  LogOut,
  Map,
  NotebookPen,
  Wrench,
} from "lucide-react";

const links = [
  { href: "/learning", label: "Bugün", icon: BookOpenText },
  { href: "/learning/atlas", label: "Atlas", icon: Map },
  { href: "/learning/notebook", label: "Kanıt Defteri", icon: NotebookPen },
  { href: "/learning/fieldwork", label: "Saha", icon: Wrench },
];

export default function LearningHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    if (
      hasDirtyLearningDrafts() &&
      !window.confirm("Kaydedilmemiş öğrenme taslakları silinecek. Çıkış yapılsın mı?")
    ) {
      return;
    }
    setLoggingOut(true);
    setLogoutError("");
    try {
      const response = await fetch("/api/learning/logout", { method: "POST" });
      if (!response.ok) throw new Error("Çıkış tamamlanamadı.");
      clearLearningDraftStorage();
      router.replace("/learning/login");
      router.refresh();
    } catch {
      setLogoutError("Çıkış tamamlanamadı; bağlantıyı kontrol edip yeniden dene.");
      setLoggingOut(false);
    }
  }

  return (
    <header className="academy-header">
      <div className="academy-header-brand">
        <Link href="/" aria-label="Portfolyoya dön">
          <ArrowLeft aria-hidden="true" size={16} />
        </Link>
        <Link href="/learning">
          <span>Kanıt Defteri</span>
          <small>Failure-mode field manual</small>
        </Link>
      </div>

      <nav className="academy-primary-nav" aria-label="Öğrenme alanı">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon aria-hidden="true" size={15} />
            {label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        disabled={loggingOut}
        aria-label="Öğrenme alanından çıkış yap"
      >
        <LogOut aria-hidden="true" size={15} />
        <span>Çıkış</span>
      </button>
      {logoutError && <p className="academy-header-error" role="alert">{logoutError}</p>}
      <nav className="academy-mobile-nav" aria-label="Mobil öğrenme alanı">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon aria-hidden="true" size={15} />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
