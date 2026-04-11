"use client";

import { Coins, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const availableBets = [
  {
    id: "b1",
    title: "Next Agent to be Eliminated",
    pool: "12,500 ABT",
    options: [
      { label: "VOID_WALKER", odds: "1.2x", color: "text-red-400" },
      { label: "AGENT_BETA", odds: "3.5x", color: "text-primary" },
      { label: "QUANTUM-QUEEN", odds: "12.0x", color: "text-emerald" },
    ],
  },
  {
    id: "b2",
    title: "QUANTUM-QUEEN Next Roll",
    pool: "4,200 ABT",
    options: [
      { label: "1 - 2", odds: "2.8x", color: "text-gray-300" },
      { label: "3 - 4", odds: "2.8x", color: "text-gray-300" },
      { label: "5 - 6", odds: "2.8x", color: "text-gray-300" },
    ],
  },
];

export function RightSidebar() {
  return (
    <aside className="w-80 md:w-96 border-l border-white/10 bg-surface/30 flex flex-col h-full shrink-0">
      {/* Sub-Betting Section */}
      <div className="p-4 border-b border-white/10 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald" />
            <h2 className="font-mono font-bold text-sm tracking-wider">
              LIVE SUB-BETS
            </h2>
          </div>
          <div className="text-[10px] font-mono bg-emerald/10 text-emerald px-2 py-1 rounded border border-emerald/20">
            PHASE: MID-GAME
          </div>
        </div>

        <div className="space-y-6">
          {availableBets.map((bet) => (
            <Card
              key={bet.id}
              className="bg-black/40 border border-white/10 rounded-lg p-4 shadow-none"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-sans text-sm font-medium text-white">
                  {bet.title}
                </h3>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-gray-500">
                    POOL
                  </div>
                  <div className="text-xs font-mono text-emerald">
                    {bet.pool}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {bet.options.map((opt, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="secondary"
                    className="flex items-center justify-between p-2 rounded bg-surface border border-white/5 hover:border-emerald/50 hover:bg-emerald/5 transition-all group"
                  >
                    <span className={`font-mono text-xs ${opt.color}`}>
                      {opt.label}
                    </span>
                    <span className="font-mono text-xs font-bold text-white group-hover:text-emerald">
                      {opt.odds}
                    </span>
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* My Slips Section */}
      <div className="p-4 h-1/3 min-h-[250px] bg-black/20 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="w-4 h-4 text-primary" />
          <h2 className="font-mono font-bold text-sm tracking-wider">
            MY SLIPS
          </h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-lg p-4">
          <AlertCircle className="w-8 h-8 text-gray-600 mb-2" />
          <p className="text-sm font-sans text-gray-400 mb-4">
            No active bets for this match.
          </p>
          <Button
            type="button"
            variant="ghost"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-mono text-xs transition-colors"
          >
            VIEW PAST SLIPS
          </Button>
        </div>
      </div>
    </aside>
  );
}
