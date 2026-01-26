// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white mb-2">BuW<span className="text-gray-600">.</span></h2>
            <p className="text-gray-500 text-sm font-medium">Building digital experiences that matter.</p>
          </div>

          {/* Social Links - Clean & Minimal */}
          <div className="flex items-center gap-8">
            <a href="https://github.com/mubakli" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/burak-asarcikli" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://x.com/BurakAsarcikli" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="mailto:brkasarcikli@outlook.com" className="text-gray-500 hover:text-white transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-mono uppercase tracking-wide">
          <p>© {currentYear} Burak Asarcıklı. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
