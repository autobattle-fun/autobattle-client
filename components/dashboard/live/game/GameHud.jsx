"use client";

import { Flame, Shield, Swords } from "lucide-react";

import { INITIAL_HP } from "@/components/dashboard/gameLogic";

function HealthTrack({ label, hp, tint }) {
  const hpPercent = Math.max(0, Math.min(100, (hp / INITIAL_HP) * 100));

  const isCritical = hp <= 3;

  return (
    <div className="space-y-2 rounded-2xl border border-border bg-element p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" style={{ color: tint }} />

          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70">
            {label}
          </p>
        </div>

        <p className="text-sm font-semibold tabular-nums text-foreground">
          {hp}
          <span className="text-[11px] text-foreground/45">/{INITIAL_HP}</span>
        </p>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700"
          style={{
            width: `${hpPercent}%`,
            background: `linear-gradient(90deg, ${tint} 0%, color-mix(in srgb, ${tint} 70%, #ffffff 30%) 100%)`,
            boxShadow: isCritical ? `0 0 16px ${tint}` : "none",
          }}
        />
      </div>

      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: INITIAL_HP }).map((_, index) => (
          <div
            key={`${label}_${index}`}
            className="h-1.5 rounded-full"
            style={{
              background:
                index < hp
                  ? tint
                  : "color-mix(in srgb, #ffffff 12%, transparent)",
              opacity: index < hp ? 0.9 : 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function FireDamageBadge({ damage }) {
  const intensity = Math.max(
    1,
    Math.min(6, Math.log2(Math.max(1, damage)) + 1),
  );

  const glow = 0.22 + intensity * 0.08;

  return (
    <div className="relative flex items-center justify-center rounded-2xl border border-amber-300 dark:border-amber-200/35 bg-background/20 px-3 py-2 overflow-hidden">
      <div
        className="absolute inset-0 rounded-2xl opacity-30 dark:opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 64%, rgba(249,115,22,${glow}) 0%, rgba(220,38,38,${glow * 0.88}) 40%, transparent 74%)`,
          filter: `blur(${4 + intensity}px)`,
          transform: "scale(1.02)",
        }}
      />

      <div className="relative z-10 flex items-center gap-2 pb-1 -mt-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-100/80">
          Damage
        </span>

        <span className="text-2xl font-black tabular-nums text-amber-700 dark:text-amber-200">
          {damage}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-1.5 flex items-center justify-center gap-1 opacity-85">
        {Array.from({ length: Math.round(intensity) }).map((_, index) => (
          <Flame
            key={index}
            className="h-3 w-3 text-orange-800 dark:text-orange-300"
            style={{
              animation: `arenaFlame ${0.9 + index * 0.08}s ease-in-out infinite`,
              animationDelay: `${index * 90}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function GameHud({ redHp, blueHp, round, damage }) {
  return (
    <header className="rounded-3xl border border-border bg-linear-to-r from-background via-element to-background p-4 shadow-[0_20px_40px_rgba(1,6,20,0.35)]">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_1fr]">
        <HealthTrack label="Red Agent" hp={redHp} tint="#f43f5e" />

        <div className="flex min-w-37.5 flex-col items-center justify-center rounded-2xl border border-border bg-background px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/60">
            Round
          </p>

          <p className="text-4xl font-extrabold tabular-nums">{round}</p>

          <div className="mt-1 flex items-center gap-1 text-foreground/65">
            <Swords className="h-3.5 w-3.5" />

            <span className="text-[11px] uppercase tracking-[0.14em]">
              Live Duel
            </span>
          </div>

          <div className="mt-2 w-full">
            <FireDamageBadge damage={damage} />
          </div>
        </div>

        <HealthTrack label="Blue Agent" hp={blueHp} tint="#38bdf8" />
      </div>
    </header>
  );
}
