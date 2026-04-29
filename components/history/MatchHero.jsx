"use client";

import { ArrowLeft, Calendar, Swords, Trophy, Cpu } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function MatchHero({ match }) {
  const isRedWinner = match.winner === "RED";
  const isBlueWinner = match.winner === "BLUE";

  return (
    <div className="relative mb-6 w-full rounded-4xl border border-border/50 bg-primary p-8 md:p-10 shadow-2xl shadow-primary/20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div className="flex items-start justify-between">
          <Link
            href="/history"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white text-sm font-bold backdrop-blur-md border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to History
          </Link>

          <div className="flex flex-col items-end">
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white border-2 border-white/20 ${
                match.status === "RESOLVED" ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {match.status}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
            <Swords className="w-4 h-4" />
            Match Details
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Match #{match.gameId}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-white/80 font-medium bg-white/5 px-3 py-1 rounded-lg">
              <Calendar className="w-4 h-4" />
              {match.createdAt
                ? format(new Date(match.createdAt), "PPP")
                : "Unknown Date"}
            </div>
            <div className="flex items-center gap-2 text-white/80 font-medium bg-white/5 px-3 py-1 rounded-lg">
              <Cpu className="w-4 h-4" />
              {match.llmRed} vs {match.llmBlue}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <p className="text-xs font-bold text-white/50 uppercase">Red Agent</p>
              <p className={`text-base font-bold ${isRedWinner ? "text-yellow-400" : "text-white"}`}>
                {isRedWinner && "🏆 "}{match.agentRed.slice(0, 4)}...{match.agentRed.slice(-4)}
              </p>
            </div>
            <div className="text-white/20 font-black text-2xl">VS</div>
            <div className="flex flex-col items-end text-right">
              <p className="text-xs font-bold text-white/50 uppercase">Blue Agent</p>
              <p className={`text-base font-bold ${isBlueWinner ? "text-yellow-400" : "text-white"}`}>
                {match.agentBlue.slice(0, 4)}...{match.agentBlue.slice(-4)}{isBlueWinner && " 🏆"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
