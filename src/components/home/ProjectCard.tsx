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

  // Minimalist / Editorial Status
  const getStatusLabel = (status: string) => {
     // Just return the text, we'll style it monochromatically
     return status;
  };

  return (
    <div className="border-t border-[#333] py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-start group">
      {/* Content Section */}
      <div className="space-y-8">
        <div>
           <div className="flex flex-col items-start gap-2 mb-4">
             {status && (
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--primary)] mb-1">
                {getStatusLabel(status)}
              </span>
            )}
            <h3 className="text-3xl font-light text-[var(--foreground)] tracking-tight group-hover:text-[var(--primary-light)] transition-colors duration-500">
              {title}
            </h3>
           </div>
        </div>
        
        <div className="text-neutral-400 leading-relaxed text-base font-light">
          {description}
        </div>
      </div>

      {/* Media Gallery Section - Museum Frame */}
      <div className="w-full">
        {mediaItems.length > 0 ? (
          <div className="bg-[#1a1a1a] p-2 border border-[#333] transition-all duration-700 group-hover:border-[var(--primary)] group-hover:scale-[1.01]">
             {/* Sharp corners, no rounded-lg */}
             <div className="overflow-hidden relative"> 
                <MediaGallery items={mediaItems} autoPlay={false} />
             </div>
          </div>
        ) : (
           <div className="h-64 bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-neutral-600 font-mono text-xs uppercase tracking-widest">
             No Preview
           </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

