"use client";

import { API_BASE_URL } from "@/lib/config";
import { useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useGameStore } from "@/store/gameStore";

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const setGameState = useGameStore((state) => state.setGameState);
  const setLatency = useGameStore((state) => state.setLatency);
  const setCountdown = useGameStore((state) => state.setCountdown);
  const setServerTimestamp = useGameStore((state) => state.setServerTimestamp);
  const setIsLoading = useGameStore((state) => state.setIsLoading);
  const setIsSocketWorking = useGameStore((state) => state.setIsSocketWorking);

  const initializeWebSocket = useCallback(() => {
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
      ({ latency, gameState, countdown, serverTimestamp }) => {
        console.log("Received pong");

        setIsLoading(false);
        setLatency(latency);
        setGameState(gameState);
        setCountdown(countdown);
        setServerTimestamp(serverTimestamp);
      },
    );

    return websocket;
  }, [
    socket,
    setIsLoading,
    setLatency,
    setGameState,
    setCountdown,
    setServerTimestamp,
  ]);

  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  const handleNetworkIssue = useCallback(() => {
    const currentGameState = useGameStore.getState().gameState;

    if (!currentGameState) {
      setIsLoading(false);
      setIsSocketWorking(false);

      setTimeout(() => {
        initializeWebSocket();
      }, 5000);
    }
  }, [setIsLoading, setIsSocketWorking, initializeWebSocket]);

  const sendPing = useCallback(async () => {
    console.log("Sending ping");

    socket.emit("ping", { timestamp: Date.now() });

    await new Promise((resolve) => setTimeout(resolve, 5000));
    handleNetworkIssue();
  }, [socket, handleNetworkIssue]);

  return { initializeWebSocket, socket, disconnectWebSocket, sendPing };
}
