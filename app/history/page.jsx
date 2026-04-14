import { Card } from "@/components/ui/card";
import { ChessPawn } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="max-w-xl mx-auto h-full flex flex-col pt-16">
      <h1 className="text-4xl font-bold mb-2">Match History</h1>
      <p className="text-text-muted text-sm mb-6">
        All the previous matches and their results
      </p>

      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Card
            key={i}
            className="w-full bg-element rounded-2xl p-4 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 min-w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary shadow-sm">
                <ChessPawn className="w-5 h-5 text-white" />
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
            <div className="text-right space-y-2">
              <div className="font-bold text-sm flex items-center gap-2 justify-end">
                <div className="flex gap-1 px-2 py-1 text-xs text-white bg-green-500 rounded-sm items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  Green
                </div>
              </div>
              <div className="text-[10px] text-text-muted font-medium mt-0.5">
                View Details ↗
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
