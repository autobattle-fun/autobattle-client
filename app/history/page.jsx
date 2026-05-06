"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Swords, Activity, Trophy, ArrowRight, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page"), 10) || 1;

  const [data, setData] = useState({
    matches: [],
    pagination: { totalPages: 1, total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchHistory() {
      setLoading(true);
      try {
        // Adjust endpoint based on your express routes
        // (Assuming the marketRoutes is mounted at /api/market)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/games?status=RESOLVED&page=${page}&limit=10`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch match history");
        }

        const payload = await response.json();

        if (isMounted) {
          setData({
            // Extract from the updated response shape
            matches: payload?.matches || payload?.data?.matches || [],
            pagination: payload?.pagination ||
              payload?.data?.pagination || { totalPages: 1, total: 0 },
          });
        }
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          console.error("Fetch history error:", error);
          setData({ matches: [], pagination: { totalPages: 1, total: 0 } });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHistory();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page]);

  const { matches, pagination } = data;

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center pb-12 pt-8 px-4">
      {/* Page Header */}
      <div className="w-full mb-6">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-2">
          Match History
        </h1>
        <p className="text-sm text-text-muted mt-1">
          View all previous battles and their outcomes
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
        </div>
      ) : (
        <>
          {/* History List */}
          <div className="flex w-full flex-col gap-3">
            {matches.length === 0 ? (
              <Card className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-element/30 py-16 px-4 shadow-none">
                <Activity className="w-8 h-8 text-text-muted/50 mb-3" />
                <p className="text-sm font-semibold text-text-main">
                  No matches found
                </p>
                <p className="text-xs text-text-muted mt-1 text-center">
                  Resolved matches will appear here once battles conclude.
                </p>
              </Card>
            ) : (
              matches.map((match) => {
                // Direct access since the payload is now an array of Match objects
                const isRedWinner = match.winner === "RED";
                const redName = match.redName || "Red";
                const blueName = match.blueName || "Blue";

                return (
                  <Link
                    key={match.id}
                    href={`/history/${match.id}`}
                    className="group block"
                  >
                    <Card className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border/50 bg-element p-4 shadow-none hover:bg-element-hover hover:border-border transition-all duration-200">
                      {/* Left Side: Icon & Matchup Info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                            <Trophy className="w-5 h-5 text-primary" />
                          </div>
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-text-main group-hover:text-primary transition-colors truncate">
                            {redName} vs {blueName}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-muted font-medium truncate">
                            <span className="flex items-center gap-1 flex-shrink-0">
                              <Swords className="w-3 h-3" />
                              Match #{match.gameId}
                            </span>
                            <span className="flex-shrink-0">•</span>
                            <span className="truncate">
                              {/* Safely fallback if createdAt is omitted in Prisma select */}
                              {match.createdAt
                                ? formatDistanceToNow(
                                    new Date(match.createdAt),
                                    { addSuffix: true },
                                  )
                                : "Recently"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Winner Badge & Metadata */}
                      <div className="flex items-center gap-3 flex-shrink-0 pl-2">
                        <div className="flex flex-col items-end">
                          {match.winner ? (
                            <div
                              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                isRedWinner
                                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isRedWinner ? "bg-red-500" : "bg-blue-500"
                                }`}
                              />
                              {isRedWinner ? redName : blueName} Won
                            </div>
                          ) : (
                            <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                              Pending
                            </div>
                          )}

                          {/* Updated to show Market Count instead of Prediction Count */}
                          <span className="text-[10px] font-medium text-text-muted mt-1">
                            {match._count?.markets || 0} Markets
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted/50 group-hover:text-text-main transition-colors hidden sm:block flex-shrink-0" />
                      </div>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>

          {/* Pagination Integration */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 w-full pb-8">
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                baseUrl="/history"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
