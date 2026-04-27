"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import AgentSide from "./AgentSide";
import PredictionMarkets from "./PredictionMarket";
import LiveComments from "./LiveComments";
import useGameEngine from "../../hooks/useGameEngine";
import { calculateScore, getDamageValue } from "../../lib/cards";
import MatchResultOverlay from "./MatchResultOverlay";

export default function GameUI() {
  const engine = useGameEngine();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`flex h-screen overflow-hidden selection:bg-amber-500/30 transition-colors duration-500`}
    >
      <div className="flex-1 flex flex-col relative w-full h-full overflow-y-auto overflow-x-hidden">
        <main className="flex-1 p-2 sm:p-4 md:p-8 flex !pb-0 flex-col max-w-6xl w-full mx-auto relative">
          <div className="flex flex-col items-center mt-2 md:mt-4 relative z-10 shrink-0">
            <h1
              className={`text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center leading-[1.1] ${isDark ? "text-white" : "text-[#111827]"}`}
            >
              Match #24
              <br />
              <span className="text-zinc-500 font-semibold text-base sm:text-2xl md:text-4xl mt-0.5 md:mt-2 block">
                Closest to 21 Wins
              </span>
            </h1>
          </div>

          <div className="flex flex-col xl:flex-row items-center xl:items-stretch justify-center gap-3 md:gap-8 w-full mt-4 md:mt-10 flex-1 isolate">
            {/* Center Card - Ordered first on Mobile, centered on Desktop */}
            <div className="flex flex-col justify-center items-center w-full max-w-[400px] xl:max-w-[340px] shrink-0 relative z-20 order-1 xl:order-2">
              <motion.div
                layout
                className={`${isDark ? "bg-zinc-900/80" : "bg-white/80"} w-full border-foreground/20 backdrop-blur-xl border p-4 md:p-8 rounded-[24px] md:rounded-[32px] flex flex-col items-center text-center relative overflow-hidden transition-colors duration-500`}
              >
                <div className="text-sm md:text-lg uppercase font-bold tracking-[0.05em] text-zinc-500 mb-1">
                  <span>ROUND {engine.round}</span>
                </div>
                <div
                  className={`text-[10px] md:text-xs font-bold tracking-tight mb-3 md:mb-6 bg-primary/10 border border-primary text-primary rounded-lg px-2 py-1`}
                >
                  {engine.phase.replace(/([A-Z])/g, " $1").trim()}
                </div>

                <div className="flex-1 mb-4 flex flex-col items-center justify-center relative w-full gap-2 md:gap-4 p-4 rounded-xl overflow-hidden mt-1 md:mt-2 dark:bg-zinc-900 bg-white border border-amber-500/50 transition-colors duration-500 h-24 md:h-32">
                  {getDamageValue(engine.round) >= 4 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent blur-xl animate-pulse pointer-events-none" />
                  )}
                  <span className="text-[8px] md:text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mb-0 md:mb-1 z-10 relative mt-1 md:mt-2">
                    Round Stakes
                  </span>
                  <div
                    className={`text-5xl md:text-7xl font-black tracking-tighter flex items-end gap-1 z-10 relative ${getDamageValue(engine.round) >= 4 ? "text-orange-600 dark:text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "text-amber-600 dark:text-amber-500"}`}
                  >
                    {getDamageValue(engine.round)}
                    <span className="text-xs md:text-lg font-bold tracking-widest opacity-50 mb-1 ml-1">
                      HP
                    </span>
                  </div>
                  {getDamageValue(engine.round) === 1 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      Let the round begin!
                    </div>
                  )}
                  {getDamageValue(engine.round) === 2 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      Getting serious...
                    </div>
                  )}
                  {getDamageValue(engine.round) >= 8 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-red-600 dark:text-red-500 bg-red-500/10 px-2 md:px-3 py-1 rounded-full border border-red-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 animate-bounce z-10 relative shadow-[0_0_10px_rgba(239,68,68,0.2)] mb-2 md:mb-0">
                      Lethal Stakes
                    </div>
                  )}
                  {getDamageValue(engine.round) === 4 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      High Stakes
                    </div>
                  )}
                </div>

                <motion.button
                  disabled={engine.isProcessing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={engine.crank}
                  className={`w-full py-2 bg-primary/10 border cursor-pointer border-primary text-primary rounded-lg text-sm md:text-base font-bold tracking-wide transition-all flex justify-center items-center gap-2`}
                >
                  How to Play
                  {engine.phase !== "Ended" && (
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 -mr-1" />
                  )}
                </motion.button>
              </motion.div>
            </div>

            {/* Red and Blue Agents side-by-side on mobile */}
            <div className="w-full flex flex-row justify-between xl:contents order-2 xl:order-none gap-2 sm:gap-4">
              <div className="w-[49%] xl:w-2/5 flex justify-end xl:order-1">
                <AgentSide
                  agentName="Donald Trump"
                  side="red"
                  hp={engine.redHP}
                  cards={engine.redCards}
                  score={calculateScore(engine.redCards).score}
                  align="left"
                  atRisk={
                    engine.phase === "Ended" ? 0 : getDamageValue(engine.round)
                  }
                  showRiverPlaceholder={
                    ["RedTurn", "BlueTurn", "AwaitingFinalRevealVRF"].includes(
                      engine.phase,
                    ) && engine.redCards.length > 0
                  }
                />
              </div>

              <div className="w-[49%] xl:w-2/5 flex justify-start xl:order-3">
                <AgentSide
                  agentName="Joe Biden"
                  side="blue"
                  hp={engine.blueHP}
                  cards={engine.blueCards}
                  score={calculateScore(engine.blueCards).score}
                  align="right"
                  atRisk={
                    engine.phase === "Ended" ? 0 : getDamageValue(engine.round)
                  }
                  showRiverPlaceholder={
                    ["RedTurn", "BlueTurn", "AwaitingFinalRevealVRF"].includes(
                      engine.phase,
                    ) && engine.blueCards.length > 0
                  }
                />
              </div>
            </div>
          </div>

          <PredictionMarkets />
          <LiveComments logs={engine.logs} />

          {engine.phase === "Ended" && (
            <MatchResultOverlay
              winnerSide={engine.winner} // Ensure your engine returns "red", "blue", or "draw"
              redCards={engine.redCards}
              blueCards={engine.blueCards}
              redScore={calculateScore(engine.redCards).score}
              blueScore={calculateScore(engine.blueCards).score}
              onNextMatch={() => console.log("Routing to MatchMaking...")}
              onProfile={() => console.log("Routing to Profile...")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
