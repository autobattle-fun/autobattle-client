import { create } from "zustand";

export const useMarketStore = create((set) => ({
  market: null,
  mainShares: null,
  roundShares: null,
  isLoadingMainShares: false,
  isLoadingRoundShares: false,
  setMarket: (v) => set({ market: v }),
  updateMarket: (newState) =>
    set((state) => ({
      market: {
        ...state.market,
        ...newState,
      },
    })),
  reset: () => set({ market: null }),
  setIsLoadingMainShares: (v) => set({ isLoadingMainShares: v }),
  setIsLoadingRoundShares: (v) => set({ isLoadingRoundShares: v }),
  setMainShares: (shares) => set({ mainShares: shares }),
  setRoundShares: (shares) => set({ roundShares: shares }),
}));
