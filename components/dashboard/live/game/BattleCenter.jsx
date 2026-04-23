"use client";

import { Zap } from "lucide-react";

import { PHASE_META, absDiff21 } from "@/components/dashboard/gameLogic";

const toneMap = {
  red: "#f43f5e",
  blue: "#38bdf8",
  purple: "#a78bfa",
  amber: "#f59e0b",
  danger: "#ef4444",
  neutral: "#cbd5e1",
};

function compareResult(redScore, blueScore) {
  const redDiff = absDiff21(redScore);
  const blueDiff = absDiff21(blueScore);

  if (redDiff === blueDiff) {
    return { label: "Tied", color: "#f8fafc" };
  }

  if (redDiff < blueDiff) {
    return { label: "Red Leading", color: "#f43f5e" };
  }

  return { label: "Blue Leading", color: "#38bdf8" };
}

export function BattleCenter({ phase, redScore, blueScore, lastDamage }) {
  const phaseMeta = PHASE_META[phase];
  const phaseColor = toneMap[phaseMeta.color] || toneMap.neutral;

  const result = compareResult(redScore, blueScore);

  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-linear-to-b from-black/35 via-black/25 to-black/40 p-4">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
          Round State
        </p>

        <div
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{
            color: phaseColor,
            borderColor: `${phaseColor}55`,
            background: `${phaseColor}14`,
          }}
        >
          <Zap className="h-3.5 w-3.5" />
          {phaseMeta.short}
        </div>
      </div>

      <div className="space-y-3 text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">
          Damage Delta
        </p>

        <p className="text-5xl font-black tabular-nums text-amber-300">
          -{lastDamage || 0}
        </p>

        <p className="text-[11px] text-white/60">Applied to the round loser</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">
          Current Edge
        </p>

        <p
          style={{ color: result.color }}
          className="mt-1 text-base font-semibold"
        >
          {result.label}
        </p>

        <p className="mt-1 text-[11px] text-white/60 tabular-nums">
          {redScore} : {blueScore}
        </p>
      </div>
    </section>
  );
}
