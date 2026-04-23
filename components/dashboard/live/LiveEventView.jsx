"use client";

import { useCallback, useState } from "react";

import { BetsSection } from "./sections/BetsSection";
import { CommentsSection } from "./sections/CommentsSection";
import { MainGameSection } from "./sections/MainGameSection";
import { OracleLogSection } from "./sections/OracleLogSection";

export function LiveEventView() {
  const [gameState, setGameState] = useState(null);

  const handleGameEvent = useCallback((state) => {
    setGameState(state);
  }, []);

  return (
    <div
      className="dark w-full overflow-hidden rounded-2xl bg-[#050916] p-2"
      style={{ height: "calc(100vh - 8.25rem)" }}
    >
      <div className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="h-full min-h-0 overflow-y-auto pr-1">
          <div className="space-y-4 pb-3">
            <MainGameSection onGameEvent={handleGameEvent} />
            <CommentsSection />
          </div>
        </section>

        <aside className="h-full min-h-0 overflow-y-auto pr-1">
          <div className="space-y-4 pb-3">
            <BetsSection gameState={gameState} />
            <OracleLogSection logs={gameState?.log || []} />
          </div>
        </aside>
      </div>
    </div>
  );
}
