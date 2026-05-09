"use client";

import { useState, useEffect, useRef } from "react";
import BuyButton from "./predictionMarket/BuyButton";
import { useGameStore } from "@/store/gameStore";
import { useMarketStore } from "@/store/marketStore";

export default function PredictionMarkets() {
  const gameState = useGameStore((state) => state.gameState);
  const market = useMarketStore((state) => state.market);

  // Animation States
  const [isWinnerShowing, setIsWinnerShowing] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isBlueWin, setIsBlueWin] = useState(false);
  const [winnerName, setWinnerName] = useState("");

  // Refs to track previous values for comparison
  const prevHp = useRef({ red: 10, blue: 10 });

  useEffect(() => {
    if (!gameState) return;

    const currentPhase = gameState.phase;
    const currentRedHp = gameState.red?.hp ?? 10;
    const currentBlueHp = gameState.blue?.hp ?? 10;

    // 1. DETECT ROUND WINNER (Animate In)
    if (currentPhase === "ROUND_RESOLVED" && !isWinnerShowing) {
      // Check whose HP is lower *than it was previously* (meaning they took damage)
      const redTookDamage = currentRedHp < prevHp.current.red;
      const blueTookDamage = currentBlueHp < prevHp.current.blue;

      if (redTookDamage || blueTookDamage) {
        // If Blue took damage, Red won. If Red took damage, Blue won.
        const redWon = blueTookDamage;

        setWinnerName(redWon ? gameState.red?.name : gameState.blue?.name);
        setIsBlueWin(!redWon);
        setIsWinnerShowing(true);
        setIsAnimatingOut(false);
      }
    }

    // 2. DETECT TRANSITION TO NEW ROUND (Animate Out)
    const isGameplayPhase = ["AWAITING_ACTION"].includes(currentPhase);

    if (isGameplayPhase && isWinnerShowing && !isAnimatingOut) {
      setIsAnimatingOut(true);

      const resetTimer = setTimeout(() => {
        setIsWinnerShowing(false);
        setIsAnimatingOut(false);
      }, 500);

      return () => clearTimeout(resetTimer);
    }

    // Update refs for next render so we always have the last known HP
    prevHp.current = { red: currentRedHp, blue: currentBlueHp };
  }, [
    gameState?.phase,
    gameState?.red?.hp,
    gameState?.blue?.hp,
    isWinnerShowing,
    isAnimatingOut,
  ]);

  return (
    <div className="w-full mt-6 md:mt-8 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 relative z-10 shrink-0">
      {/* ─── Match Prediction Market (Left) ─── */}
      <div className="dark:bg-zinc-900 bg-white backdrop-blur-md border border-foreground/20 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden">
        <div className="text-xl sm:text-3xl flex flex-col font-bold mb-5 whitespace-nowrap">
          <span className="truncate">Who will win the match?</span>
          <span className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400 opacity-50">
            Match #{gameState?.gameId || "..."}
          </span>
        </div>

        <div className="flex justify-between items-end gap-3">
          <BuyButton
            candidate={gameState?.red?.name}
            price={`${market?.mainMarket?.yesPrice?.toFixed(2) || 0} $AUTO`}
            color="red"
            market={market?.mainMarket}
            isRound={false}
          />
          <BuyButton
            candidate={gameState?.blue?.name}
            price={`${market?.mainMarket?.noPrice?.toFixed(2) || 0} $AUTO`}
            color="blue"
            isRound={false}
            market={market?.mainMarket}
          />
        </div>
      </div>

      {/* ─── Round Prediction Market (Right) with Winner Overlay ─── */}
      <div className="dark:bg-zinc-900 bg-white backdrop-blur-md border border-foreground/20 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden">
        {/* Winner "Won!" Overlay Animation */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all ease-in-out ${
            isWinnerShowing && !isAnimatingOut
              ? "translate-x-0 opacity-100 duration-500"
              : isAnimatingOut
                ? "-translate-x-full opacity-100 duration-500"
                : "translate-x-full opacity-0 duration-0"
          } ${isBlueWin ? "bg-blue-600" : "bg-red-600"}`}
        >
          <span className="text-3xl md:text-5xl text-white font-black uppercase tracking-tighter drop-shadow-lg text-center px-4">
            {winnerName} Won!
          </span>
          <span className="text-sm md:text-base text-white/80 font-bold mt-2 tracking-widest uppercase">
            Preparing Next Round...
          </span>
        </div>

        {/* The Standard Round UI */}
        <div
          className={`flex flex-col h-full transition-opacity duration-300 ${
            isWinnerShowing && !isAnimatingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="text-xl sm:text-3xl flex flex-col font-bold mb-5 whitespace-nowrap">
            <span className="truncate">Who will win this round?</span>
            <span className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400 opacity-50 transition-all">
              Match #{gameState?.gameId || "..."} - Round{" "}
              {gameState?.roundNumber || 1}
            </span>
          </div>

          <div className="flex justify-between items-end gap-3">
            <BuyButton
              candidate={gameState?.red?.name}
              price={`${market?.roundMarket?.yesPrice?.toFixed(2) || 0} $AUTO`}
              color="red"
              market={market?.roundMarket}
              isRound={true}
            />
            <BuyButton
              candidate={gameState?.blue?.name}
              price={`${market?.roundMarket?.noPrice?.toFixed(2) || 0} $AUTO`}
              color="blue"
              isRound={true}
              market={market?.roundMarket}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
