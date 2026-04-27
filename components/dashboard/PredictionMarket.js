import { useState, useEffect } from "react";
import BuyButton from "./predictionMarket/BuyButton";

export default function PredictionMarkets() {
  const [roundState, setRoundState] = useState("round:current");
  const [roundNum, setRoundNum] = useState(3);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (roundState.startsWith("round:change:")) {
      const slideOutTimer = setTimeout(() => {
        setIsAnimatingOut(true);
      }, 2000);

      const resetTimer = setTimeout(() => {
        setRoundNum((prev) => prev + 1);
        setRoundState("round:current");
        setIsAnimatingOut(false);
      }, 2500);

      return () => {
        clearTimeout(slideOutTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [roundState]);

  const isWinnerState = roundState.startsWith("round:change:");
  const winnerName = isWinnerState ? roundState.split(":")[2] : "";
  const isBlueWin = winnerName.toLowerCase() === "joe biden";

  return (
    <div className="w-full mt-6 md:mt-8 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 relative z-10 shrink-0">
      <div className="dark:bg-zinc-900 bg-white backdrop-blur-md border border-foreground/20 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden">
        <div className="text-xl sm:text-3xl flex flex-col font-bold mb-5 whitespace-nowrap">
          <span className="truncate">Who will win the match?</span>
          <span className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400 opacity-50">
            Match #24
          </span>
        </div>

        <div className="flex justify-between items-end gap-3">
          <BuyButton candidate="Donald Trump" price="54 $AUTO" color="red" />
          <BuyButton candidate="Joe Biden" price="46 $AUTO" color="blue" />
        </div>
      </div>

      <div className="dark:bg-zinc-900 bg-white backdrop-blur-md border border-foreground/20 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden">
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all ease-in-out ${
            isWinnerState && !isAnimatingOut
              ? "translate-x-0 opacity-100 duration-500"
              : isAnimatingOut
                ? "-translate-x-full opacity-100 duration-500"
                : "translate-x-full opacity-0 duration-0"
          } ${isBlueWin ? "bg-blue-500" : "bg-red-500"}`}
        >
          <span className="text-3xl md:text-4xl text-white font-black uppercase tracking-tighter drop-shadow-md">
            {winnerName} Won!
          </span>
          <span className="text-sm md:text-base text-white/80 font-bold mt-1">
            Preparing Round {roundNum + 1}...
          </span>
        </div>

        <div
          className={`flex flex-col h-full transition-opacity duration-300 ${
            isWinnerState && !isAnimatingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="text-xl sm:text-3xl flex flex-col font-bold mb-5 whitespace-nowrap">
            <span className="truncate">Who will win this round?</span>
            <span className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400 opacity-50 transition-all">
              Match #24 - Round {roundNum}
            </span>
          </div>

          <div className="flex justify-between items-end gap-3">
            <BuyButton candidate="Donald Trump" price="54 $AUTO" color="red" />
            <BuyButton candidate="Joe Biden" price="46 $AUTO" color="blue" />
          </div>
        </div>

        <div className="absolute top-3 right-3 flex gap-2 z-30 opacity-30 hover:opacity-100 transition-opacity">
          <button
            onClick={() => setRoundState("round:change:joe biden")}
            className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded"
          >
            Win Blue
          </button>
          <button
            onClick={() => setRoundState("round:change:donald trump")}
            className="text-[10px] bg-red-600 text-white px-2 py-1 rounded"
          >
            Win Red
          </button>
        </div>
      </div>
    </div>
  );
}
