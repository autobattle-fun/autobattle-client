"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function EasterEgg() {
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/ee/music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn(
          "Audio blocked! You must click anywhere on the page before hovering.",
          error,
        );
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className="fixed bottom-18 md:bottom-0 right-0 z-50">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Secret Cat"
        // Removed all backgrounds, borders, shadow, and clipping masks
        className={`relative w-24 h-24 bg-transparent border-none outline-none transition-all duration-300 ease-in-out flex items-center justify-center ${
          isHovered ? "scale-100 rotate-12 animate-bounce" : "scale-80 rotate-0"
        }`}
      >
        <Image
          // Swaps from a static frame to the animated GIF on hover
          src={isHovered ? "/ee/cat.gif" : "/ee/cat1frame.gif"}
          alt="Bouncing Cat"
          fill
          style={{ objectFit: "contain" }} // 'contain' prevents cropping now that the circle is gone
          unoptimized
          priority
        />
      </button>
    </div>
  );
}
