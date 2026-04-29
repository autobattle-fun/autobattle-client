import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PredictionPerformanceCards({ amount, share, side }) {
  const stats = [
    { title: "Amount", value: `${amount} $AUTO` },
    { title: "Potential Share", value: share || 0 },
    { title: "Status", value: "Confirmed", isStatus: true },
  ];

  return (
    <div className="mb-3 flex w-full gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="flex-1 rounded-2xl border border-border bg-element p-3 text-center shadow-inner"
        >
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {stat.title}
          </div>
          <div className={cn(
            "text-sm font-bold",
            stat.isStatus && "text-green-500"
          )}>
            {stat.value}
          </div>
        </Card>
      ))}
    </div>
  );
}
