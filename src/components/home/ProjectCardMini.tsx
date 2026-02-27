"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardMiniProps {
  id: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  thumbnailAlt: string;
  thumbnailType?: "image" | "video";
  status?: string;
  techStack: string[];
  isPortrait?: boolean;
}

const ProjectCardMini: React.FC<ProjectCardMiniProps> = ({
  id,
  title,
  shortDescription,
  thumbnail,
  thumbnailAlt,
  thumbnailType = "image",
  status,
  techStack,
  isPortrait = false,
}) => {
  return (
    <Link
      href={`/projects#${id}`}
      className="group flex-shrink-0 w-[320px] sm:w-[360px] bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden hover:border-[var(--primary)]/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(194,65,12,0.08)]"
    >
      {/* Thumbnail */}
      <div
        className={`relative w-full overflow-hidden bg-neutral-900 ${
          isPortrait ? "h-[220px]" : "h-[180px]"
        }`}
      >
        {thumbnailType === "video" ? (
          <video
            src={thumbnail}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <Image
            src={thumbnail}
            alt={thumbnailAlt}
            fill
            className={`${
              isPortrait ? "object-contain p-4" : "object-cover"
            } group-hover:scale-105 transition-transform duration-700`}
          />
        )}

        {/* Status Badge */}
        {status && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] bg-[var(--primary)]/90 text-white rounded-full backdrop-blur-sm">
              {status}
            </span>
          </div>
        )}

        {/* Arrow icon on hover */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-sm font-bold text-[var(--foreground)] tracking-wide uppercase mb-2 group-hover:text-[var(--primary)] transition-colors duration-300">
          {title}
        </h3>

        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-4">
          {shortDescription}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-[10px] uppercase tracking-wider border border-white/15 text-neutral-300 rounded-full bg-white/[0.03]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCardMini;
