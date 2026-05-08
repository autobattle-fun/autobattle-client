"use client";

import { useGameStore } from "@/store/gameStore";
import GameUI from "@/components/dashboard/GameUI";
import MatchMaking from "@/components/dashboard/MatchMaking";
import GameProvider from "@/providers/GameProvider";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import PauseScreen from "@/components/dashboard/PauseScreen";
import NotFoundScreen from "@/components/dashboard/NotFoundScreen";

export default function LivePage() {
  const gameState = useGameStore((state) => state.gameState);
  const isLoading = useGameStore((state) => state.isLoading);
  const countdown = useGameStore((state) => state.countdown);

  if (!isLoading && gameState?.serverStatus === "PAUSED") {
    return <PauseScreen />;
  }

  if (!isLoading && !gameState && !countdown?.isBreak) {
    return <NotFoundScreen />;
  }

  return (
    <GameProvider>
      {isLoading ? (
        <LoadingScreen />
      ) : gameState && !countdown?.isBreak ? (
        <GameUI />
      ) : (
        <MatchMaking />
      )}
    </GameProvider>
  );
}
