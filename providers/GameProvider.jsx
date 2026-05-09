"use client";
import useSocket from "@/hooks/useSocket";
import { useEffect, useRef } from "react";
import { useSocketStore } from "@/store/socketStore"; // Import your store

export default function GameProvider({ children }) {
  const { initializeWebSocket } = useSocket();
  const setSocket = useSocketStore((state) => state.setSocket);

  useEffect(() => {
    // 1. Initialize and capture the exact socket instance for this render
    const activeSocket = initializeWebSocket();

    // 2. The Cleanup Function
    return () => {
      console.log("Disconnecting WebSocket (React Cleanup)");
      if (activeSocket) {
        // Disconnect THIS specific instance, preventing Strict Mode race conditions
        activeSocket.disconnect();
      }
      // Clear the store so the app knows we are disconnected
      setSocket(null);
    };
  }, []);

  return <>{children}</>;
}
