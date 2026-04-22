"use client";

import { useMemo, useState } from "react";

import { oddsToCents } from "./BetPricing";

const QUICK_AMOUNTS = [1, 5, 10, 25, 100];

function sideAccent(side) {
  if (side === "red") return "#36b96c";
  if (side === "blue") return "#1e8de4";
  return "#6b7280";
}

function marketLabel(market) {
  if (!market) return "Option";
  if (market.side === "red") return "Red";
  if (market.side === "blue") return "Blue";
  return market.label;
}

export function MainBetTradeCard({ markets, activeBets, onPlace, maxStake }) {
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState(0);

  const redMarket = useMemo(
    () => markets.find((market) => market.side === "red") || markets[0],
    [markets],
  );
  const blueMarket = useMemo(
    () => markets.find((market) => market.side === "blue") || markets[1],
    [markets],
  );

  const [selectedMarketId, setSelectedMarketId] = useState(
    () => redMarket?.id || blueMarket?.id || null,
  );

  const selectedMarket = useMemo(
    () =>
      markets.find((market) => market.id === selectedMarketId) ||
      redMarket ||
      blueMarket ||
      null,
    [markets, selectedMarketId, redMarket, blueMarket],
  );

  const selectedBet = selectedMarket
    ? activeBets.find((bet) => bet.betId === selectedMarket.id)
    : null;
  const locked = Boolean(selectedBet);
  const disabled =
    !selectedMarket ||
    amount < 1 ||
    amount > maxStake ||
    locked ||
    mode === "sell";

  const redCents = redMarket ? oddsToCents(redMarket.odds) : 0;
  const blueCents = blueMarket ? oddsToCents(blueMarket.odds) : 0;

  if (markets.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-element/35 px-3 py-3 text-xs text-text-muted">
        Main winner market opens when the game starts.
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-border/70 bg-surface/90 px-3 py-3 text-text-main shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <header className="mb-2.5 flex items-center justify-between border-b border-border/60 pb-2">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <button
            type="button"
            className={`pb-1 ${mode === "buy" ? "border-b-2 border-text-main text-text-main" : "text-text-muted"}`}
            onClick={() => setMode("buy")}
          >
            Buy
          </button>
          <button
            type="button"
            className={`pb-1 ${mode === "sell" ? "border-b-2 border-text-main text-text-main" : "text-text-muted"}`}
            onClick={() => setMode("sell")}
          >
            Sell
          </button>
        </div>

        <button type="button" className="text-xs font-semibold text-text-muted">
          Market
        </button>
      </header>

      <div className="mb-2.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSelectedMarketId(redMarket?.id || null)}
          className="rounded-xl border px-2 py-2 text-center text-xs font-semibold transition"
          style={{
            background:
              selectedMarket?.id === redMarket?.id
                ? sideAccent("red")
                : "var(--background)",
            color:
              selectedMarket?.id === redMarket?.id
                ? "#f8fff9"
                : "var(--foreground)",
            borderColor:
              selectedMarket?.id === redMarket?.id
                ? `${sideAccent("red")}`
                : "var(--border)",
          }}
        >
          {marketLabel(redMarket)} {redCents}¢
        </button>

        <button
          type="button"
          onClick={() => setSelectedMarketId(blueMarket?.id || null)}
          className="rounded-xl border px-2 py-2 text-center text-xs font-semibold transition"
          style={{
            background:
              selectedMarket?.id === blueMarket?.id
                ? sideAccent("blue")
                : "var(--background)",
            color:
              selectedMarket?.id === blueMarket?.id
                ? "#f4f8ff"
                : "var(--foreground)",
            borderColor:
              selectedMarket?.id === blueMarket?.id
                ? `${sideAccent("blue")}`
                : "var(--border)",
          }}
        >
          {marketLabel(blueMarket)} {blueCents}¢
        </button>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <p className="text-xs font-semibold leading-none text-text-main">
          Amount
        </p>
        <p className="text-2xl font-semibold leading-none text-text-muted">
          ${amount}
        </p>
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {QUICK_AMOUNTS.map((quickAmount) => (
          <button
            key={quickAmount}
            type="button"
            className="rounded-md border border-border/60 bg-background px-2 py-1 text-[11px] font-semibold text-text-main"
            onClick={() => setAmount(quickAmount)}
          >
            +${quickAmount}
          </button>
        ))}
        <button
          type="button"
          className="rounded-md border border-border/60 bg-background px-2 py-1 text-[11px] font-semibold text-text-main"
          onClick={() => setAmount(maxStake)}
        >
          Max
        </button>
      </div>

      <label className="mb-2 block">
        <input
          type="number"
          min={0}
          max={maxStake}
          value={amount}
          onChange={(event) => {
            const next = parseInt(event.target.value, 10);
            if (Number.isNaN(next)) {
              setAmount(0);
              return;
            }
            setAmount(Math.max(0, Math.min(maxStake, next)));
          }}
          className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm font-semibold text-text-main outline-none"
        />
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!selectedMarket || disabled) return;
          onPlace(selectedMarket, amount);
          setAmount(0);
        }}
        className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        style={{
          background: selectedMarket
            ? sideAccent(selectedMarket.side)
            : "#4b5563",
        }}
      >
        {locked
          ? `Already bought ${marketLabel(selectedMarket)}`
          : mode === "sell"
            ? "Sell coming soon"
            : `Buy ${marketLabel(selectedMarket)} ${selectedMarket ? `${oddsToCents(selectedMarket.odds)}¢` : ""}`}
      </button>
    </article>
  );
}
