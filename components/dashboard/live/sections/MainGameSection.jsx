import { GameArena } from "@/components/dashboard/GameArena";

import { SectionCard } from "./SectionCard";

export function MainGameSection({ onGameEvent }) {
  return (
    <SectionCard title="Main Game">
      <div className="h-180 overflow-hidden rounded-xl border border-border/50 bg-element/45">
        <GameArena onGameEvent={onGameEvent} />
      </div>
    </SectionCard>
  );
}
