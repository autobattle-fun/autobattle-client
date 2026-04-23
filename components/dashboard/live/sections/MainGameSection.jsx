import { GameArena } from "@/components/dashboard/GameArena";

import { SectionCard } from "./SectionCard";

export function MainGameSection({ onGameEvent, getAgentAction }) {
  return (
    <SectionCard
      title="Arena"
      subtitle="Autonomous on-chain duel simulation"
      className="border-white/10 bg-linear-to-b from-slate-950/90 to-slate-900/75"
    >
      <div className="h-155 overflow-hidden rounded-2xl border border-white/10 bg-[#060a12]">
        <GameArena onGameEvent={onGameEvent} getAgentAction={getAgentAction} />
      </div>
    </SectionCard>
  );
}
