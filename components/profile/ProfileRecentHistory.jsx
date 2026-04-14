import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

const RECENT_ITEMS = [1, 2, 3];

export function ProfileRecentHistory() {
  return (
    <div>
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
        Recent History
      </div>

      <div className="flex flex-col gap-2">
        {RECENT_ITEMS.map((item) => (
          <Card
            key={item}
            className="flex items-center justify-between rounded-2xl border-border/60 bg-element p-4 shadow-none"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  Will Green Agent win the match?
                </span>
                <span className="text-xs text-text-muted">
                  Match 123456789 • 0.001 $AUTO
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-green-500 px-2 py-1">
              <Check className="h-4 w-4 text-green-500" />
              <p className="text-sm font-bold text-green-500">Yes</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
