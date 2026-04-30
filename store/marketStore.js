import { create } from "zustand";

export const useMarketStore = create((set) => ({
  market: null,
  setMarket: (v) => set({ market: v }),
  updateMarket: (newState) =>
    set((state) => ({
      market: {
        ...state.market,
        ...newState,
      },
    })),
  reset: () => set({ market: null }),
}));
