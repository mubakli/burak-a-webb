import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center relative bg-black overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 transform scale-[1.5] pointer-events-none">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:40px_40px]"
          style={{ animation: 'grid-move 20s linear infinite' }}
        ></div>
      </div>
      
      {/* Gradient Mask for Fade Out - Softened to reveal more grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent via-60% to-black pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full animate-fadeIn pt-20 relative z-10">
        {/* Intro Tag - Static & Professional */}
        <div className="inline-block mb-8">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-gray-400 uppercase border border-white/10 rounded-md bg-white/5">
            Available for new projects
          </span>
        </div>

        {/* Main Title - Solid Typography with Pulse Effect */}
        <div className="relative mb-8">
           {/* Subtle Pulse Animation Layer */}
           <div className="absolute -left-12 -top-12 w-64 h-64 bg-white/[0.05] rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
           
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.9] relative z-10">
            FULL-STACK
            <br />
            <span className="text-gray-500">DEVELOPER</span>
          </h1>
        </div>

        {/* Description - High Legibility */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12 font-light">
          I build accessible, pixel-perfect, and performant web experiences.
          Passionate about blending design with robust engineering to create 
          standout digital products.
        </p>

        {/* CTA Buttons - Clean & Solid */}
        <div className="flex flex-col sm:flex-row gap-5">
          <Link
            href="/#scrollTo"
            className="group px-8 py-4 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            View Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/contact"
            className="group px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white/20 flex items-center justify-center gap-2 hover:border-white hover:bg-white/5 transition-all"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
