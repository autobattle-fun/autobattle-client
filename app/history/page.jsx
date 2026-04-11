"use client";

import { Card } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col pt-8">
      <h1 className="text-2xl font-bold mb-6">Match History</h1>

      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Card
            key={i}
            className="w-full bg-element rounded-2xl p-4 flex items-center justify-between border border-border/50 hover:bg-element-hover transition-colors cursor-pointer shadow-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-sm shadow-sm">
                #{i}
              </div>
              <div>
                <div className="font-semibold text-sm mb-0.5">
                  Match {1000 - i}
                </div>
                <div className="text-[10px] text-text-muted uppercase font-medium">
                  2 hours ago
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm">Winner: Unknown</div>
              <div className="text-[10px] text-text-muted uppercase font-medium mt-0.5">
                View Details ↗
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
