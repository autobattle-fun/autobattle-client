"use client";

import { useState } from "react";
import {
  Activity,
  Swords,
  ChevronDown,
  ChevronUp,
  PlusSquare,
  Hand,
  MinusCircle,
  Layers,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RoundList({ rounds, redName, blueName }) {
  const [expandedRound, setExpandedRound] = useState(null);

  const toggleRound = (roundId) => {
    setExpandedRound(expandedRound === roundId ? null : roundId);
  };

  if (!rounds || rounds.length === 0) {
    return (
      <Card className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-element/30 py-12 px-4 shadow-none">
        <Activity className="w-8 h-8 text-text-muted/50 mb-3" />
        <p className="text-sm font-semibold text-text-main">
          Awaiting Round Data
        </p>
        <p className="text-xs text-text-muted mt-1 text-center">
          Round history will appear here once the battle begins.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 pb-8">
      {rounds.map((round) => {
        const isExpanded = expandedRound === round.id;
        const redWonRound = round.roundWinner === "RED";
        const blueWonRound = round.roundWinner === "BLUE";
        const roundResolved =
          round.phase === "ENDED" || round.phase === "AWAITING_INITIAL_DEAL";

        return (
          <div key={round.id} className="flex flex-col gap-2">
            <Card
              onClick={() => toggleRound(round.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border border-border/50 bg-element p-4 shadow-none cursor-pointer transition-all hover:bg-element-hover",
                isExpanded && "border-primary/50 ring-1 ring-primary/20",
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-element-hover border border-border/50 text-text-muted">
                  <Swords className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-main">
                    Round {round.roundNumber}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {round.roundWinner ? (
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider",
                          redWonRound ? "text-red-500" : "text-blue-500",
                        )}
                      >
                        {redWonRound ? redName : blueName} Won
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                        In Progress
                      </span>
                    )}
                    <span className="text-text-muted">•</span>
                    <span className="text-xs text-text-muted">
                      {round.moves?.length || 0} moves
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Ending HP
                  </span>
                  <span className="text-xs font-bold text-text-main">
                    <span className="text-red-500">{round.redHpAfter}</span> -{" "}
                    <span className="text-blue-500">{round.blueHpAfter}</span>
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                )}
              </div>
            </Card>

            {isExpanded && (
              <Card className="ml-4 sm:ml-8 flex flex-col gap-0 rounded-2xl shadow-none border border-border/50 bg-element overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* 1. AGENT MOVES LIST */}
                <div className="flex flex-col gap-0">
                  {!round.moves || round.moves.length === 0 ? (
                    <div className="text-sm text-center text-text-muted py-6">
                      Dealing cards...
                    </div>
                  ) : (
                    round.moves
                      .sort((a, b) => a.moveNumber - b.moveNumber)
                      .map((move, idx) => {
                        const isRed = move.player === "RED";
                        const isHit = move.action === "HIT";
                        const agentName = isRed ? redName : blueName;
                        const busted = move.scoreAfter > 21;

                        return (
                          <div
                            key={move.id || idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2 border-b border-border/30 last:border-0 hover:bg-element-hover/50 transition-colors"
                          >
                            <div className="flex items-start sm:items-center gap-4">
                              <div
                                className={cn(
                                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border",
                                  isRed
                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                    : "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                )}
                              >
                                {isHit ? (
                                  <PlusSquare className="w-5 h-5" />
                                ) : (
                                  <Hand className="w-5 h-5" />
                                )}
                              </div>

                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-text-main">
                                    {agentName}
                                  </span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-0.5">
                                    {move.action.replace("_", " ")}
                                  </span>
                                </div>
                                {move.reason && (
                                  <p className="text-[11px] text-text-muted/80 italic mt-1 line-clamp-2 hover:line-clamp-none transition-all">
                                    "{move.reason}"
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 mt-3 sm:mt-0 pl-14 sm:pl-0">
                              {move.cardDealt && (
                                <div className="flex items-center gap-1.5 rounded-md bg-element-hover px-2 py-1 border border-border/50">
                                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                    Card:
                                  </span>
                                  <span className="text-xs font-bold text-text-main">
                                    {move.cardDealt?.label ||
                                      move.cardDealt?.value}
                                  </span>
                                </div>
                              )}

                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                  Score
                                </span>
                                <span
                                  className={cn(
                                    "text-sm font-bold",
                                    busted ? "text-red-500" : "text-text-main",
                                  )}
                                >
                                  {move.scoreAfter}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>

                {/* 2. RIVER CARDS */}
                {(round.riverRed || round.riverBlue) && (
                  <div className="flex flex-col border-t border-border/30 p-4 bg-element-hover/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-text-muted" />
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        River Cards Revealed
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                      {round.riverRed && (
                        <div className="flex items-center gap-2 rounded-lg bg-element border border-border/50 px-3 py-2 flex-1">
                          <span className="text-xs font-bold text-red-500 flex-1 truncate">
                            {redName}
                          </span>
                          <div className="rounded border border-border/50 bg-element-hover px-2 py-0.5 text-xs font-bold text-text-main">
                            {round.riverRed.label || round.riverRed.value}
                          </div>
                        </div>
                      )}
                      {round.riverBlue && (
                        <div className="flex items-center gap-2 rounded-lg bg-element border border-border/50 px-3 py-2 flex-1">
                          <span className="text-xs font-bold text-blue-500 flex-1 truncate">
                            {blueName}
                          </span>
                          <div className="rounded border border-border/50 bg-element-hover px-2 py-0.5 text-xs font-bold text-text-main">
                            {round.riverBlue.label || round.riverBlue.value}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. SUDDEN DEATH TIEBREAKER */}
                {round.tiebreakerCards && round.tiebreakerCards.length > 0 && (
                  <div className="flex flex-col border-t border-border/30 p-4 bg-yellow-500/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-wider">
                        Sudden Death Tiebreaker
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {round.tiebreakerCards.map((tie, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row gap-4 sm:items-center"
                        >
                          {tie.red && (
                            <div className="flex items-center gap-2 rounded-lg bg-element border border-border/50 px-3 py-2 flex-1">
                              <span className="text-xs font-bold text-red-500 flex-1 truncate">
                                {redName}
                              </span>
                              <div className="rounded border border-border/50 bg-element-hover px-2 py-0.5 text-xs font-bold text-text-main">
                                {tie.red.label || tie.red.value}
                              </div>
                            </div>
                          )}
                          {tie.blue && (
                            <div className="flex items-center gap-2 rounded-lg bg-element border border-border/50 px-3 py-2 flex-1">
                              <span className="text-xs font-bold text-blue-500 flex-1 truncate">
                                {blueName}
                              </span>
                              <div className="rounded border border-border/50 bg-element-hover px-2 py-0.5 text-xs font-bold text-text-main">
                                {tie.blue.label || tie.blue.value}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. DAMAGE PHASE */}
                {roundResolved && round.damageDealt > 0 && (
                  <div className="flex items-center justify-between border-t border-border/30 bg-red-500/5 px-4 py-3">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Damage Phase
                    </span>
                    <div className="flex items-center gap-1.5">
                      <MinusCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-bold text-red-500">
                        {round.damageDealt} HP to{" "}
                        {redWonRound ? blueName : redName}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );
}
