"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b ${
        scrolled || isOpen
          ? "bg-[var(--background-start)]/95 backdrop-blur-md border-[#333]" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Copper Accent */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold text-[var(--foreground)] tracking-tight hover:text-[var(--primary)] transition-colors"
            >
              BuW<span className="text-[var(--primary)]">.</span>
            </Link>
          </div>

          {/* Desktop Navigation - Architectural Typography */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
                  pathname === link.href 
                    ? "text-[var(--primary)]" 
                    : "text-neutral-400 hover:text-[var(--foreground)]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Virtual Trade Link (Featured - Architectural Button) */}
             <Link
              href="https://vtrade.bupropious.xyz/"
              className="ml-4 px-5 py-2 bg-[var(--foreground)] text-[var(--background-start)] text-xs font-bold uppercase tracking-wider rounded-none hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              Virtual Trade
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute w-full bg-black border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-gray-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
           <Link
            href="https://vtrade.bupropious.xyz/"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            <span className="font-medium">Virtual Trade</span>
            <ArrowRight size={16} className="text-gray-400" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
