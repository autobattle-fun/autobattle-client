"use client";

import { CheckCircle, Cpu, ShieldAlert } from "lucide-react";
import PlayingCard from "./PlayingCard";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export default function AgentSide({
  agentName,
  side,
  hp,
  cards,
  status,
  score,
  imageUrl,
  align,
  atRisk = 0,
  showRiverPlaceholder = false,
}) {
  const isRed = side === "red";
  const isLeft = align === "left";
  const accentColor = isRed ? "bg-red-600" : "bg-blue-600";
  const avatarRing = isRed
    ? "border-red-600 bg-red-600/10 text-red-600"
    : "border-blue-600 bg-blue-600/10 text-blue-600";

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [actionPopup, setActionPopup] = useState(null);

  // Track previous states to detect action deltas
  const prevStatus = useRef(status);
  const prevCardsLength = useRef(cards.length);

  // --- Animation Trigger Logic ---
  useEffect(() => {
    let timer;

    const cardAdded = cards.length > prevCardsLength.current;
    const gameIsActive = prevCardsLength.current > 0; // Ignore initial deal
    const wasThinking =
      prevStatus.current === "THINKING" || prevStatus.current === "TXPENDING";
    const stoppedThinking =
      wasThinking && (status === "WAITING" || status === "FINALIZED");

    if (gameIsActive) {
      // 1. Detect HIT: A card was added while the agent was active
      if (cardAdded && wasThinking) {
        setActionPopup("HIT!");
        timer = setTimeout(() => setActionPopup(null), 1200);
      }
      // 2. Detect STAY: The agent's turn ended, but no card was added
      else if (!cardAdded && stoppedThinking) {
        setActionPopup("STAY");
        timer = setTimeout(() => setActionPopup(null), 1200);
      }
    }

    prevStatus.current = status;
    prevCardsLength.current = cards.length;

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, cards.length]);

  // --- Scroll Logic ---
  useEffect(() => {
    if (cards.length <= 1 && scrollRef.current) {
      scrollRef.current.scrollTo({
        left: isLeft ? scrollRef.current.scrollWidth : 0,
        behavior: "smooth",
      });
    }
  }, [cards.length, isLeft]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handlePointerUp = () => setIsDragging(false);

  return (
    <div
      className={`flex flex-col ${isLeft ? "items-end" : "items-start"} flex-1 w-full relative z-0`}
    >
      {/* Header Info */}
      <div
        className={`flex items-center gap-1.5 sm:gap-2 md:gap-4 mb-2 md:mb-4 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
      >
        <div
          className={`flex flex-col ${isLeft ? "items-end" : "items-start"}`}
        >
          <h3 className="font-semibold text-[11px] sm:text-sm md:text-lg tracking-tight whitespace-nowrap">
            {agentName}
          </h3>
          <div className="flex items-center gap-1 opacity-60 dark:text-zinc-400 text-zinc-600">
            {status === "WAITING" && (
              <>
                <ShieldAlert className="w-2.5 h-2.5 md:w-4 md:h-4" />
                <span className="text-[9px] md:text-sm font-bold font-mono tracking-tighter tabular-nums">
                  {Math.max(0, hp)} / 10
                </span>
              </>
            )}

            {status === "THINKING" && (
              <>
                <div className="rounded-full w-2 h-2 bg-amber-500 relative">
                  <div className="rounded-full w-2 h-2 bg-amber-500 animate-ping absolute"></div>
                </div>
                <span className="text-[9px] md:text-sm font-bold font-mono tracking-tighter tabular-nums">
                  THINKING...
                </span>
              </>
            )}

            {status === "TXPENDING" && (
              <>
                <div className="rounded-full w-2 h-2 bg-green-500 relative">
                  <div className="rounded-full w-2 h-2 bg-green-500 animate-ping absolute"></div>
                </div>
                <span className="text-[9px] md:text-sm font-bold font-mono tracking-tighter tabular-nums">
                  EXECUTING...
                </span>
              </>
            )}

            {(status === "FINALIZED" || status === "DONE") && (
              <>
                <CheckCircle className="w-2.5 h-2.5 md:w-4 md:h-4 text-green-700" />
                <span className="text-[9px] md:text-sm font-bold font-mono tracking-tighter tabular-nums">
                  FINALIZED
                </span>
              </>
            )}
          </div>
        </div>

        {/* Avatar */}
        {imageUrl ? (
          <div
            className={`w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full overflow-hidden relative border md:border-2 flex items-center justify-center shadow-sm ${avatarRing} dark:bg-transparent bg-white`}
          >
            <Image src={imageUrl} width={70} height={70} alt="" />
          </div>
        ) : (
          <div
            className={`w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full border md:border-2 flex items-center justify-center shadow-sm ${avatarRing} dark:bg-transparent bg-white`}
          >
            <Cpu className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
          </div>
        )}
      </div>

      {/* HP Bar */}
      <div
        className={`w-full max-w-[240px] mb-3 md:mb-6 flex flex-col ${isLeft ? "items-end" : "items-start"}`}
      >
        <div
          className={`flex gap-[2px] sm:gap-1 ${isLeft ? "flex-row-reverse" : "flex-row"}`}
        >
          {[...Array(10)].map((_, i) => {
            const isActive = i < Math.max(0, hp);
            const isRisk = isActive && i >= hp - atRisk;
            return (
              <div
                key={i}
                className={`w-1.5 h-3 sm:w-2 sm:h-4 md:w-4 rounded-[1px] md:rounded-sm md:h-6 transition-colors duration-300 ${
                  isActive ? accentColor : "dark:bg-zinc-800 bg-zinc-200"
                } ${isRisk ? "animate-pulse opacity-40 brightness-120" : ""}`}
              />
            );
          })}
        </div>
      </div>

      {/* Play Area */}
      <div
        className={`p-2.5 sm:p-5 md:p-6 h-full rounded-[16px] md:rounded-[24px] bg-white dark:bg-zinc-900 border border-foreground/20 w-full md:max-w-[340px] flex flex-col ${isLeft ? "items-end text-right" : "items-start text-left"}`}
      >
        <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-2 sm:mb-6 md:mb-8 tabular-nums flex items-baseline dark:text-white text-zinc-900">
          {score}
          {showRiverPlaceholder && (
            <span
              className={`text-xl sm:text-3xl md:text-4xl ml-1 md:ml-2 animate-pulse ${isRed ? "text-red-500" : "text-blue-500"}`}
            >
              +?
            </span>
          )}
          <span className="text-[10px] sm:text-lg md:text-xl text-zinc-600 ml-1 font-bold tracking-normal opacity-50">
            /21
          </span>
        </div>

        <div className="w-full relative h-[72px] sm:h-[110px] md:h-[140px] mt-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div
            ref={scrollRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className={`flex items-center w-full h-full overflow-x-auto [&::-webkit-scrollbar]:hidden px-1 md:px-4 cursor-grab active:cursor-grabbing ${
              isLeft ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {cards.map((card, i) => (
                <PlayingCard
                  key={card.id + "_" + i}
                  card={card}
                  delay={i * 0.1}
                  align={align}
                  zIndex={i + 1}
                />
              ))}
              {showRiverPlaceholder && (
                <motion.div
                  key="river-placeholder"
                  initial={{ opacity: 0, scale: 0.9, x: isLeft ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: isLeft ? 20 : -20 }}
                  style={{ zIndex: 0 }}
                  className={`w-[44px] h-[64px] sm:w-[64px] sm:h-[96px] md:w-[88px] md:h-[128px] border-[1.5px] md:border-2 border-dashed ${
                    isRed
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-blue-500/50 bg-blue-500/5"
                  } rounded-[6px] md:rounded-lg flex flex-col items-center justify-center ${
                    isLeft
                      ? "mr-[-0.75rem] sm:mr-[-1rem] md:mr-[-2rem]"
                      : "ml-[-0.75rem] sm:ml-[-1rem] md:ml-[-2rem]"
                  } overflow-hidden relative shrink-0`}
                >
                  <div
                    className={`animate-pulse text-[7px] sm:text-[8px] md:text-[10px] uppercase ${
                      isRed ? "text-red-500" : "text-blue-500"
                    } font-bold tracking-tighter`}
                  >
                    River
                  </div>
                  <div
                    className={`w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 rounded-full border ${
                      isRed ? "border-red-500" : "border-blue-500"
                    } flex items-center justify-center mt-1 sm:mt-2`}
                  >
                    <div
                      className={`w-1 h-1 md:w-2 md:h-2 ${
                        isRed ? "bg-red-500" : "bg-blue-500"
                      } rounded-full animate-ping`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {actionPopup && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.3,
                  y: 20,
                  rotate: isLeft ? -15 : 15,
                }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none" // Removed drop-shadow-2xl
              >
                <div
                  className={`text-5xl md:text-7xl font-black rounded-xl px-5 py-2 tracking-tighter text-white ${
                    actionPopup === "HIT!" ? "bg-blue-500" : "bg-red-500"
                  }`}
                >
                  {actionPopup}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
