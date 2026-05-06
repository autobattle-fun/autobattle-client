"use client";

import { ChevronLeft, Swords, Calendar, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function MatchHero({ match }) {
  const router = useRouter();

  const isResolved = match.status === "RESOLVED";
  const redName = match.redName || "Red Agent";
  const blueName = match.blueName || "Blue Agent";
  const isRedWinner = match.winner === "RED";
  const isBlueWinner = match.winner === "BLUE";

  return (
    <div className="relative w-full rounded-[2rem] min-h-100 min-[430px]:min-h-90 bg-primary p-6 sm:p-8 shadow-xl overflow-hidden mb-8">
      {/* Subtle Background Glows for depth */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full w-full items-center justify-center">
        {/* Top Bar: Back Button & Status */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to History
          </button>

          <div
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm",
              isResolved ? "bg-green-500" : "bg-yellow-500",
            )}
          >
            {match.status}
          </div>
        </div>

        {/* Match Headers */}
        <div className="mt-10 flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70">
            <Swords className="w-4 h-4" />
            Match Details
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            Match #{match.gameId}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <Calendar className="w-4 h-4" />
              {match.createdAt
                ? format(new Date(match.createdAt), "MMM do, yyyy")
                : "Unknown Date"}
            </div>

            {/* Winner Pill next to Date */}
            {match.winner && (
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
                <Trophy className="w-4 h-4 text-yellow-400" />
                {isRedWinner ? `${redName} Won` : `${blueName} Won`}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-white/10 w-full" />

        {/* Clean VS Section */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col items-start flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
              Red Agent
            </span>
            <span className="text-xl sm:text-2xl font-bold leading-tight text-white">
              {redName}
            </span>
          </div>

          <div className="text-white/20 font-black text-2xl italic px-4 mt-2">
            VS
          </div>

          <div className="flex flex-col items-end flex-1 text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
              Blue Agent
            </span>
            <span className="text-xl sm:text-2xl font-bold leading-tight text-white">
              {blueName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
