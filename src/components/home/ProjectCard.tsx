import React from "react";
import MediaGallery, { MediaItem } from "./MediaGallery";

interface ProjectCardProps {
  title: string;
  description: string | React.ReactNode;
  videoSrc?: string;
  status?: string;
  media?: MediaItem[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  videoSrc,
  status,
  media,
}) => {
  // Convert legacy videoSrc to media format if provided
  const mediaItems: MediaItem[] = media || (videoSrc ? [{ type: "video", src: videoSrc }] : []);

  return (
    <div className="project-section flex flex-col md:flex-row items-center md:items-start mb-16 gap-8 px-4 md:px-10">
      {/* Content Section */}
      <div
        className={`content w-full ${
          mediaItems.length > 0 ? "md:w-1/2 lg:w-2/3" : ""
        } space-y-6`}
      >
        <div className="relative inline-block">
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-wide drop-shadow-sm group-hover:text-purple-200 transition-colors duration-300">
            {title}
          </h3>
          {status && (
            <span className="ml-3 text-sm md:text-base text-yellow-400 font-semibold animate-pulse">
              ({status})
            </span>
          )}
        </div>
        
        <p className="text-sm md:text-lg leading-relaxed text-gray-300 backdrop-blur-sm">
          {description}
        </p>
      </div>

      {/* Media Gallery Section */}
      {mediaItems.length > 0 && (
        <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center md:justify-end">
          <MediaGallery items={mediaItems} autoPlay={false} />
        </div>
      )}
    </div>
  );
};

export default ProjectCard;

