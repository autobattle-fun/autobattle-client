// import BlackjackGame from "@/components/dashboard/BlackjackGame";

// export default function LivePage() {
//   return (
//     <div className="flex h-full gap-4 max-w-360 mx-auto w-full">
//       <div className="flex-1 bg-element rounded-3xl flex flex-col items-center justify-center border border-border/50 overflow-hidden relative">
//         <BlackjackGame />
//       </div>

//       <div className="w-72 bg-element rounded-3xl p-5 shrink-0 flex flex-col border border-border/50">
//         <h2 className="font-semibold text-sm mb-3">Actions</h2>
//         <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-xs gap-4">
//           <p>Connect wallet to interact</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useCallback } from "react";
import { GameArena } from "@/components/dashboard/GameArena";
import { PredictionPanel } from "@/components/dashboard/PredictionPanel";

export default function LivePage() {
  const [gameState, setGameState] = useState(null);

  const handleGameEvent = useCallback((state) => {
    setGameState(state);
  }, []);

  return (
    <div className="h-full w-full">
      <div
        className="bg-element rounded-3xl border border-border/50 overflow-hidden h-full"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          style={{
            flex: "0 0 72%",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GameArena onGameEvent={handleGameEvent} />
        </div>

        <div
          style={{
            flex: "0 0 28%",
            minWidth: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PredictionPanel gameState={gameState} />
        </div>
      </div>
    </div>
  );
}
