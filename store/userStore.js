import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  metadata: null,
  isLoadingUser: true,
  isLoadingMetadata: false,
  setIsLoadingUser: (v) => set({ isLoadingUser: v }),
  setIsLoadingMetadata: (v) => set({ isLoadingMetadata: v }),
  setMetadata: (v) => set({ metadata: v }),
  setUser: (v) => set({ user: v }),
  updateUser: (newState) =>
    set((state) => ({
      user: {
        ...state.user,
        ...newState,
      },
    })),
  reset: () => set({ user: null, metadata: null, isLoadingUser: false }),
}));
