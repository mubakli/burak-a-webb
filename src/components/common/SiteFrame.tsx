"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLearningWorkspace = pathname.startsWith("/learning");

  if (isLearningWorkspace) {
    return (
      <div className="learning-site-frame" lang="tr">
        <a className="skip-link" href="#academy-primary-content">
          İçeriğe geç
        </a>
        {children}
      </div>
    );
  }

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
