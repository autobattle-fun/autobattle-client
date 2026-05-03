import { create } from "zustand";

export const useGameStore = create((set) => ({
  isLoading: true,
  latency: null,
  gameState: null,
  countdown: null,
  playerHit: null,
  logs: [],
  serverTimestamp: null,
  isSocketWorking: true,

  // 🔹 SETTERS
  setIsLoading: (v) => set({ isLoading: v }),
  setLatency: (v) => set({ latency: v }),
  setGameState: (v) => set({ gameState: v }),
  setCountdown: (v) => set({ countdown: v }),
  setPlayerHit: (v) => set({ playerHit: v }),
  setLogs: (v) => set({ logs: v }),
  setServerTimestamp: (v) => set({ serverTimestamp: v }),
  setIsSocketWorking: (v) => set({ isSocketWorking: v }),

  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
    })),

  // 🔹 ACTIONS
  updateGameState: (newState) =>
    set((state) => ({
      gameState: {
        ...state.gameState,
        ...newState,
      },
    })),

  reset: () =>
    set({
      isLoading: true,
      latency: null,
      gameState: null,
      countdown: null,
      serverTimestamp: null,
      isSocketWorking: true,
      logs: [],
    }),
}));
