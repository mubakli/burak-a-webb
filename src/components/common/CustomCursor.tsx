"use client";

import React, { useEffect, useState } from "react";

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A"
      );
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    window.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        className={`custom-cursor-dot ${isHidden ? "opacity-0" : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isPointer ? "translate(-50%, -50%) scale(0.5)" : "translate(-50%, -50%)",
        }}
      />
      
      {/* Cursor ring */}
      <div
        className={`custom-cursor-ring ${isHidden ? "opacity-0" : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isPointer ? "translate(-50%, -50%) scale(1.5)" : "translate(-50%, -50%)",
        }}
      />
    </>
  );
};

export default CustomCursor;
