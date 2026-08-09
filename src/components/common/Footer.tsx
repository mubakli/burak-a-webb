import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/portfolio";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <div>
            <p className="footer-name">Burak Asarcikli</p>
            <p className="footer-description">
              Developer by trade. Curious by nature.
            </p>
          </div>
          <div className="footer-links">
            <a href={siteConfig.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            <a href={`mailto:${siteConfig.email}`}>Email</a>
            <a href={siteConfig.cv.english} download>CV</a>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-meta">
          <p>© {currentYear} Burak Asarcikli</p>
          <p>Built with care in Istanbul, Türkiye</p>
        </div>
      </div>
    </footer>
  );
}
