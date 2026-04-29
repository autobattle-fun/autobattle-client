"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Swords, Activity, User, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";

export function RoundList({ rounds }) {
  const [expandedRound, setExpandedRound] = useState(null);

  const toggleRound = (roundId) => {
    setExpandedRound(expandedRound === roundId ? null : roundId);
  };

  if (!rounds || rounds.length === 0) {
    return (
      <div className="text-center py-10 text-text-muted">
        No rounds data available
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
        Match Rounds ({rounds.length})
      </div>
      
      {rounds.map((round) => (
        <div key={round.id} className="flex flex-col gap-2">
          <Card
            className={`flex w-full items-center justify-between rounded-2xl border border-border/50 bg-element p-4 shadow-none cursor-pointer transition-all hover:bg-element-hover ${
              expandedRound === round.id ? "border-primary/50 ring-1 ring-primary/20" : ""
            }`}
            onClick={() => toggleRound(round.id)}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Swords className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Round {round.roundNumber}</span>
                <span className="text-xs text-text-muted">
                  Winner: <span className="font-bold">{round.roundWinner || "Tie"}</span> • {round.moves?.length || 0} moves
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[10px] font-bold text-text-muted mr-2">
                HP: {round.redHpAfter} - {round.blueHpAfter}
              </div>
              {expandedRound === round.id ? (
                <ChevronUp className="w-5 h-5 text-text-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-text-muted" />
              )}
            </div>
          </Card>

          {expandedRound === round.id && (
            <div className="ml-6 pl-4 border-l-2 border-primary/20 flex flex-col gap-2 py-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {round.moves?.sort((a, b) => a.moveNumber - b.moveNumber).map((move, idx) => (
                <div 
                  key={move.id || idx} 
                  className="flex items-center gap-3 p-3 bg-element/50 rounded-xl border border-border/30"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                    move.player === 'RED' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    #{move.moveNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">{move.action}</div>
                      {move.cardDealt && (
                        <div className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold border border-primary/20">
                          {move.cardDealt.label}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-text-muted uppercase font-bold">
                      {move.player} • Score: {move.scoreBefore} → {move.scoreAfter}
                    </div>
                    {move.reason && (
                      <p className="text-[10px] text-text-muted/70 italic mt-1 line-clamp-1 hover:line-clamp-none transition-all">
                        "{move.reason}"
                      </p>
                    )}
                  </div>
                  <Cpu className="w-4 h-4 text-text-muted opacity-30" />
                </div>
              ))}
              {(!round.moves || round.moves.length === 0) && (
                <div className="text-xs text-text-muted italic py-2">
                  No moves recorded for this round
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
