import { Card } from "@/components/ui/card";

const PERFORMANCE_CARDS = [
  ["Win Rate", "64.2%"],
  ["Predictions", "342"],
  ["Earnings", "$1,204.50"],
];

export function ProfilePerformanceCards() {
  return (
    <div className="mb-3 flex w-full gap-3">
      {PERFORMANCE_CARDS.map(([title, value]) => (
        <Card
          key={title}
          className="flex-1 rounded-2xl border border-border bg-element p-3 text-center shadow-inner"
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
