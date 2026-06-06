"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Activity, Loader2, Medal, ArrowUpDown, User } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function LastWeekLeaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard/last-week`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const payload = await response.json();

        if (isMounted && payload.success) {
          setData(payload.data);
        }
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          console.error("Fetch leaderboard error:", error);
          setData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLeaderboard();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case 2:
        return "bg-gray-400/10 text-gray-400 border-gray-400/20";
      case 3:
        return "bg-amber-600/10 text-amber-600 border-amber-600/20";
      default:
        return "bg-element/50 text-text-muted border-border/50";
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
      </div>
    );
  }

  const entries = data?.entries || [];

  return (
    <div className="flex w-full flex-col gap-3 pb-8">
      {/* Week Info */}
      {data?.weekStart && (
        <p className="text-xs text-text-muted mb-1 font-medium">
          Week of {format(new Date(data.weekStart), "MMM d, yyyy")}
          {data?.updatedAt && (
            <> · Final results</>
          )}
        </p>
      )}

      {entries.length === 0 ? (
        <Card className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-element/30 py-16 px-4 shadow-none">
          <Activity className="w-8 h-8 text-text-muted/50 mb-3" />
          <p className="text-sm font-semibold text-text-main">
            No data for last week
          </p>
          <p className="text-xs text-text-muted mt-1 text-center">
            Last week&apos;s leaderboard will appear here once available.
          </p>
        </Card>
      ) : (
        entries.map((entry) => {
          const rankStyle = getRankStyle(entry.rank);
          const isTopThree = entry.rank <= 3;

          return (
            <Card
              key={entry.userId}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border/50 bg-element p-4 shadow-none hover:bg-element-hover hover:border-border transition-all duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${rankStyle}`}
                >
                  {isTopThree ? (
                    <Medal className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">
                      #{entry.rank}
                    </span>
                  )}
                </div>

                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-border/50 border border-border flex items-center justify-center">
                  <User className="w-5 h-5 text-text-muted" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-text-main truncate">
                    {entry.username || "Anonymous"}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-muted font-medium truncate">
                    <span className="flex items-center gap-1 shrink-0">
                      Rank #{entry.rank}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pl-2">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm sm:text-lg font-bold uppercase tracking-wider border bg-primary/10 text-primary border-primary/20">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {entry.tradeCount} TRADES
                  </div>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
