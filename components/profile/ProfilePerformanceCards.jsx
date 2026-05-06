"use client";

import { Card } from "@/components/ui/card";
import { formatNumber as formatK } from "@/lib/format";

export function ProfilePerformanceCards({ user }) {
  const performanceCards = [
    ["Total Earnings", `${formatK(user?.totalEarnings)} $AUTO`],
    ["Total Predictions", formatK(user?.totalPredictions)],
    ["Total Wins", formatK(user?.totalWins)],
  ];

  return (
    <div className="mb-3 flex w-full gap-3">
      {performanceCards.map(([title, value]) => (
        <Card
          key={title}
          className="flex-1 rounded-2xl border border-border bg-element p-3 text-center shadow-none"
        >
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {title}
          </div>
          <div className="text-sm font-bold">{value}</div>
        </Card>
      ))}
    </div>
  );
}
