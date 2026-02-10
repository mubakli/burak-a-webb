"use client";

import Image from "next/image";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface MediaItem {
  type: "video" | "image";
  src: string;
  alt?: string;
  thumbnail?: string;
}

interface MediaGalleryProps {
  items: MediaItem[];
  autoPlay?: boolean;
  aspectRatio?: "video" | "portrait";
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  items, 
  autoPlay = false,
  aspectRatio = "video"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentItem = items[currentIndex];

  if (items.length === 0) return null;

  const isPortrait = aspectRatio === "portrait";

  return (
    <>
      <div className={`media-gallery-container relative mx-auto group ${
        isPortrait ? "max-w-[280px]" : "w-full max-w-[600px]"
      }`}>
        {/* Main Display */}
        <div 
          className={`relative bg-neutral-900 border overflow-hidden shadow-2xl cursor-pointer transition-transform hover:border-white/20 ${
            isPortrait 
              ? "aspect-[9/18] rounded-xl border-white/10" 
              : "aspect-video border-white/10 rounded-xl"
          }`}
          onClick={() => setIsFullscreen(true)}
        >
          {currentItem.type === "video" ? (
            <video
              src={currentItem.src}
              controls
              loop
              muted
              autoPlay={autoPlay}
              className={`w-full h-full ${isPortrait ? "object-contain" : "object-cover"}`}
            />
          ) : (
            <Image
              src={currentItem.src}
              alt={currentItem.alt || `Media ${currentIndex + 1}`}
              fill
              className={isPortrait ? "object-contain" : "object-cover"}
            />
          )}

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hover:scale-110 z-10 ${
                  isPortrait ? "left-1" : "left-4"
                }`}
                aria-label="Previous"
              >
                <ChevronLeft size={isPortrait ? 20 : 24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hover:scale-110 z-10 ${
                  isPortrait ? "right-1" : "right-4"
                }`}
                aria-label="Next"
              >
                <ChevronRight size={isPortrait ? 20 : 24} />
              </button>
            </>
          )}

          {/* Counter */}
          {items.length > 1 && (
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-[10px] backdrop-blur-sm ${
              isPortrait ? "bottom-6" : "bottom-4 right-4 translate-x-0 left-auto"
            }`}>
              {currentIndex + 1} / {items.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {items.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto p-2 scrollbar-none justify-center">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden border transition-all duration-300 z-10 ${
                  isPortrait ? "w-10 h-16" : "w-16 h-10"
                } ${
                  index === currentIndex
                    ? "border-white scale-105 opacity-100 ring-1 ring-white/20"
                    : "border-transparent hover:border-white/40 opacity-50 hover:opacity-100"
                }`}
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    className="w-full h-full object-cover pointer-events-none"
                    muted
                  />
                ) : (
                  <Image
                    src={item.thumbnail || item.src}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div className={`relative max-w-7xl w-full flex justify-center ${
            isPortrait ? "h-full max-h-[90vh]" : "aspect-video"
          }`} onClick={(e) => e.stopPropagation()}>
            {currentItem.type === "video" ? (
              <video
                src={currentItem.src}
                controls
                autoPlay
                loop
                className={`w-full max-h-[90vh] rounded-lg ${isPortrait ? "object-contain" : "object-contain"}`}
              />
            ) : (
              <div className={`relative w-full h-full max-h-[90vh] ${isPortrait ? "max-w-[400px]" : ""}`}>
                <Image
                  src={currentItem.src}
                  alt={currentItem.alt || `Media ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Fullscreen Navigation */}
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                  aria-label="Previous"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                  aria-label="Next"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;
