import { create } from "zustand";

import {
  makeBetState,
  resolveActiveBets,
} from "@/components/dashboard/bettingLogic";

const INITIAL_COMMENTS = [
  {
    id: "c1",
    user: "oracle_watch",
    text: "Red has momentum this round.",
    ago: "2m",
  },
  {
    id: "c2",
    user: "market_maker",
    text: "Tie odds look overpriced right now.",
    ago: "1m",
  },
];

export const useLiveStore = create((set) => ({
  gameState: null,
  bets: makeBetState(),
  comments: INITIAL_COMMENTS,

  setGameState: (nextGameState) => {
    set((state) => {
      if (state.gameState === nextGameState) {
        return state;
      }

      let nextBets = state.bets;

      if (nextGameState && state.bets.active.length > 0) {
        const { resolved, remaining, balanceDelta } = resolveActiveBets(
          state.bets.active,
          nextGameState,
        );

        if (resolved.length > 0) {
          nextBets = {
            balance: state.bets.balance + balanceDelta,
            active: remaining,
            history: [...state.bets.history, ...resolved],
          };
        }
      }

      return {
        gameState: nextGameState,
        bets: nextBets,
      };
    });
  },

  placeBet: (market, amount) => {
    set((state) => {
      if (amount < 1 || amount > state.bets.balance || !market) {
        return state;
      }

      return {
        bets: {
          ...state.bets,
          balance: state.bets.balance - amount,
          active: [
            ...state.bets.active,
            {
              id: `${market.id}_${Date.now()}`,
              betId: market.id,
              label: market.label,
              amount,
              odds: market.odds,
              type: market.type,
              side: market.side,
              target: market.target,
              round: market.round || state.gameState?.round || 1,
              min: market.min,
              max: market.max,
            },
          ],
        },
      };
    });
  },

  addComment: (text, user = "you") => {
    const cleanedText = text.trim();

    if (!cleanedText) return;

    set((state) => ({
      comments: [
        ...state.comments,
        {
          id: `${Date.now()}`,
          user,
          text: cleanedText,
          ago: "now",
        },
      ],
    }));
  },

  resetLiveState: () => {
    set({
      gameState: null,
      bets: makeBetState(),
      comments: INITIAL_COMMENTS,
    });
  },
}));
