"use client";

import { useCallback, useState } from "react";

import { BetsSection } from "./sections/BetsSection";
import { CommentsSection } from "./sections/CommentsSection";
import { MainGameSection } from "./sections/MainGameSection";
import { OracleLogSection } from "./sections/OracleLogSection";
import { RulesSection } from "./sections/RulesSection";

export function LiveEventView() {
  const [gameState, setGameState] = useState(null);

  const handleGameEvent = useCallback((state) => {
    setGameState(state);
  }, []);

  return (
    <div
      className="w-full overflow-hidden"
      style={{ height: "calc(100vh - 8.25rem)" }}
    >
      <div className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="h-full min-h-0 overflow-y-auto pr-1">
          <div className="space-y-4 pb-2">
            <MainGameSection onGameEvent={handleGameEvent} />
            <RulesSection />
            <CommentsSection />
          </div>
        </section>

        <aside className="h-full min-h-0 overflow-y-auto pr-1">
          <div className="space-y-4 pb-2">
            <BetsSection gameState={gameState} />
            <OracleLogSection logs={gameState?.log || []} />
          </div>
        </aside>
      </div>
    </div>
  );
}
