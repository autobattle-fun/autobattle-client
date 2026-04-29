"use client";

import { Activity, Shield, Zap, Target } from "lucide-react";

export function MatchStats({ match }) {
  const stats = [
    {
      label: "Red HP Left",
      value: match.redHp,
      icon: Shield,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Blue HP Left",
      value: match.blueHp,
      icon: Shield,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Rounds",
      value: match.roundNumber,
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Winner",
      value: match.winner || "None",
      icon: Target,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-4 bg-element rounded-3xl border border-border/50"
        >
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              {stat.label}
            </span>
          </div>
          <div className="text-xl font-black">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
