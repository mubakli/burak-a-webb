import React from "react";
import Link from "next/link";
import { ArrowRight, MousePointer2 } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-20 w-full animate-slideUp">
        {/* Intro Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Available for new projects
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
          FULL-STACK
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient">
            DEVELOPER
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          I build accessible, pixel-perfect, and performant web experiences.
          Passionate about blending design with robust engineering to create 
          standout digital products.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/#scrollTo"
            className="group px-8 py-4 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-300"
          >
            View Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/contact"
            className="group px-8 py-4 bg-white/5 text-white font-medium rounded-full border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            Contact Me
            <MousePointer2 className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
