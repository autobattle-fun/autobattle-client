"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "motion/react";

export default function BannerNotification() {
  const logs = useGameStore((state) => state.logs) || [];
  const gameState = useGameStore((state) => state.gameState);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [queue, setQueue] = useState([]);
  const prevLogsLength = useRef(logs.length);

  // Detect new logs
  useEffect(() => {
    if (logs.length > prevLogsLength.current) {
      const newLogs = logs.slice(prevLogsLength.current);
      const messages = newLogs
        .map((l) => {
          let role = l.role;
          let msg = l.log || l.message;

          if (l.role === "blue" || l.role === "red") {
            if (msg !== "Thinking...") {
              return null;
            }
          }

          if (!msg) return null;

          if (gameState?.red?.name) {
            msg = msg.replace(/AGENT RED/gi, gameState.red.name);
          }
          if (gameState?.blue?.name) {
            msg = msg.replace(/AGENT BLUE/gi, gameState.blue.name);
          }
          return msg;
        })
        .filter(Boolean);

      setQueue((prev) => [...prev, ...messages]);
      prevLogsLength.current = logs.length;
    } else if (logs.length < prevLogsLength.current) {
      // Reset if logs were cleared
      prevLogsLength.current = logs.length;
    }
  }, [logs, gameState]);

  // Process queue
  useEffect(() => {
    if (queue.length > 0) {
      if (currentMessage) {
        // Clear current message to trigger exit animation immediately
        setCurrentMessage(null);
      } else {
        // When no message is showing, show the next one from queue
        setCurrentMessage(queue[0]);
        setQueue((prev) => prev.slice(1));
      }
    }
  }, [queue, currentMessage]);

  // Dismiss message after delay if no new messages interrupt it
  useEffect(() => {
    if (currentMessage) {
      const timer = setTimeout(() => {
        setCurrentMessage(null);
      }, 6000); // 1s slide in + 4s wait + 1s slide out
      return () => clearTimeout(timer);
    }
  }, [currentMessage]);

  const isVisible = !!currentMessage || queue.length > 0;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isVisible ? 0 : "100%" }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
        delay: isVisible ? 0 : 0.8,
      }}
      className="fixed bottom-[72px] md:bottom-0 left-0 md:left-20 w-full md:w-[calc(100%-5rem)] h-10 md:h-12 bg-background/95 border-t border-foreground/20 backdrop-blur-md z-[30] flex items-center justify-center overflow-hidden pointer-events-none transition-colors duration-500"
    >
      <AnimatePresence mode="wait">
        {currentMessage && (
          <motion.div
            key={currentMessage}
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "100vw" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full text-center text-amber-600 dark:text-amber-500 font-bold tracking-[0.2em] text-[10px] md:text-sm uppercase whitespace-nowrap drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] px-4"
          >
            {currentMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
