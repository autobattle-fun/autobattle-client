"use client";

import { useState, useEffect } from "react";
import { SUIT_SYMBOLS, SUIT_COLORS } from "@/lib/cards";
import { Cpu } from "lucide-react";

export default function PlayingCard({
  card,
  delay = 0,
  align = "right",
  zIndex = 1,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [interactionReady, setInteractionReady] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    const readyTimer = setTimeout(
      () => setInteractionReady(true),
      delay * 1000 + 500,
    );
    return () => {
      clearTimeout(showTimer);
      clearTimeout(readyTimer);
    };
  }, [delay]);

  const isLeft = align === "left";
  const spacingClass = isLeft
    ? "mr-[-1rem] sm:mr-[-1.5rem] md:mr-[-2rem] first:mr-0"
    : "ml-[-1rem] sm:ml-[-1.5rem] md:ml-[-2rem] first:ml-0";

  const textAlignClass = isLeft ? "text-right" : "text-left";

  const transitionEase = interactionReady
    ? "ease-out duration-300"
    : "ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-500";

  if (!card.isFaceUp) {
    return (
      <div
        style={{
          zIndex,
          transitionDelay: interactionReady ? "0s" : `${delay}s`,
        }}
        className={`w-[44px] h-[64px] sm:w-[64px] sm:h-[96px] md:w-[88px] md:h-[128px] dark:bg-[#111] bg-white rounded-lg border dark:border-white/10 border-black/10 shadow-xl flex flex-col items-center justify-center overflow-hidden relative group shrink-0 transition-all ${transitionEase} ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-white from-black to-transparent" />
        <div className="w-4 h-4 md:w-8 md:h-8 rounded-full border dark:border-white/10 border-black/10 flex items-center justify-center dark:bg-zinc-900 bg-gray-50">
          <Cpu className="w-2.5 h-2.5 md:w-4 md:h-4 text-zinc-500" />
        </div>
      </div>
    );
  }

  const initialTransform = isLeft
    ? "translate-y-6 rotate-6 opacity-0"
    : "translate-y-6 -rotate-6 opacity-0";
  const finalTransform = "translate-y-0 rotate-0 opacity-100";

  return (
    <div
      style={{
        zIndex,
        transitionDelay: interactionReady ? "0s" : `${delay}s`,
      }}
      className={`w-[44px] h-[64px] sm:w-[64px] sm:h-[96px] md:w-[88px] md:h-[128px] dark:bg-[#1a1a1a] bg-white rounded-[6px] md:rounded-lg border border-foreground/40 flex flex-col justify-between p-1 md:p-3 ${spacingClass} shrink-0 select-none relative transition-all ${transitionEase} ${isVisible ? finalTransform : initialTransform} hover:-translate-y-1 hover:!z-50 cursor-pointer`}
    >
      <div
        className={`text-[9px] sm:text-xs md:text-base font-bold ${SUIT_COLORS[card.suit]} leading-none w-full ${textAlignClass}`}
      >
        {card.rank}
      </div>
      <div
        className={`text-lg sm:text-2xl md:text-5xl flex justify-center ${SUIT_COLORS[card.suit]}`}
      >
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div
        className={`text-[9px] sm:text-xs md:text-base font-bold ${SUIT_COLORS[card.suit]} leading-none w-full rotate-180 ${textAlignClass}`}
      >
        {card.rank === 1 ? "A" : card.rank}
      </div>
    </div>
  );
}
