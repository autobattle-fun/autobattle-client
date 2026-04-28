"use client";
import useSocket from "@/hooks/useSocket";
import { useEffect } from "react";

export default function GameProvider({ children }) {
  const { initializeWebSocket, disconnectWebSocket, socket, sendPing } =
    useSocket();

  useEffect(() => {
    initializeWebSocket();
    return () => disconnectWebSocket();
  }, []);

  useEffect(() => {
    if (socket) sendPing();
  }, [socket]);

  return <>{children}</>;
}
