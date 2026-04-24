"use client";

import { Crown, Sparkles } from "lucide-react";

import { PlayingCard } from "@/components/dashboard/PlayingCard";

function scoreTone(score) {
  if (score > 21) return "#ef4444";
  if (score === 21) return "#f59e0b";
  return "#f8fafc";
}

export function AgentSidePanel({
  side,
  player,
  riverCard,
  tiebreakCards,
  isActive,
}) {
  const scoreColor = scoreTone(player.score);

  const tint = side === "red" ? "#f43f5e" : "#38bdf8";
  const name = side === "red" ? "Red Agent" : "Blue Agent";

  const mainCards = player.hand.slice(
    0,
    player.hand.length - (riverCard ? 1 : 0) - tiebreakCards.length,
  );
  const stackedCards = [
    ...mainCards.map((card) => ({ card, isRiver: false, isTb: false })),
    ...(riverCard ? [{ card: riverCard, isRiver: true, isTb: false }] : []),
    ...tiebreakCards.map((card) => ({ card, isRiver: false, isTb: true })),
  ];

  return (
    <section
      className="relative flex h-full flex-col justify-between rounded-3xl border border-border bg-background p-4"
      style={{
        boxShadow: isActive
          ? `inset 0 0 0 1px ${tint}66, 0 0 28px ${tint}28`
          : "none",
        margin: side === "red" ? "0 0 0 32px" : "0 32px 0 0",
      }}
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: tint, boxShadow: `0 0 14px ${tint}` }}
            />

            <p className="text-sm font-semibold">{name}</p>
          </div>

          {isActive ? (
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{
                color: tint,
                borderColor: `${tint}55`,
                background: `${tint}19`,
              }}
            >
              <Sparkles className="h-3 w-3" /> Active
            </span>
          ) : null}
        </div>

        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em]">Score</p>

            <p
              style={{ color: scoreColor }}
              className="text-5xl font-extrabold leading-none tabular-nums"
            >
              {player.score}
            </p>
          </div>

          {player.stayed ? (
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-element px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
              <Crown className="h-3 w-3" /> Stay
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
          Hand
        </p>

        <div className="min-h-30 overflow-x-auto rounded-2xl border border-border bg-element p-2">
          <div className="flex min-w-max items-center px-1 py-1">
            {stackedCards.map(
              ({ card, isRiver: cardRiver, isTb: cardTb }, index) => (
                <div
                  key={card.id}
                  className={index === 0 ? "" : "-ml-8"}
                  style={{ zIndex: index + 1 }}
                >
                  <PlayingCard
                    card={card}
                    size="lg"
                    isRiver={cardRiver}
                    isTb={cardTb}
                    isNew={
                      index === stackedCards.length - 1 &&
                      stackedCards.length > 1
                    }
                  />
                </div>
              ),
            )}
          </div>

          {player.hand.length === 0 ? (
            <div className="grid h-22.5 w-16 place-items-center rounded-lg border border-dashed border-border bg-background">
              ?
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
