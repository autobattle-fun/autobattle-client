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
  reason,
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

  // --- Display States ---
  const [displayStatus, setDisplayStatus] = useState(status);
  const [bubbleContent, setBubbleContent] = useState(null);

  const displayTimerRef = useRef(null);
  const reasonTimerRef = useRef(null);
  const reasonShownAtRef = useRef(null);

  const prevStatus = useRef(status);
  const prevCardsLength = useRef(cards.length);

  // --- Inline Status Delayer Logic ---
  useEffect(() => {
    if (displayTimerRef.current) clearTimeout(displayTimerRef.current);

    if (status === "THINKING" || status === "TXPENDING") {
      setDisplayStatus(status);
    } else if (status === "FINALIZED" || status === "DONE") {
      setDisplayStatus("FINALIZED");
    } else if (status === "WAITING") {
      if (
        prevStatus.current === "TXPENDING" ||
        prevStatus.current === "DONE" ||
        prevStatus.current === "FINALIZED"
      ) {
        setDisplayStatus("FINALIZED");
        displayTimerRef.current = setTimeout(() => {
          setDisplayStatus("WAITING");
        }, 2500);
      } else {
        setDisplayStatus("WAITING");
      }
    }
  }, [status]);

  // --- Thinking Bubble Logic ---
  useEffect(() => {
    const now = Date.now();

    if (status === "THINKING") {
      if (reasonTimerRef.current) clearTimeout(reasonTimerRef.current);
      setBubbleContent({ type: "thinking" });
      reasonShownAtRef.current = null;
    } else if (status === "TXPENDING") {
      if (reason) {
        setBubbleContent({ type: "reason", text: reason });
        if (!reasonShownAtRef.current) reasonShownAtRef.current = now;
      }
    } else if (
      status === "FINALIZED" ||
      status === "DONE" ||
      status === "WAITING"
    ) {
      if (reasonShownAtRef.current && reason) {
        const elapsed = now - reasonShownAtRef.current;
        const minDisplayMs = 10000;

        if (elapsed < minDisplayMs) {
          setBubbleContent({ type: "reason", text: reason });
          if (reasonTimerRef.current) clearTimeout(reasonTimerRef.current);

          reasonTimerRef.current = setTimeout(() => {
            setBubbleContent(null);
            reasonShownAtRef.current = null;
          }, minDisplayMs - elapsed);
        } else {
          setBubbleContent(null);
          reasonShownAtRef.current = null;
        }
      } else if (!reasonShownAtRef.current) {
        setBubbleContent(null);
      }
    }

    return () => {
      if (reasonTimerRef.current) clearTimeout(reasonTimerRef.current);
    };
  }, [status, reason]);

  // --- Animation Trigger Logic ---
  useEffect(() => {
    let timer;

    const cardAdded = cards.length > prevCardsLength.current;
    const gameIsActive = prevCardsLength.current > 0;
    const wasThinking =
      prevStatus.current === "THINKING" || prevStatus.current === "TXPENDING";
    const stoppedThinking =
      wasThinking &&
      (status === "WAITING" || status === "FINALIZED" || status === "DONE");

    if (gameIsActive) {
      if (cardAdded && wasThinking) {
        setActionPopup("HIT!");
        timer = setTimeout(() => setActionPopup(null), 1200);
      } else if (!cardAdded && stoppedThinking) {
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
      className={`flex flex-col ${isLeft ? "items-end" : "items-start"} flex-1 w-full relative z-20`}
    >
      {/* Header Info + Bubble */}
      <div
        className={`relative mb-2 md:mb-4 ${isLeft ? "self-end" : "self-start"}`}
      >
        {/* LLM Reason Bubble - floats above the header */}
        <AnimatePresence>
          {bubbleContent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`absolute z-50 bottom-full mb-1.5 sm:mb-2 ${
                isLeft ? "right-10" : "left-10"
              }`}
            >
              <div
                className={`group relative rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 border backdrop-blur-sm ${
                  isRed
                    ? "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800/50 rounded-br-none"
                    : "bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800/50 rounded-bl-none"
                } ${bubbleContent.type === "reason" ? "min-w-[140px]" : ""} sm:max-w-[180px] md:max-w-[220px] hover:max-w-[200px] sm:hover:max-w-[260px] md:hover:max-w-[320px] transition-all duration-200`}
              >
                {/* Bubble Content */}
                {bubbleContent.type === "thinking" && (
                  <div className="flex items-center justify-center py-0.5">
                    <div className="flex gap-[4px] items-end">
                      <span
                        className={`block w-[6px] h-[6px] sm:w-2 sm:h-2 rounded-full animate-bounce ${
                          isRed
                            ? "bg-red-400 dark:bg-red-500"
                            : "bg-blue-400 dark:bg-blue-500"
                        }`}
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className={`block w-[6px] h-[6px] sm:w-2 sm:h-2 rounded-full animate-bounce ${
                          isRed
                            ? "bg-red-400 dark:bg-red-500"
                            : "bg-blue-400 dark:bg-blue-500"
                        }`}
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className={`block w-[6px] h-[6px] sm:w-2 sm:h-2 rounded-full animate-bounce ${
                          isRed
                            ? "bg-red-400 dark:bg-red-500"
                            : "bg-blue-400 dark:bg-blue-500"
                        }`}
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}

                {bubbleContent.type === "reason" && (
                  <p
                    className={`text-[8px] sm:text-[10px] md:text-xs leading-tight font-medium line-clamp-2 group-hover:line-clamp-none group-hover:overflow-y-auto group-hover:max-h-[50px] md:group-hover:max-h-[60px] pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full transition-all duration-200 cursor-default ${
                      isRed
                        ? "text-red-700 dark:text-red-300 [&::-webkit-scrollbar-thumb]:bg-red-500/30"
                        : "text-blue-700 dark:text-blue-300 [&::-webkit-scrollbar-thumb]:bg-blue-500/30"
                    }`}
                  >
                    {bubbleContent.text}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Row: Name + Inline Status Indicators + Avatar */}
        <div
          className={`flex items-center gap-1.5 sm:gap-2 md:gap-4 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
        >
          <div
            className={`flex flex-col ${isLeft ? "items-end" : "items-start"}`}
          >
            <h3 className="font-semibold text-[11px] sm:text-sm md:text-lg tracking-tight whitespace-nowrap">
              {agentName}
            </h3>

            {/* Inline Status Indicators */}
            <div className="flex items-center gap-1 opacity-60 dark:text-zinc-400 text-zinc-600">
              {displayStatus === "WAITING" && (
                <>
                  <ShieldAlert className="w-2.5 h-2.5 md:w-4 md:h-4" />
                  <span className="text-[9px] md:text-sm font-bold font-mono tracking-tighter tabular-nums">
                    {Math.max(0, hp)} / 10
                  </span>
                </>
              )}

              {displayStatus === "THINKING" && (
                <>
                  <div className="rounded-full w-2 h-2 bg-amber-500 relative">
                    <div className="rounded-full w-2 h-2 bg-amber-500 animate-ping absolute"></div>
                  </div>
                  <span className="text-[9px] md:text-sm font-bold font-mono tracking-tighter tabular-nums">
                    THINKING...
                  </span>
                </>
              )}

              {displayStatus === "TXPENDING" && (
                <>
                  <div className="rounded-full w-2 h-2 bg-green-500 relative">
                    <div className="rounded-full w-2 h-2 bg-green-500 animate-ping absolute"></div>
                  </div>
                  <span className="text-[9px] md:text-sm font-bold font-mono tracking-tighter tabular-nums">
                    EXECUTING...
                  </span>
                </>
              )}

              {displayStatus === "FINALIZED" && (
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
                  exit={{ opacity: 0, transition: { duration: 0 } }}
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
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
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
