"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Download, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/portfolio";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Work", href: "/#selected-work" },
    { name: "Learning", href: "/learning" },
    { name: "Beyond", href: "/#off-screen" },
    { name: "Experience", href: "/experience" },
    { name: "Archive", href: "/projects" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href.startsWith("/#selected-work") && pathname.startsWith("/work/"));

  return (
    <header className="site-header">
      <nav className="shell nav-shell" aria-label="Primary navigation">
          <Link href="/" className="brand" aria-label="Burak Asarcikli, home">
            <span>B/A</span>
            <span className="brand-copy">Burak Asarcikli <small>Developer / Curious mind</small></span>
          </Link>

          <div className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={isActive(link.href) ? "active" : undefined}
              >
                {link.name}
              </Link>
            ))}
            <Link className="nav-contact" href="/contact">
              Let&apos;s talk <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </div>

          <button
            type="button"
            className="menu-button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
      </nav>

      <div id="mobile-navigation" className="mobile-nav" data-open={isOpen}>
        <div className="shell mobile-nav-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            Let&apos;s talk <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          <a href={siteConfig.cv.english} download>
            Download CV <Download aria-hidden="true" size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}
