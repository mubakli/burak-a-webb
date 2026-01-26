"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-[85vh] flex flex-col justify-center relative overflow-hidden bg-[var(--background-start)]"
    >
      {/* Background: Base Architectural Dot Pattern (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Spotlight Effect: Brighter dots revealed by mouse mask */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-300"
        style={{ 
          backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', 
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), black, transparent)',
          WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), black, transparent)'
        }}
      >
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full animate-fadeIn pt-20 relative z-10">
        {/* Intro Tag - Minimalist & Editorial */}
        <div className="inline-block mb-10">
          <span className="px-0 py-1 text-xs font-bold tracking-[0.2em] text-[var(--primary)] uppercase border-b-2 border-[var(--primary)] pb-1">
            Available for new projects
          </span>
        </div>

        {/* Main Title - Heavy & Solid Typography */}
        <div className="relative mb-10">
           <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter text-[var(--foreground)] leading-[0.9] relative z-10">
            FULL-STACK
            <br />
            {/* Outline Text Effect for 'DEVELOPER' - Architectural Feel */}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--foreground)] to-[var(--foreground)] opacity-90"
                  style={{ WebkitTextStroke: '1px var(--foreground)', color: 'transparent' }}>
              DEVELOPER
            </span>
          </h1>
        </div>

        {/* Description - Clean Serif or Monospace Mix */}
        <p className="text-neutral-400 text-lg md:text-xl max-w-xl leading-relaxed mb-16 font-light">
          Crafting digital experiences with precision and purpose. 
          Focusing on <span className="text-[var(--foreground)] font-medium">accessibility</span>, <span className="text-[var(--foreground)] font-medium">performance</span>, and <span className="text-[var(--foreground)] font-medium">timeless design</span>.
        </p>

        {/* CTA Buttons - Sharp & Architectural */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Link
            href="/#scrollTo"
            className="group px-8 py-5 bg-[var(--primary)] text-white font-bold rounded-none flex items-center justify-center gap-3 hover:bg-[var(--primary-dark)] transition-colors tracking-wide"
          >
            VIEW PROJECTS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/contact"
            className="group px-8 py-5 bg-transparent text-[var(--foreground)] font-bold rounded-none border-2 border-[#404040] flex items-center justify-center gap-3 hover:border-[var(--foreground)] transition-all tracking-wide"
          >
            CONTACT ME
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
