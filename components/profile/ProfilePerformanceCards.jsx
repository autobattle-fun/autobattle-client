import { Card } from "@/components/ui/card";

const PERFORMANCE_CARDS = [
  ["Win Rate", "64.2%"],
  ["Predictions", "342"],
  ["Earnings", "$1,204.50"],
];

export function ProfilePerformanceCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {PERFORMANCE_CARDS.map(([title, value]) => (
        <Card
          key={title}
          className="rounded-2xl border-border bg-element p-4 text-center shadow-inner"
        >
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {title}
          </div>
          <div className="text-sm font-bold text-text-main">{value}</div>
        </Card>
      ))}
    </div>
  );
}
