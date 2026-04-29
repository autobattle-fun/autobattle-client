import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function ProfileRecentHistory({ predictions = [] }) {
  return (
    <div className="w-full">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
        Recent History
      </div>

      <div className="flex w-full flex-col gap-2">
        {predictions.length === 0 ? (
          <Card className="flex w-full items-center justify-center rounded-2xl border border-border/50 bg-element p-8 shadow-none">
            <p className="text-sm text-text-muted">No predictions found</p>
          </Card>
        ) : (
          predictions.map((prediction) => (
            <Link key={prediction.id} href={`/predictions/${prediction.id}`}>
              <Card
                className="flex w-full items-center justify-between rounded-2xl border border-border/50 bg-element p-4 shadow-none hover:bg-element-hover transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    prediction.side === 'GREEN' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {prediction.market?.title || "Will Green Agent win the match?"}
                    </span>
                    <span className="text-xs text-text-muted">
                      Match {prediction.id.slice(-8).toUpperCase()} • {prediction.amount} $AUTO
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 rounded-lg border px-2 py-1 ${
                  prediction.side === 'GREEN' ? 'border-green-500' : 'border-red-500'
                }`}>
                  <Check className={`w-4 h-4 ${prediction.side === 'GREEN' ? 'text-green-500' : 'text-red-500'}`} />
                  <p className={`text-sm font-bold ${prediction.side === 'GREEN' ? 'text-green-500' : 'text-red-500'}`}>
                    {prediction.side === 'GREEN' ? 'Yes' : 'No'}
                  </p>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}


