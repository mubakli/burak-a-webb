"use client";

import React, { useRef, useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import ProjectCardMini from "@/components/home/ProjectCardMini";
import { projectsData } from "@/data/projectsData";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5; // px per frame — slow and smooth

    const animate = () => {
      if (!isPaused && container) {
        scrollPos += speed;
        // When we've scrolled past the first set of cards, reset seamlessly
        const halfWidth = container.scrollWidth / 2;
        if (scrollPos >= halfWidth) {
          scrollPos = 0;
        }
        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const renderCards = () =>
    projectsData.map((project, index) => {
      const firstMedia = project.media[0];
      const isVideo = firstMedia?.type === "video";
      const thumbnail = firstMedia
        ? firstMedia.src
        : "/email-client-mockup.png";
      const thumbnailAlt = firstMedia?.alt ?? project.title;

      return (
        <ProjectCardMini
          key={`${project.id}-${index}`}
          id={project.id}
          title={project.title}
          shortDescription={project.shortDescription}
          thumbnail={thumbnail}
          thumbnailAlt={thumbnailAlt}
          thumbnailType={isVideo ? "video" : "image"}
          status={project.status}
          techStack={project.techStack}
          isPortrait={project.aspectRatio === "portrait"}
        />
      );
    });

  return (
    <div>
      <HeroSection />

      {/* Projects Section - Auto-Scrolling Showcase */}
      <div className="pb-32 mt-24" id="scrollTo">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Selected Work
            </h2>
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-[var(--primary)] transition-colors"
            >
              View All
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--background-start)] to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--background-start)] to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-5 overflow-x-hidden px-6 md:px-8 pb-4"
          >
            {/* Render cards twice for seamless infinite loop */}
            {renderCards()}
            {renderCards()}
          </div>
        </div>
      </div>
    </div>
  );
}
