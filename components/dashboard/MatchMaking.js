"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import Footer from "./Footer";

const AGENT_NAMES = [
  "NeuralNinja",
  "QuantumBot",
  "CyberSamurai",
  "CryptoKing",
  "AgentZero",
  "NexusMind",
  "SynthWeaver",
  "DataGhost",
  "AlphaCentauri",
  "DeFiDragon",
  "LogicNode",
  "BitWarden",
  "AutoScout",
  "ForgeMaster",
];

// Exactly 2 sets for a perfect 50% loop with Framer Motion
const SCROLL_NAMES = [...AGENT_NAMES, ...AGENT_NAMES];
const DEFAULT_MATCHMAKING_SECONDS = 300;

const resolveCountdownSeconds = (countdown) => {
  if (typeof countdown === "number" && Number.isFinite(countdown)) {
    return Math.max(0, countdown);
  }

  if (!countdown) return DEFAULT_MATCHMAKING_SECONDS;

  if (countdown.isBreak && Number.isFinite(countdown.remainingSeconds)) {
    return Math.max(0, countdown.remainingSeconds);
  }

  if (
    Number.isFinite(countdown.remainingSeconds) &&
    countdown.remainingSeconds > 0
  ) {
    return countdown.remainingSeconds;
  }

  return DEFAULT_MATCHMAKING_SECONDS;
};

export default function MatchMaking() {
  const gameState = useGameStore((state) => state.gameState);
  const countdown = useGameStore((state) => state.countdown);
  const [timeLeft, setTimeLeft] = useState(() =>
    resolveCountdownSeconds(countdown),
  );
  const [isMatched, setIsMatched] = useState(false);
  const [finalPlayer1, setFinalPlayer1] = useState("");
  const [finalPlayer2, setFinalPlayer2] = useState("");

  useEffect(() => {
    setTimeLeft(resolveCountdownSeconds(countdown));
  }, [countdown]);

  useEffect(() => {
    if (!countdown?.isBreak) return;

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown?.isBreak]);

  useEffect(() => {
    if (gameState && countdown?.isBreak) {
      setIsMatched(true);
      setFinalPlayer1(gameState?.red?.name);
      setFinalPlayer2(gameState?.blue?.name);
    } else if (!gameState && countdown?.isBreak) {
      setIsMatched(false);
    }
  }, [gameState, countdown?.isBreak]);

  const formatTime = (seconds) => {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const m = Math.floor(safeSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (safeSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="w-full flex flex-col relative min-h-[95vh] overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center z-10 w-full px-4 ">
          <div className="flex flex-col items-center justify-center gap-2 mt-10 md:mt-0">
            <Image
              src="/logo/Autobattle-logo.svg"
              alt="Autobattle"
              width={60}
              height={60}
              className="mb-6"
            />
          </div>

          {/* Timer Section */}
          <div className="mb-12 flex flex-col items-center transition-all duration-500">
            <span className="text-sm md:text-lg text-foreground font-bold uppercase tracking-widest mb-2">
              {isMatched ? "Match Finalized" : "Matchmaking in progress"}
            </span>
            <span
              className={`text-6xl md:text-8xl font-black tabular-nums transition-transform duration-500 ${
                isMatched ? "scale-110 text-green-600" : "text-foreground"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Matchmaking Container */}
          <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
            {/* Player 1 Box */}
            <div className="flex-1 flex justify-center items-start w-full bg-transparent rounded-3xl h-[120px] md:h-[160px] overflow-hidden relative">
              {!isMatched ? (
                <div
                  className="w-full h-full flex justify-center items-start"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
                  }}
                >
                  <motion.div
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{
                      ease: "linear",
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                    className="flex flex-col items-center shrink-0 w-full"
                  >
                    {SCROLL_NAMES.map((name, i) => (
                      <span
                        key={i}
                        className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground/50 blur-[1px] h-[120px] md:h-[160px] flex items-center justify-center shrink-0 w-full"
                      >
                        {name}
                      </span>
                    ))}
                  </motion.div>
                </div>
              ) : (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="text-3xl font-black uppercase tracking-tighter text-center text-foreground h-full flex items-center"
                >
                  {finalPlayer1}
                </motion.span>
              )}
            </div>

            {/* VS Badge */}
            <div className="shrink-0 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center z-20">
              <span className="text-xl md:text-4xl font-black text-foreground">
                VS
              </span>
            </div>

            {/* Player 2 Box */}
            <div className="flex-1 flex justify-center items-start w-full bg-transparent rounded-3xl h-[120px] md:h-[160px] overflow-hidden relative">
              {!isMatched ? (
                <div
                  className="w-full h-full flex justify-center items-start"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
                  }}
                >
                  <motion.div
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{
                      ease: "linear",
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                    className="flex flex-col items-center shrink-0 w-full"
                  >
                    {SCROLL_NAMES.map((name, i) => (
                      <span
                        key={i}
                        className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground/50 blur-[1px] h-[120px] md:h-[160px] flex items-center justify-center shrink-0 w-full"
                      >
                        {name}
                      </span>
                    ))}
                  </motion.div>
                </div>
              ) : (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="text-3xl font-black uppercase tracking-tighter text-center text-foreground h-full flex items-center"
                >
                  {finalPlayer2}
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
