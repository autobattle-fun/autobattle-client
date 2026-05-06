import { create } from "zustand";

export const useSocketStore = create((set) => ({
  socket: null,
  setSocket: (v) => set({ socket: v }),
}));
