"use client";

import { API_BASE_URL } from "@/lib/config";
import { io } from "socket.io-client";
import { useGameStore } from "@/store/gameStore";
import { useMarketStore } from "@/store/marketStore";
import { useSocketStore } from "@/store/socketStore";
import { useCallback } from "react";

export default function useSocket() {
  const disconnectWebSocket = useCallback(() => {
    console.log("Disconnecting WebSocket");
    const currentSocket = useSocketStore.getState().socket;
    if (currentSocket) {
      currentSocket.disconnect();
      useSocketStore.getState().setSocket(null);
    }
  }, []);

  const sendPing = useCallback(() => {
    const currentSocket = useSocketStore.getState().socket;
    if (currentSocket && currentSocket.connected) {
      console.log("Sending game:ping");
      currentSocket.emit("game:ping", { timestamp: Date.now() });
    }
  }, []);

  const initializeWebSocket = useCallback(() => {
    const websocket = io(API_BASE_URL + "/", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
    });

    useSocketStore.getState().setSocket(websocket);

    websocket.on("connect", () => {
      console.log("WebSocket connected");
      useGameStore.getState().setIsSocketWorking(true);
      sendPing();
    });

    websocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      useGameStore.getState().setIsSocketWorking(false);
    });

    websocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      useGameStore.getState().setIsSocketWorking(false);
    });

    websocket.on(
      "game:pong",
      ({ latency, gameState, countdown, market, logs, serverTimestamp }) => {
        const gameStore = useGameStore.getState();
        gameStore.setIsLoading(false);
        gameStore.setLatency(latency);
        gameStore.setGameState(gameState);
        gameStore.setCountdown(countdown);
        gameStore.setLogs(logs);
        gameStore.setServerTimestamp(serverTimestamp);

        if (market) useMarketStore.getState().setMarket(market);
      },
    );

    websocket.on("match:created", (envelope) => {
      console.log("Match created", envelope);
      useGameStore.getState().setGameState(envelope.data?.gameState);
      if (envelope.data?.market) {
        useMarketStore.getState().setMarket(envelope.data.market);
      }
    });

    websocket.on("break:preparing", (envelope) => {
      console.log("Break preparing", envelope);
      useGameStore.getState().setCountdown(envelope.data?.nextMatchAt);
    });

    websocket.on("round:started", (envelope) => {
      console.log("Round started", envelope);
      useGameStore.getState().updateGameState(envelope.data?.gameState);
    });

    websocket.on("cards:dealt", (envelope) => {
      console.log("Cards dealt", envelope);
      useGameStore.getState().updateGameState(envelope.data?.gameState);
      if (envelope.data?.market) {
        useMarketStore.getState().setMarket(envelope.data.market);
      }
    });

    websocket.on("agent:decision", (envelope) => {
      console.log("Agent decision", envelope);
      useGameStore.getState().updateGameState(envelope.data?.gameState);
    });

    websocket.on("river:flowing", (envelope) => {
      console.log("River flowing", envelope);
      useGameStore.getState().updateGameState(envelope.data?.gameState);
    });

    websocket.on("round:resolved", (envelope) => {
      console.log("Round resolved", envelope);
      useGameStore.getState().updateGameState(envelope.data?.gameState);
    });

    websocket.on("tiebreaker:started", (envelope) => {
      console.log("Tiebreaker started", envelope);
      useGameStore.getState().updateGameState(envelope.data?.gameState);
    });

    websocket.on("tiebreaker:resolved", (envelope) => {
      console.log("Tiebreaker resolved", envelope);
      useGameStore.getState().updateGameState(envelope.data?.gameState);
    });

    websocket.on("match:ended", (envelope) => {
      console.log("Match ended", envelope);
      useGameStore.getState().updateGameState(envelope.data?.gameState);
      disconnectWebSocket();
    });

    websocket.on("game:paused", (envelope) => {
      console.log("Game paused", envelope);
      useGameStore.getState().updateGameState(envelope.data?.gameState);
    });

    websocket.on("game:resumed", (envelope) => {
      console.log("Game resumed", envelope);
      const { gameState, market, logs, countdown, serverTimestamp } =
        envelope.data || {};
      const gameStore = useGameStore.getState();

      if (gameState) gameStore.setGameState(gameState);
      if (logs) gameStore.setLogs(logs);
      if (countdown !== undefined) gameStore.setCountdown(countdown);
      if (serverTimestamp) gameStore.setServerTimestamp(serverTimestamp);
      if (market) useMarketStore.getState().setMarket(market);
    });

    websocket.on("market:prices", (envelope) => {
      useMarketStore.getState().setMarket(envelope.data);
    });

    websocket.on("log:broadcast", (envelope) => {
      if (envelope.data) {
        useGameStore.getState().addLog(envelope.data);
        useGameStore.getState().updateGameState(envelope.data.gameState);
      }
    });

    return websocket;
  }, []); // <--- Clean empty dependency array

  return { initializeWebSocket, disconnectWebSocket, sendPing };
}
