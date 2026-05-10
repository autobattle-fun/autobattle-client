"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import AgentSide from "./AgentSide";
import { getDamageValue, drawRandomCard } from "../../lib/cards";
import Footer from "./Footer";

// Utility for Tailwind classes merging
const cn = (...classes) => classes.filter(Boolean).join(" ");

// --- Smart Contract Helper ---
// Safely calculates score using your native card objects
const applyCardToState = (playerState, newCard) => {
  let { score, aces, cards } = playerState;
  const rank = newCard.rank;

  let value = 0;
  if (rank === "A") {
    aces += 1;
    value = 11;
  } else if (["J", "Q", "K"].includes(rank)) {
    value = 10;
  } else {
    value = parseInt(rank);
  }

  score += value;

  // Reduce aces if over 21
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return { ...playerState, score, aces, cards: [...cards, newCard] };
};

// --- Action Button Component ---
const ActionButton = ({ onClick, label, baseColor, topColor }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 rounded-xl md:rounded-2xl pb-[4px] group cursor-pointer w-full",
      baseColor,
    )}
  >
    <div
      className={cn(
        "h-full w-full rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center transition-transform duration-150 ease-out",
        topColor,
        "group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]",
      )}
    >
      <div className="text-sm md:text-xl text-white font-bold tracking-tighter flex items-center justify-center gap-2 w-full">
        {label}
      </div>
    </div>
  </button>
);

