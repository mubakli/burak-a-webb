// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/80 border-t border-white/10 pt-16 pb-8 backdrop-blur-sm z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">BuW<span className="text-purple-500">.</span></h2>
            <p className="text-gray-400 text-sm">Building digital experiences that matter.</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a href="https://github.com/mubakli" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/burak-asarcikli" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
              <Linkedin size={20} />
            </a>
            <a href="https://x.com/BurakAsarcikli" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
              <Twitter size={20} />
            </a>
            <a href="mailto:brkasarcikli@outlook.com" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} Burak Asarcıklı. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
