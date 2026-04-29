import { useState, useEffect } from "react";
import BuyButton from "./predictionMarket/BuyButton";
import { useGameStore } from "@/store/gameStore"; // Assuming this is your import

export default function PredictionMarkets() {
  const gameState = useGameStore((state) => state.gameState);

  // Use the server's round number if available, fallback to 1
  const roundNum = gameState?.roundNumber || 1;

  const [isWinnerShowing, setIsWinnerShowing] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isBlueWin, setIsBlueWin] = useState(false);
  const [winnerName, setWinnerName] = useState("");

  useEffect(() => {
    const phase = gameState?.phase;

    if (phase === "BlueWon" || phase === "RedWon") {
      if (phase === "BlueWon") {
        setIsBlueWin(true);
        setWinnerName("Joe Biden");
      } else {
        setIsBlueWin(false);
        setWinnerName("Donald Trump");
      }
      setIsWinnerShowing(true);
      setIsAnimatingOut(false);
    }

    if (phase === "RedTurn" || phase === "BlueTurn") {
      if (isWinnerShowing && !isAnimatingOut) {
        setIsAnimatingOut(true);

        const resetTimer = setTimeout(() => {
          setIsWinnerShowing(false);
          setIsAnimatingOut(false);
        }, 500);

        return () => clearTimeout(resetTimer);
      }
    }
  }, [gameState?.phase, isWinnerShowing, isAnimatingOut]);

  return (
    <div className="w-full mt-6 md:mt-8 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 relative z-10 shrink-0">
      {/* Match Prediction Market */}
      <div className="dark:bg-zinc-900 bg-white backdrop-blur-md border border-foreground/20 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden">
        <div className="text-xl sm:text-3xl flex flex-col font-bold mb-5 whitespace-nowrap">
          <span className="truncate">Who will win the match?</span>
          <span className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400 opacity-50">
            Match #{gameState?.gameId || 24}
          </span>
        </div>

        <div className="flex justify-between items-end gap-3">
          <BuyButton
            candidate={gameState?.red?.name}
            price="54 $AUTO"
            color="red"
          />
          <BuyButton
            candidate={gameState?.blue?.name}
            price="46 $AUTO"
            color="blue"
          />
        </div>
      </div>

      <div className="dark:bg-zinc-900 bg-white backdrop-blur-md border border-foreground/20 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden">
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all ease-in-out ${
            isWinnerShowing && !isAnimatingOut
              ? "translate-x-0 opacity-100 duration-500" // Enter animation
              : isAnimatingOut
                ? "-translate-x-full opacity-100 duration-500" // Exit animation (slides left)
                : "translate-x-full opacity-0 duration-0" // Hidden state (rests on right)
          } ${isBlueWin ? "bg-blue-500" : "bg-red-500"}`}
        >
          <span className="text-3xl md:text-4xl text-white font-black uppercase tracking-tighter drop-shadow-md">
            {winnerName} Won!
          </span>
          <span className="text-sm md:text-base text-white/80 font-bold mt-1">
            Preparing...
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
              Match #{gameState?.gameId || 24} - Round {roundNum}
            </span>
          </div>

          <div className="flex justify-between items-end gap-3">
            <BuyButton
              candidate={gameState?.red?.name}
              price="54 $AUTO"
              color="red"
            />
            <BuyButton
              candidate={gameState?.blue?.name}
              price="46 $AUTO"
              color="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
