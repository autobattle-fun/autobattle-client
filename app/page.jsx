"use client";

import { useGameStore } from "@/store/gameStore";
import GameUI from "@/components/dashboard/GameUI";
import MatchMaking from "@/components/dashboard/MatchMaking";
import GameProvider from "@/providers/GameProvider";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import PauseScreen from "@/components/dashboard/PauseScreen";
import NotFoundScreen from "@/components/dashboard/NotFoundScreen";

function GameContent() {
  const gameState = useGameStore((state) => state.gameState);
  const isLoading = useGameStore((state) => state.isLoading);
  const countdown = useGameStore((state) => state.countdown);

  if (!isLoading && gameState?.serverStatus === "PAUSED") {
    return <PauseScreen />;
  }

  if (!isLoading && !gameState && !countdown?.isBreak) {
    return <NotFoundScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return gameState?.gameStatus === "ACTIVE" ||
    gameState?.gameStatus === "RESOLVED" ? (
    <GameUI />
  ) : (
    <MatchMaking />
  );
}

export default function LivePage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
