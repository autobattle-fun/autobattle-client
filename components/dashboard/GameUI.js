"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import AgentSide from "./AgentSide";
import PredictionMarkets from "./PredictionMarket";
import LiveComments from "./LiveComments";
import useGameEngine from "../../hooks/useGameEngine";
import { adaptServerStateToEngine, getDamageValue } from "../../lib/cards";
import MatchResultOverlay from "./MatchResultOverlay";
import { useGameStore } from "@/store/gameStore";
import HowToPlayModal from "./HowToPlayModal";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import useSocket from "@/hooks/useSocket";
import Footer from "./Footer";

export default function GameUI() {
  const engine = useGameEngine();
  const { resolvedTheme } = useTheme();
  const gameState = useGameStore((state) => state.gameState);
  const { round, redHP, blueHP, redCards, blueCards } =
    adaptServerStateToEngine(gameState || {});
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { initializeWebSocket } = useSocket();

  const isDark = resolvedTheme === "dark";

  const PHASE_DISPLAY_MAP = {
    PENDING: "Pending",
    PREPARING: "Preparing",
    ROUND_STARTED: "Round Started",
    AWAITING_INITIAL_DEAL: "Awaiting Initial Deal",
    AWAITING_ACTION: "Awaiting Action",
    AWAITING_HIT_VRF: "Dealing Hit...",
    AWAITING_FINAL_REVEAL_VRF: "Awaiting Final Reveal",
    AWAITING_TIEBREAKER_VRF: "Awaiting Tiebreaker",
    RIVER_REVEALED: "River Revealed",
    ROUND_RESOLVED: "Round Resolved",
    ENDED: "Ended",
  };

  // 🔥 FIX: Define exactly which phases are actively playing/waiting for cards
  const isPlayingPhase = [
    "AWAITING_ACTION",
    "AWAITING_HIT_VRF",
    "AWAITING_FINAL_REVEAL_VRF",
    "AWAITING_TIEBREAKER_VRF",
  ].includes(gameState?.phase);

  return (
    <div
      className={`flex h-screen overflow-hidden selection:bg-amber-500/30 transition-colors duration-500`}
    >
      <div className="flex-1 flex flex-col relative w-full h-full overflow-y-auto overflow-x-hidden">
        <main className="flex-1 p-2 sm:p-4 md:p-8 flex pb-0! flex-col max-w-6xl w-full mx-auto relative">
          <div className="flex flex-col items-center mt-2 md:mt-4 relative z-10 shrink-0">
            <h1
              className={`text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center leading-[1.1] ${isDark ? "text-white" : "text-[#111827]"}`}
            >
              Match #{gameState?.gameId}
              <br />
              <span className="text-zinc-500 font-semibold text-base sm:text-2xl md:text-4xl mt-0.5 md:mt-2 block">
                Closest to 21 Wins
              </span>
            </h1>
          </div>

          <div className="flex flex-col xl:flex-row items-center xl:items-stretch justify-center gap-3 md:gap-8 w-full mt-4 md:mt-10 flex-1 isolate">
            {/* Center Card - Ordered first on Mobile, centered on Desktop */}
            <div className="flex flex-col justify-center items-center w-full max-w-100 xl:max-w-85 shrink-0 relative z-20 order-1 xl:order-2">
              <motion.div
                layout
                className={`${isDark ? "bg-zinc-900/80" : "bg-white/80"} w-full border-foreground/20 backdrop-blur-xl border p-4 md:p-8 rounded-[24px] md:rounded-[32px] flex flex-col items-center text-center relative overflow-hidden transition-colors duration-500`}
              >
                <div className="text-sm md:text-lg uppercase font-bold tracking-[0.05em] text-zinc-500 mb-1">
                  <span>ROUND {round}</span>
                </div>
                <div
                  className={`text-[10px] md:text-xs font-bold tracking-tight mb-3 md:mb-6 bg-primary/10 border border-primary text-primary rounded-lg px-2 py-1`}
                >
                  {PHASE_DISPLAY_MAP[gameState?.phase] || gameState?.phase}
                </div>

                <div className="flex-1 mb-4 flex flex-col items-center justify-center relative w-full gap-2 md:gap-4 p-4 rounded-xl overflow-hidden mt-1 md:mt-2 dark:bg-zinc-900 bg-white border border-amber-500/50 transition-colors duration-500 h-24 md:h-32">
                  {getDamageValue(round) >= 4 && (
                    <div className="absolute inset-0 bg-linear-to-t from-orange-500/20 via-orange-500/5 to-transparent blur-xl animate-pulse pointer-events-none" />
                  )}
                  <span className="text-[8px] md:text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mb-0 md:mb-1 z-10 relative mt-1 md:mt-2">
                    Round Stakes
                  </span>
                  <div
                    className={`text-5xl md:text-7xl font-black tracking-tighter flex items-end gap-1 z-10 relative ${getDamageValue(engine.round) >= 4 ? "text-orange-600 dark:text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "text-amber-600 dark:text-amber-500"}`}
                  >
                    {getDamageValue(round)}
                    <span className="text-xs md:text-lg font-bold tracking-widest opacity-50 mb-1 ml-1">
                      HP
                    </span>
                  </div>
                  {getDamageValue(round) === 1 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      Let the round begin!
                    </div>
                  )}
                  {getDamageValue(round) === 2 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      Getting serious...
                    </div>
                  )}
                  {getDamageValue(round) >= 8 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-red-600 dark:text-red-500 bg-red-500/10 px-2 md:px-3 py-1 rounded-full border border-red-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 animate-bounce z-10 relative shadow-[0_0_10px_rgba(239,68,68,0.2)] mb-2 md:mb-0">
                      Lethal Stakes
                    </div>
                  )}
                  {getDamageValue(round) === 4 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      High Stakes
                    </div>
                  )}
                </div>
                <HowToPlayModal />
              </motion.div>
            </div>

            {/* Red and Blue Agents side-by-side on mobile */}
            <div className="w-full flex flex-row justify-between xl:contents order-2 xl:order-0 gap-2 sm:gap-4">
              <div className="w-[49%] xl:w-2/5 flex justify-end xl:order-1">
                <AgentSide
                  agentName={gameState?.red?.name}
                  imageUrl={gameState?.red?.celebrity?.image}
                  side="red"
                  hp={redHP}
                  cards={redCards}
                  score={gameState?.red?.score}
                  align="left"
                  status={gameState?.playerStatus?.red}
                  reason={gameState?.red?.reason}
                  atRisk={
                    ["ENDED", "Ended"].includes(gameState?.phase)
                      ? 0
                      : getDamageValue(round)
                  }
                  showRiverPlaceholder={isPlayingPhase && redCards.length > 0}
                />
              </div>

              <div className="w-[49%] xl:w-2/5 flex justify-start xl:order-3">
                <AgentSide
                  agentName={gameState?.blue?.name}
                  imageUrl={gameState?.blue?.celebrity?.image}
                  side="blue"
                  hp={blueHP}
                  cards={blueCards}
                  score={gameState?.blue?.score}
                  align="right"
                  status={gameState?.playerStatus?.blue}
                  reason={gameState?.blue?.reason}
                  atRisk={
                    ["ENDED", "Ended"].includes(gameState?.phase)
                      ? 0
                      : getDamageValue(round)
                  }
                  showRiverPlaceholder={isPlayingPhase && blueCards.length > 0}
                />
              </div>
            </div>
          </div>

          <PredictionMarkets />
          <LiveComments />
          <Footer />

          {["ENDED", "Ended"].includes(gameState?.phase) && (
            <MatchResultOverlay
              redName={gameState?.red?.name}
              blueName={gameState?.blue?.name}
              winnerSide={
                gameState?.blue?.hp > gameState?.red?.hp ? "blue" : "red"
              }
              redCards={redCards}
              blueCards={blueCards}
              redScore={gameState?.red?.score}
              blueScore={gameState?.blue?.score}
              onNextMatch={initializeWebSocket}
              onProfile={() => {
                if (user) {
                  router.push("/profile");
                } else {
                  router.push("/login");
                }
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
