"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import PlayingCard from "./PlayingCard";

export default function MatchResultOverlay({
  winnerSide = "red", // "red" | "blue" | "draw"
  redName,
  blueName,
  redCards = [],
  blueCards = [],
  redScore = 0,
  blueScore = 0,
  onNextMatch,
  onProfile,
}) {
  const [timeLeft, setTimeLeft] = useState(60);

  const isRedWin = winnerSide === "red";

  const winnerName = isRedWin ? redName : blueName;

  const winnerColor = isRedWin ? "text-red-500" : "text-blue-500";

  const winnerBg = isRedWin ? "bg-red-500" : "bg-blue-500";

  // --- Countdown Timer Logic ---
  useEffect(() => {
    if (timeLeft <= 0) {
      handleNextMatch();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Consolidate the Next Match click action
  const handleNextMatch = () => {
    if (onNextMatch) onNextMatch(); // Call the prop if you have extra parent logic
    window.location.reload();
  };

  // Math for the SVG circle (Circumference = 2 * PI * Radius)
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * timeLeft) / 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
        className="dark:bg-zinc-900 bg-white border border-foreground/20 rounded-[32px] p-6 md:p-10 w-full max-w-4xl flex flex-col items-center relative overflow-hidden shadow-2xl"
      >
        {/* Glow effect behind the text */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-[80px] opacity-20 pointer-events-none ${winnerBg}`}
        />

        <div className="text-sm md:text-lg uppercase font-bold tracking-[0.2em] text-zinc-500 mb-2 relative z-10">
          Match Concluded
        </div>

        <div
          className={`text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 relative z-10 text-center ${winnerColor}`}
        >
          {winnerName} Wins!
        </div>

        {/* Final Decks Container */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full w-max-3xl relative z-10">
          {/* Red Player Deck */}
          <div className="flex-1 flex flex-col items-center dark:bg-zinc-800/50 bg-zinc-100 rounded-[24px] p-6 border border-foreground/5">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                Donald Trump
              </span>
              <span className="text-2xl md:text-3xl font-black text-red-500 tabular-nums">
                {redScore}
              </span>
            </div>
            <div className="flex justify-center items-center h-[120px] md:h-[150px]">
              {redCards.map((card, i) => (
                <PlayingCard
                  key={card.id + "_" + i}
                  card={{ ...card, isFaceUp: true }}
                  delay={0.1 * i}
                  align="right"
                  zIndex={i}
                />
              ))}
            </div>
          </div>

          {/* Blue Player Deck */}
          <div className="flex-1 flex flex-col items-center dark:bg-zinc-800/50 bg-zinc-100 rounded-[24px] p-6 border border-foreground/5">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                Joe Biden
              </span>
              <span className="text-2xl md:text-3xl font-black text-blue-500 tabular-nums">
                {blueScore}
              </span>
            </div>
            <div className="flex justify-center items-center h-[120px] md:h-[150px]">
              {blueCards.map((card, i) => (
                <PlayingCard
                  key={card.id + "_" + i}
                  card={{ ...card, isFaceUp: true }}
                  delay={0.1 * i}
                  align="right"
                  zIndex={i}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-12 w-full max-w-md relative z-10">
          <div
            onClick={onProfile}
            className="flex-1 bg-zinc-300 dark:bg-zinc-800 rounded-xl md:rounded-2xl pb-[4px] md:pb-[7px] cursor-pointer group"
          >
            <div className="h-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 py-3 md:py-4 rounded-xl md:rounded-2xl flex justify-center items-center transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]">
              <span className="font-bold text-sm md:text-base tracking-wide text-zinc-900 dark:text-zinc-100">
                Claim Rewards
              </span>
            </div>
          </div>

          {/* Next Match Button (Primary 3D Style with Timer) */}
          <div
            onClick={handleNextMatch}
            className={`flex-1 rounded-xl md:rounded-2xl pb-[4px] md:pb-[7px] cursor-pointer group ${
              isRedWin ? "bg-red-700" : "bg-blue-700"
            }`}
          >
            <div
              className={`h-full py-3 md:py-4 rounded-xl md:rounded-2xl flex justify-center items-center transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px] ${
                isRedWin ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm md:text-base tracking-wide">
                  Next Match
                </span>

                {/* SVG Progress Ring */}
                <div className="relative flex items-center justify-center w-6 h-6">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                    {/* Faded Background Track */}
                    <circle
                      cx="12"
                      cy="12"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="transparent"
                      className="opacity-20 text-white"
                    />
                    {/* Active Progress Line */}
                    <circle
                      cx="12"
                      cy="12"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="text-white transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  {/* Absolute positioned number inside the ring */}
                  <span className="absolute text-[9px] font-black tabular-nums text-white">
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
