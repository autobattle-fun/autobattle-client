"use client";

import { useCallback, useState } from "react";

import { BetsSection } from "./sections/BetsSection";
import { CommentsSection } from "./sections/CommentsSection";
import { MainGameSection } from "./sections/MainGameSection";
import { OracleLogSection } from "./sections/OracleLogSection";

const LiveEventView = () => {
  const [gameState, setGameState] = useState(null);

  const handleGameEvent = useCallback((state) => {
    setGameState(state);
  }, []);

  return (
    <div className="w-full overflow-hidden grid h-full min-h-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] pb-4">
      <section className="h-full min-h-0 overflow-y-auto pb-3">
        <MainGameSection onGameEvent={handleGameEvent} />
        <CommentsSection />
      </section>

      <aside className="h-full min-h-0 overflow-y-auto space-y-4 pb-3 pr-5">
        <BetsSection gameState={gameState} />
        <OracleLogSection logs={gameState?.log || []} />
      </aside>
    </div>
  );
};

export default LiveEventView;
