"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  makeBetState,
  generateMarkets,
  resolveActiveBets,
} from "@/components/dashboard/bettingLogic";

import { SubBetSection } from "../bets/SubBetSection";
import { MainBetSection } from "../bets/MainBetSection";

import { SectionCard } from "./SectionCard";

export function BetsSection({ gameState }) {
  const [bets, setBets] = useState(makeBetState);

  useEffect(() => {
    if (!gameState) return;

    setBets((prev) => {
      if (prev.active.length === 0) return prev;

      const { resolved, remaining, balanceDelta } = resolveActiveBets(
        prev.active,
        gameState,
      );
      if (resolved.length === 0) return prev;

      return {
        balance: prev.balance + balanceDelta,
        active: remaining,
        history: [...prev.history, ...resolved],
      };
    });
  }, [gameState]);

  const handlePlace = useCallback(
    (market, amount) => {
      setBets((prev) => {
        if (amount < 1 || amount > prev.balance) return prev;

        return {
          ...prev,
          balance: prev.balance - amount,
          active: [
            ...prev.active,
            {
              id: `${market.id}_${Date.now()}`,
              betId: market.id,
              label: market.label,
              amount,
              odds: market.odds,
              type: market.type,
              side: market.side,
              target: market.target,
              round: market.round || gameState?.round || 1,
              min: market.min,
              max: market.max,
            },
          ],
        };
      });
    },
    [gameState?.round],
  );

  const markets = useMemo(() => {
    if (!gameState) return [];
    return generateMarkets(gameState);
  }, [gameState]);

  const mainMarkets = useMemo(
    () => markets.filter((market) => market.type === "match_winner"),
    [markets],
  );

  const subMarkets = useMemo(
    () => markets.filter((market) => market.type === "round_winner"),
    [markets],
  );

  return (
    <SectionCard
      title="Markets"
      className="border-white/10 bg-slate-950/70"
      subtitle="Main winner first, then round winner markets"
    >
      <div className="space-y-4">
        <MainBetSection
          markets={mainMarkets}
          activeBets={bets.active}
          onPlace={handlePlace}
          maxStake={bets.balance}
        />

        <SubBetSection
          markets={subMarkets}
          activeBets={bets.active}
          onPlace={handlePlace}
          maxStake={bets.balance}
        />
      </div>
    </SectionCard>
  );
}
