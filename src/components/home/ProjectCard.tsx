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
    <div className="border-t border-white/10 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start group">
      {/* Content Section */}
      <div className="space-y-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-semibold text-white tracking-tight">
              {title}
            </h3>
            {status && (
              <span className="px-2 py-0.5 text-xs font-medium text-green-400 bg-green-400/10 rounded border border-green-400/20">
                {status}
              </span>
            )}
           </div>
        </div>
        
        <div className="text-gray-400 leading-relaxed text-base font-light">
          {description}
        </div>
      </div>

      {/* Media Gallery Section */}
      <div className="w-full">
        {mediaItems.length > 0 ? (
          <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5 grayscale group-hover:grayscale-0 transition-all duration-500">
             <MediaGallery items={mediaItems} autoPlay={false} />
          </div>
        ) : (
           <div className="h-64 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-gray-500">
             No Preview Available
           </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

