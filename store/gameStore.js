import { create } from "zustand";

export const useGameStore = create((set) => ({
  isLoading: true,
  latency: null,
  gameState: null,
  countdown: null,
  serverTimestamp: null,
  isSocketWorking: true,

  // 🔹 SETTERS
  setIsLoading: (v) => set({ isLoading: v }),
  setLatency: (v) => set({ latency: v }),
  setGameState: (v) => set({ gameState: v }),
  setCountdown: (v) => set({ countdown: v }),
  setServerTimestamp: (v) => set({ serverTimestamp: v }),
  setIsSocketWorking: (v) => set({ isSocketWorking: v }),

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
    }),
}));
