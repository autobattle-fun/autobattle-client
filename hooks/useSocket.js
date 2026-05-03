"use client";

import { API_BASE_URL } from "@/lib/config";
import { useState } from "react";
import { io } from "socket.io-client";
import { useGameStore } from "@/store/gameStore";
import { useMarketStore } from "@/store/marketStore";

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const setGameState = useGameStore((state) => state.setGameState);
  const setLatency = useGameStore((state) => state.setLatency);
  const setCountdown = useGameStore((state) => state.setCountdown);
  const setServerTimestamp = useGameStore((state) => state.setServerTimestamp);
  const setIsLoading = useGameStore((state) => state.setIsLoading);
  const setIsSocketWorking = useGameStore((state) => state.setIsSocketWorking);
  const updateGameState = useGameStore((state) => state.updateGameState);
  const setMarket = useMarketStore((state) => state.setMarket);
  const setLogs = useGameStore((state) => state.setLogs);
  const addLog = useGameStore((state) => state.addLog);

  const initializeWebSocket = () => {
    if (socket) {
      socket.disconnect();

      setSocket(null);
    }

    const websocket = io(API_BASE_URL + "/", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
    });

    setSocket(websocket);

    websocket.on("connect", () => {
      console.log("WebSocket connected");
    });

    websocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    websocket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    websocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    websocket.on(
      "pong",
      ({ latency, gameState, countdown, market, logs, serverTimestamp }) => {
        console.log("Received pong");

        console.log(latency, gameState, market, countdown, serverTimestamp);

        setIsLoading(false);
        setLatency(latency);
        setGameState(gameState);
        setCountdown(countdown);
        setLogs(logs);
        setServerTimestamp(serverTimestamp);
        setMarket(market);
      },
    );

    websocket.on("match:created", (envelope) => {
      console.log("Match created", envelope);
      setGameState(envelope.data.game);
      setMarket(envelope.data.market);
    });

    websocket.on("round:started", (envelope) => {
      console.log("Round started", envelope);
      updateGameState(envelope.data);
    });

    websocket.on("cards:dealt", (envelope) => {
      console.log("Cards dealt", envelope);
      updateGameState(envelope.data.game);
      setMarket(envelope.data.market);
    });

    websocket.on("agent:decision", (envelope) => {
      console.log("Agent decision", envelope);
      updateGameState(envelope.data);
    });

    websocket.on("river:flowing", (envelope) => {
      console.log("River flowing", envelope);
      updateGameState(envelope.data);
    });

    websocket.on("round:resolved", (envelope) => {
      console.log("Round resolved", envelope);
      updateGameState(envelope.data);
    });

    websocket.on("tiebreaker:started", (envelope) => {
      console.log("Tiebreaker started", envelope);
      updateGameState(envelope.data);
    });

    websocket.on("tiebreaker:resolved", (envelope) => {
      console.log("Tiebreaker resolved", envelope);
      updateGameState(envelope.data);
    });

    websocket.on("match:ended", (envelope) => {
      console.log("Match ended", envelope);
      updateGameState(envelope.data);
    });

    websocket.on("game:paused", (envelope) => {
      console.log("Game paused", envelope);
      updateGameState(envelope.data);
    });

    websocket.on("game:resumed", (envelope) => {
      console.log("Game resumed", envelope);
      websocket.emit("ping", { timestamp: Date.now() });
    });

    websocket.on("market:prices", (envelope) => {
      console.log("Market prices", envelope);
      setMarket(envelope.data);
    });

    websocket.on("log:broadcast", (envelope) => {
      console.log("Log broadcast", envelope);
      addLog(envelope.data);
    });

    return websocket;
  };

  const disconnectWebSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const handleNetworkIssue = () => {
    const currentGameState = useGameStore.getState().gameState;

    if (!currentGameState) {
      setIsLoading(false);
      setIsSocketWorking(false);

      setTimeout(() => {
        initializeWebSocket();
      }, 5000);
    }
  };

  const sendPing = async () => {
    console.log("Sending ping");

    socket.emit("ping", { timestamp: Date.now() });

    await new Promise((resolve) => setTimeout(resolve, 5000));
    handleNetworkIssue();
  };

  return { initializeWebSocket, socket, disconnectWebSocket, sendPing };
}
