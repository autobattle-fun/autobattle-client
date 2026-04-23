"use client";

import { useState } from "react";

import { oddsToCents } from "./BetPricing";

const QUICK_AMOUNTS = [5, 10, 25, 50, 100, 250];

function accentBySide(side) {
  if (side === "red") return "#fb7185";
  if (side === "blue") return "#60a5fa";
  return "#a78bfa";
}

export function BetMarketCard({ market, onPlace, existingBet, maxStake }) {
  const [amount, setAmount] = useState(10);
  const [expanded, setExpanded] = useState(false);

  const cents = oddsToCents(market.odds);
  const accent = accentBySide(market.side);

  const disabled = amount < 1 || amount > maxStake;

  const locked = Boolean(existingBet);

  return (
    <article
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e1628]/85 shadow-[0_8px_24px_rgba(0,0,0,0.26)]"
      style={{
        boxShadow: expanded && !locked ? `inset 0 0 0 1px ${accent}55` : "none",
      }}
    >
      <button
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
        type="button"
        onClick={() => {
          if (!locked) setExpanded((prev) => !prev);
        }}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-main">
            {market.label}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">{market.sublabel}</p>
        </div>

        {locked ? (
          <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
            ${existingBet.amount}
          </span>
        ) : null}

        <span
          className="rounded-md border px-2 py-0.5 text-xs font-bold"
          style={{
            color: accent,
            background: `${accent}18`,
            borderColor: `${accent}55`,
          }}
        >
          {cents}¢
        </span>
      </button>

      {expanded && !locked ? (
        <div className="space-y-2.5 border-t border-white/10 px-3 pb-3 pt-2">
          <div className="grid grid-cols-6 gap-1.5">
            {QUICK_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                className="rounded-md border px-1 py-1 text-[11px] font-semibold"
                style={{
                  color: amount === value ? accent : "var(--muted)",
                  borderColor:
                    amount === value ? `${accent}70` : "rgba(255,255,255,0.18)",
                  background:
                    amount === value ? `${accent}1c` : "rgba(255,255,255,0.03)",
                }}
                onClick={() => setAmount(value)}
              >
                ${value}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                $
              </span>
              <input
                min={1}
                type="number"
                max={maxStake}
                value={amount}
                onChange={(event) => {
                  const next = parseInt(event.target.value, 10);

                  if (Number.isNaN(next)) {
                    setAmount(1);
                    return;
                  }

                  setAmount(Math.max(1, Math.min(maxStake, next)));
                }}
                className="w-full rounded-lg border border-white/20 bg-black/20 py-2 pl-6 pr-2 text-sm font-semibold text-text-main outline-none"
              />
            </label>

            <span className="text-xs text-text-muted">
              Price:{" "}
              <span style={{ color: accent }} className="font-semibold">
                {cents}¢
              </span>
            </span>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              onPlace(market, amount);
              setExpanded(false);
            }}
            className="w-full rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              color: accent,
              borderColor: `${accent}6f`,
              background: `${accent}1b`,
            }}
          >
            Buy ${amount}
          </button>
        </div>
      ) : null}
    </article>
  );
}