export default function PlayGameUI() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // --- Unified State Machine (Mimics Rust GameState struct) ---
  const [gs, setGs] = useState({
    phase: "AwaitingInitialDeal",
    round: 1,
    activePlayer: "Red",
    message: "Initializing Smart Contract...",
    p1: { hp: 10, score: 0, aces: 0, stayed: false, cards: [] },
    p2: { hp: 10, score: 0, aces: 0, stayed: false, cards: [] },
  });

  const dmg = getDamageValue(gs.round);

  // Pool all currently dealt cards to prevent duplicates
  const allCardsInPlay = [...gs.p1.cards, ...gs.p2.cards];

  // --- Engine Loop ---
  useEffect(() => {
    let timer;

    if (gs.phase === "AwaitingInitialDeal") {
      timer = setTimeout(() => {
        const c1 = drawRandomCard([]);
        const c2 = drawRandomCard([c1]);
        setGs((s) => ({
          ...s,
          p1: applyCardToState(s.p1, c1),
          p2: applyCardToState(s.p2, c2),
          phase: "AwaitingAction",
          activePlayer: "Red",
          message: "Your turn! Will you hit or stay?",
        }));
      }, 600);
    }

    // AI Turn (Blue)
    if (gs.phase === "AwaitingAction" && gs.activePlayer === "Blue") {
      timer = setTimeout(() => {
        setGs((s) => {
          let nextP2 = { ...s.p2 };
          let nextP1 = { ...s.p1 };
          let active = "Blue";
          let msg = "";

          if (nextP2.score < 16) {
            const aiCard = drawRandomCard([...s.p1.cards, ...s.p2.cards]);
            nextP2 = applyCardToState(nextP2, aiCard);
            if (nextP2.score >= 21) nextP2.stayed = true; // Forced Stay on Bust/21
            msg = "AI hit.";
          } else {
            nextP2.stayed = true;
            msg = "AI stayed.";
          }

          // Alternating Turn Logic
          if (!nextP1.stayed) {
            active = "Red";
            msg += " Your turn.";
          }

          let nextPhase = "AwaitingAction";
          if (nextP1.stayed && nextP2.stayed) {
            nextPhase = "AwaitingFinalRevealVRF";
            msg = "Both stayed. Generating Final Reveal VRF...";
          }

          return {
            ...s,
            p2: nextP2,
            activePlayer: active,
            phase: nextPhase,
            message: msg,
          };
        });
      }, 1200);
    }

    // River / Tiebreaker Draw
    if (
      gs.phase === "AwaitingFinalRevealVRF" ||
      gs.phase === "AwaitingTiebreakerVRF"
    ) {
      timer = setTimeout(() => {
        setGs((s) => {
          const inPlay = [...s.p1.cards, ...s.p2.cards];
          const c1 = drawRandomCard(inPlay);
          const c2 = drawRandomCard([...inPlay, c1]);
          return {
            ...s,
            p1: applyCardToState(s.p1, c1),
            p2: applyCardToState(s.p2, c2),
            phase: "ReadyToResolve",
            message: "River cards dealt! Resolving contract constraints...",
          };
        });
      }, 1500);
    }

    // Resolution Logic (Diff comparison)
    if (gs.phase === "ReadyToResolve") {
      timer = setTimeout(() => {
        setGs((s) => {
          let diff1 = Math.abs(s.p1.score - 21);
          let diff2 = Math.abs(s.p2.score - 21);
          let nextP1 = { ...s.p1 };
          let nextP2 = { ...s.p2 };
          let damage = getDamageValue(s.round);
          let msg = "";

          // Tiebreaker Reset Logic
          if (diff1 === diff2) {
            msg = "Tie detected! Entering Sudden Death VRF.";
            nextP1 = { ...nextP1, score: 0, aces: 0, stayed: false };
            nextP2 = { ...nextP2, score: 0, aces: 0, stayed: false };
            return {
              ...s,
              p1: nextP1,
              p2: nextP2,
              phase: "AwaitingTiebreakerVRF",
              message: msg,
            };
          }

          // Win/Loss applying damage
          if (diff1 < diff2) {
            nextP2.hp = Math.max(0, nextP2.hp - damage);
            msg = `Red wins round! Dealt ${damage} damage.`;
          } else {
            nextP1.hp = Math.max(0, nextP1.hp - damage);
            msg = `Blue wins round! Dealt ${damage} damage.`;
          }

          let nextPhase = "AwaitingInitialDeal";
          let nextRound = s.round;

          if (nextP1.hp === 0 || nextP2.hp === 0) {
            nextPhase = "Ended";
            msg =
              nextP1.hp === 0
                ? "GAME OVER. You lost."
                : "VICTORY! AI Terminated.";
          } else {
            nextRound += 1;
            // Clean up for next round
            nextP1 = { ...nextP1, score: 0, aces: 0, stayed: false, cards: [] };
            nextP2 = { ...nextP2, score: 0, aces: 0, stayed: false, cards: [] };
          }

          return {
            ...s,
            p1: nextP1,
            p2: nextP2,
            phase: nextPhase,
            round: nextRound,
            message: msg,
          };
        });
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [gs]);

  // --- User Handlers ---
  const playerHit = () => {
    if (gs.phase !== "AwaitingAction" || gs.activePlayer !== "Red") return;
    setGs((s) => {
      const newCard = drawRandomCard([...s.p1.cards, ...s.p2.cards]);
      let nextP1 = applyCardToState(s.p1, newCard);
      if (nextP1.score >= 21) nextP1.stayed = true; // Forced Stay

      let active = "Blue";
      let nextPhase = "AwaitingAction";
      let msg = "AI's turn.";

      if (nextP1.stayed && s.p2.stayed) {
        nextPhase = "AwaitingFinalRevealVRF";
        msg = "Both stayed. Generating Final Reveal VRF...";
      } else if (s.p2.stayed) {
        active = "Red"; // If Blue already stayed, Red keeps hitting until they stay
        msg = "Your turn again.";
      }

      return {
        ...s,
        p1: nextP1,
        activePlayer: active,
        phase: nextPhase,
        message: msg,
      };
    });
  };

  const playerStay = () => {
    if (gs.phase !== "AwaitingAction" || gs.activePlayer !== "Red") return;
    setGs((s) => {
      let nextP1 = { ...s.p1, stayed: true };

      if (s.p2.stayed) {
        return {
          ...s,
          p1: nextP1,
          phase: "AwaitingFinalRevealVRF",
          message: "Both stayed. Generating Final Reveal VRF...",
        };
      }
      return { ...s, p1: nextP1, activePlayer: "Blue", message: "AI's turn." };
    });
  };

  const resetGame = () => {
    setGs({
      phase: "AwaitingInitialDeal",
      round: 1,
      activePlayer: "Red",
      message: "Initializing Smart Contract...",
      p1: { hp: 10, score: 0, aces: 0, stayed: false, cards: [] },
      p2: { hp: 10, score: 0, aces: 0, stayed: false, cards: [] },
    });
  };

  // --- Display Mappers ---
  const isGameOver = gs.phase === "Ended";

  const getAgentStatus = (side) => {
    if (
      [
        "AwaitingInitialDeal",
        "AwaitingFinalRevealVRF",
        "ReadyToResolve",
        "AwaitingTiebreakerVRF",
      ].includes(gs.phase)
    )
      return "WAITING";
    if (gs.phase === "AwaitingAction") {
      if (side === "red")
        return gs.activePlayer === "Red" ? "THINKING" : "WAITING";
      if (side === "blue")
        return gs.activePlayer === "Blue" ? "THINKING" : "WAITING";
    }
    return "FINALIZED";
  };

  // Explicit check to hide the placeholder when resolving
  const isPlaceholderPhase = [
    "AwaitingAction",
    "AwaitingFinalRevealVRF",
    "AwaitingTiebreakerVRF",
  ].includes(gs.phase);

  return (
    <div
      className={`flex flex-col overflow-hidden selection:bg-indigo-500/30 transition-colors duration-500 ${isDark ? "bg-zinc-950" : "bg-[#f4f6f8]"}`}
    >
      <div className="flex-1 flex flex-col relative w-full h-full overflow-y-auto overflow-x-hidden">
        <main className="flex-1 p-2 sm:p-4 md:p-8 flex pb-12 flex-col max-w-6xl w-full mx-auto relative">
          {/* Header */}
          <div className="flex flex-col items-center mt-2 md:mt-4 relative z-10 shrink-0 mb-6 md:mb-10">
            <h1
              className={`text-2xl sm:text-4xl md:text-[44px] font-bold tracking-tight text-center leading-[1.1] ${isDark ? "text-white" : "text-[#111827]"}`}
            >
              {isGameOver ? "MATCH TERMINATED" : `Autobattle.fun`}
              <br />
              <span
                className={`font-semibold text-base sm:text-2xl md:text-[28px] mt-1 md:mt-2 block ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Closest to 21 Wins
              </span>
            </h1>
          </div>

          {/* 3-Column Layout -> Responsive Stack/Wrap */}
          <div className="flex flex-wrap lg:flex-nowrap items-start justify-center gap-x-2 gap-y-6 lg:gap-5 xl:gap-0 w-full flex-1 isolate mt-0 xl:mt-4">
            {/* Left Agent (Red) */}
            <div className="order-2 lg:order-1 flex-1 lg:flex-none lg:w-[30%] flex justify-end">
              <AgentSide
                agentName="You"
                side="red"
                hp={gs.p1.hp}
                cards={gs.p1.cards} // Restored native card objects
                score={gs.p1.score}
                align="left"
                status={getAgentStatus("red")}
                atRisk={isGameOver ? 0 : dmg}
                showRiverPlaceholder={
                  isPlaceholderPhase && gs.p1.cards.length > 0
                }
              />
            </div>

            {/* Center Area (Card + Buttons) Wrapper */}
            <div className="order-1 lg:order-2 w-full lg:w-[38%] flex justify-center shrink-0 relative z-20 mb-8 lg:mb-0">
              <div className="flex flex-col justify-start items-center w-full min-w-[140px] max-w-[340px]">
                <motion.div
                  layout
                  className={`${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"} w-full h-auto border p-3 md:p-6 rounded-2xl md:rounded-[32px] flex flex-col items-center text-center relative transition-colors duration-500`}
                >
                  <div className="text-xs md:text-base uppercase font-bold tracking-[0.1em] text-slate-500 mb-1 md:mb-2">
                    <span>ROUND {gs.round}</span>
                  </div>

                  <div
                    className={`text-[10px] md:text-xs font-semibold tracking-wide mb-3 md:mb-4 border rounded-full px-2 py-0.5 md:px-3 md:py-1 ${
                      gs.activePlayer === "Blue"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-indigo-50 text-indigo-600 border-indigo-200"
                    }`}
                  >
                    {gs.phase === "AwaitingAction"
                      ? `${gs.activePlayer} Turn`
                      : "Resolving"}
                  </div>

                  {/* Stakes Card */}
                  <div
                    className={`w-full flex flex-col items-center justify-center relative py-4 px-2 md:py-6 md:px-4 rounded-xl md:rounded-[20px] mb-3 md:mb-4 border ${isDark ? "bg-gradient-to-b from-orange-950/40 to-orange-900/20 border-orange-900/50" : "bg-gradient-to-b from-[#fff7ed] to-[#fffaf5] border-orange-200"}`}
                  >
                    <span className="text-[8px] md:text-[10px] text-slate-500 font-bold tracking-[0.15em] uppercase mb-1">
                      Round Stakes
                    </span>

                    <div
                      className={`text-3xl md:text-6xl font-black tracking-tighter flex items-baseline gap-1 ${dmg >= 4 ? "text-orange-500" : "text-orange-400"}`}
                    >
                      {dmg}
                      <span className="text-xs md:text-base font-bold tracking-widest opacity-60 ml-1">
                        HP
                      </span>
                    </div>

                    <div
                      className={`text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-full border tracking-[0.15em] uppercase mt-1 md:mt-2 ${dmg >= 4 ? "text-orange-600 bg-orange-100 border-orange-200" : "text-orange-500 bg-orange-100/50 border-orange-200"}`}
                    >
                      {dmg >= 4 ? "High Stakes" : "Normal"}
                    </div>
                  </div>

                  {/* Message / Logs */}
                  <div
                    className={`w-full text-[10px] md:text-sm font-medium p-2 md:p-3 rounded-lg border ${isDark ? "bg-indigo-950/30 border-indigo-900/50 text-indigo-300" : "bg-blue-50/80 border-blue-100 text-blue-600"}`}
                  >
                    {gs.message}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="w-full flex justify-center gap-2 mt-2 md:mt-4">
                  {gs.phase === "AwaitingAction" &&
                    gs.activePlayer === "Red" && (
                      <>
                        <ActionButton
                          label="HIT"
                          onClick={playerHit}
                          baseColor="bg-[#0055c4]"
                          topColor="bg-[#0070f3]"
                        />
                        <ActionButton
                          label="STAY"
                          onClick={playerStay}
                          baseColor="bg-[#cc0032]"
                          topColor="bg-[#ff003e]"
                        />
                      </>
                    )}

                  {isGameOver && (
                    <ActionButton
                      label="NEW GAME"
                      onClick={resetGame}
                      baseColor="bg-emerald-700"
                      topColor="bg-emerald-500"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Agent (Blue) */}
            <div className="order-3 lg:order-3 flex-1 lg:flex-none lg:w-[30%] flex justify-start">
              <AgentSide
                agentName="AI"
                side="blue"
                hp={gs.p2.hp}
                cards={gs.p2.cards} // Restored native card objects
                score={gs.p2.score}
                align="right"
                status={getAgentStatus("blue")}
                atRisk={isGameOver ? 0 : dmg}
                showRiverPlaceholder={
                  isPlaceholderPhase && gs.p2.cards.length > 0
                }
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
