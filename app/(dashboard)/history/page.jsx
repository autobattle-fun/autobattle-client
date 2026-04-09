"use client";

import { motion } from "motion/react";
import { History, ArrowUpRight, ArrowDownRight } from "lucide-react";

const historyData = [
  {
    id: "M-49201",
    date: "2026-04-09 14:30",
    type: "Sub-Bet",
    detail: "QUANTUM-QUEEN Next Roll: 5-6",
    outcome: "WIN",
    amount: "+450 ABT",
    status: "text-emerald",
    bg: "bg-emerald/10",
    border: "border-emerald/20",
  },
  {
    id: "M-49188",
    date: "2026-04-09 12:15",
    type: "Match Winner",
    detail: "Bet on AGENT_BETA",
    outcome: "LOSS",
    amount: "-100 ABT",
    status: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
  {
    id: "M-49150",
    date: "2026-04-08 18:45",
    type: "Sub-Bet",
    detail: "First Blood: VOID_WALKER",
    outcome: "WIN",
    amount: "+820 ABT",
    status: "text-emerald",
    bg: "bg-emerald/10",
    border: "border-emerald/20",
  },
  {
    id: "M-49112",
    date: "2026-04-08 09:20",
    type: "Match Winner",
    detail: "Bet on NULL_POINTER",
    outcome: "WIN",
    amount: "+250 ABT",
    status: "text-emerald",
    bg: "bg-emerald/10",
    border: "border-emerald/20",
  },
  {
    id: "M-49005",
    date: "2026-04-07 22:10",
    type: "Sub-Bet",
    detail: "Survival Duration > 5m",
    outcome: "LOSS",
    amount: "-50 ABT",
    status: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
  {
    id: "M-48990",
    date: "2026-04-07 16:05",
    type: "Match Winner",
    detail: "Bet on QUANTUM-QUEEN",
    outcome: "WIN",
    amount: "+1200 ABT",
    status: "text-emerald",
    bg: "bg-emerald/10",
    border: "border-emerald/20",
  },
];

export default function HistoryPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-black relative">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-purple/20 border border-purple/50 flex items-center justify-center">
            <History className="w-6 h-6 text-purple" />
          </div>

          <h1
            className="text-3xl md:text-4xl font-mono font-bold glitch-text"
            data-text="BETTING HISTORY"
          >
            BETTING HISTORY
          </h1>
        </div>

        <div className="space-y-4">
          {historyData.map((record, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={record.id}
              className="cyber-frame p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-white/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border ${record.bg} ${record.border}`}
                >
                  {record.outcome === "WIN" ? (
                    <ArrowUpRight className={record.status} />
                  ) : (
                    <ArrowDownRight className={record.status} />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-gray-400">
                      {record.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-gray-300">
                      {record.type}
                    </span>
                  </div>

                  <div className="font-sans text-white text-lg">
                    {record.detail}
                  </div>
                  <div className="font-mono text-xs text-gray-500 mt-1">
                    {record.date}
                  </div>
                </div>
              </div>

              <div className="text-right w-full md:w-auto flex md:flex-col justify-between md:justify-center items-center md:items-end border-t border-white/10 md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <div className={`font-mono font-bold text-xl ${record.status}`}>
                  {record.amount}
                </div>
                <div
                  className={`font-mono text-xs ${record.status} opacity-80 mt-1`}
                >
                  {record.outcome}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
