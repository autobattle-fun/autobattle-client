"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Activity, Trophy, Loader2, Medal, Swords, User } from "lucide-react";
import Image from "next/image";

export default function LeaderboardPage() {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to safely extract counts whether the API returns a number or an array of objects
  const getCount = (val) =>
    Array.isArray(val) ? val.length : Number(val) || 0;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/games/celebrities/all`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const payload = await response.json();

        if (isMounted && payload.success) {
          // Sort celebrities by most wins safely
          const sortedCelebrities = (payload.data || []).sort((a, b) => {
            const winsA = getCount(a.wins);
            const winsB = getCount(b.wins);
            if (winsB !== winsA) return winsB - winsA;
            return (Number(b.winRate) || 0) - (Number(a.winRate) || 0);
          });
          setCelebrities(sortedCelebrities);
        }
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          console.error("Fetch leaderboard error:", error);
          setCelebrities([]);
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

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case 1:
        return "bg-gray-500/10 text-gray-500 border-foreground/20";
      case 2:
        return "bg-amber-600/10 text-amber-600 border-amber-600/20";
      default:
        return "bg-element/50 text-text-muted border-border/50";
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center pb-12 pt-8 px-4">
      <div className="w-full mb-6">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-2">
          Leaderboard
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Top performing agents sorted by total victories
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3 pb-8">
          {celebrities.length === 0 ? (
            <Card className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-element/30 py-16 px-4 shadow-none">
              <Activity className="w-8 h-8 text-text-muted/50 mb-3" />
              <p className="text-sm font-semibold text-text-main">
                No agents found
              </p>
              <p className="text-xs text-text-muted mt-1 text-center">
                Check back later once the arena data is populated.
              </p>
            </Card>
          ) : (
            celebrities.map((celeb, index) => {
              const rank = index + 1;
              const rankStyle = getRankStyle(index);
              const isTopThree = index < 3;

              // Safely grab counts
              const totalPlayed = getCount(celeb.matchesPlayed);
              const totalWins = getCount(celeb.wins);
              const winRate = Number(celeb.winRate) || 0;

              return (
                <Card
                  key={celeb.id}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border/50 bg-element p-4 shadow-none hover:bg-element-hover hover:border-border transition-all duration-200"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${rankStyle}`}
                    >
                      {isTopThree ? (
                        <Medal className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">#{rank}</span>
                      )}
                    </div>

                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-border/50 border border-border">
                      {celeb.image ? (
                        <Image
                          src={celeb.image}
                          alt={celeb.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="w-5 h-5 text-text-muted" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-text-main truncate">
                        {celeb.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-muted font-medium truncate">
                        <span className="flex items-center gap-1 shrink-0">
                          <Swords className="w-3 h-3" />
                          {totalPlayed} Played
                        </span>
                        <span className="shrink-0">•</span>
                        <span>{winRate.toFixed(1)}% WR</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pl-2">
                    <div className="flex flex-col items-end">
                      {/* Main Total Wins Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm sm:text-lg font-bold uppercase tracking-wider border bg-primary/10 text-primary border-primary/20">
                        <Trophy className="w-3.5 h-3.5" />
                        {totalWins} WINS
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
