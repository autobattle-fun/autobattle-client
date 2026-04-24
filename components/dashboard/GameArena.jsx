"use client";

import { useEffect, useMemo, useReducer, useState } from "react";

import {
  getDamage,
  gameReducer,
  makeInitialGameState,
} from "@/components/dashboard/gameLogic";
import { GameHud } from "@/components/dashboard/live/game/GameHud";
import { BattleCenter } from "@/components/dashboard/live/game/BattleCenter";
import { AgentSidePanel } from "@/components/dashboard/live/game/AgentSidePanel";

function pickActionForPlayer(playerState, player) {
  const threshold = player === "red" ? 16 : 17;
  const shouldPress = playerState.score < threshold;

  if (!shouldPress) {
    return "STAY";
  }

  const randomOffset = Math.random();
  return randomOffset > 0.25 ? "HIT" : "STAY";
}

function fallbackAgentAction(game) {
  const { phase, red, blue, winner } = game;

  switch (phase) {
    case "AwaitingInitialDeal":
      return { type: "DEAL" };

    case "AwaitingAction_Red": {
      const action = pickActionForPlayer(red, "red");
      return { type: action, player: "red" };
    }

    case "AwaitingAction_Blue": {
      const action = pickActionForPlayer(blue, "blue");
      return { type: action, player: "blue" };
    }

    case "AwaitingFinalRevealVRF":
      return { type: "RIVER" };

    case "ReadyToResolve":
      return { type: "RESOLVE" };

    case "AwaitingTiebreakerVRF":
      return { type: "TIEBREAKER" };

    case "Ended":
      return winner ? { type: "RESET" } : null;

    default:
      return null;
  }
}

export function GameArena({ onGameEvent, getAgentAction }) {
  const [game, dispatch] = useReducer(
    gameReducer,
    undefined,
    makeInitialGameState,
  );

  const [isStepping, setIsStepping] = useState(false);
  const { phase, red, blue, round, river, tb, lastDmg, winner, active } = game;

  const damage = useMemo(() => getDamage(round), [round]);

  useEffect(() => {
    if (onGameEvent) {
      onGameEvent(game);
    }
  }, [game, onGameEvent]);

  async function handleAgentStep() {
    if (isStepping) return;

    setIsStepping(true);
    try {
      const nextAction = getAgentAction
        ? await Promise.resolve(getAgentAction(game))
        : fallbackAgentAction(game);

      if (nextAction?.type) {
        dispatch(nextAction);
      }
    } finally {
      setIsStepping(false);
    }
  }

  return (
    <div className="relative h-full overflow-hidden rounded-2xl px-5 pb-6">
      <style>{`
        @keyframes arenaFlame {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.85; }
          50% { transform: translateY(-2px) scale(1.12); opacity: 1; }
        }
      `}</style>

      <div className="relative z-10 flex h-full flex-col gap-3">
        <GameHud
          redHp={red.hp}
          blueHp={blue.hp}
          round={round}
          damage={damage}
        />

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[1fr_220px_1fr]">
          <AgentSidePanel
            side="red"
            player={red}
            riverCard={river.red}
            tiebreakCards={tb.red}
            isActive={active === "red"}
          />

          <BattleCenter
            phase={phase}
            redScore={red.score}
            blueScore={blue.score}
            lastDamage={lastDmg}
          />

          <AgentSidePanel
            side="blue"
            player={blue}
            riverCard={river.blue}
            tiebreakCards={tb.blue}
            isActive={active === "blue"}
          />
        </div>

        {phase === "Ended" && winner ? (
          <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-center text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200 mx-8">
            {winner === "red" ? "Red Agent" : "Blue Agent"} won this match.
          </div>
        ) : null}
      </div>

      <button
        type="button"
        disabled={isStepping}
        onClick={handleAgentStep}
        className="absolute bottom-4 right-4 z-20 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition hover:border-cyan-300/70 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isStepping ? "Stepping..." : "Agent Step"}
      </button>
    </div>
  );
}
