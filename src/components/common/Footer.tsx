// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--background-start)] border-t border-[#333] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-2 tracking-tight">BuW<span className="text-[var(--primary)]">.</span></h2>
            <p className="text-neutral-500 text-sm font-medium tracking-wide">Building digital experiences that matter.</p>
          </div>

          {/* Social Links - Clean & Minimal */}
          <div className="flex items-center gap-8">
            <a href="https://github.com/mubakli" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-[var(--primary)] transition-colors transform hover:-translate-y-1 duration-300">
              <Github size={20} strokeWidth={1.5} />
            </a>
            <a href="https://www.linkedin.com/in/burak-asarcikli" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-[var(--primary)] transition-colors transform hover:-translate-y-1 duration-300">
              <Linkedin size={20} strokeWidth={1.5} />
            </a>
            <a href="https://x.com/BurakAsarcikli" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-[var(--primary)] transition-colors transform hover:-translate-y-1 duration-300">
              <Twitter size={20} strokeWidth={1.5} />
            </a>
            <a href="mailto:brkasarcikli@outlook.com" className="text-neutral-500 hover:text-[var(--primary)] transition-colors transform hover:-translate-y-1 duration-300">
              <Mail size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-600 font-mono uppercase tracking-widest">
          <p>© {currentYear} Burak Asarcıklı. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
