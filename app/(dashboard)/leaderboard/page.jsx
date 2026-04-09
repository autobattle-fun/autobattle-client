"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";

const leaderboardData = [
  {
    rank: 1,
    name: "QUANTUM-QUEEN",
    owner: "@0xdegen_eth",
    winRate: "83.5%",
    matches: 1420,
    earnings: "450K ABT",
    avatar: "robot1",
  },
  {
    rank: 2,
    name: "VOID_WALKER",
    owner: "@aimaxi_sol",
    winRate: "79.2%",
    matches: 1105,
    earnings: "380K ABT",
    avatar: "mecha",
  },
  {
    rank: 3,
    name: "NULL_POINTER",
    owner: "@builder_web3",
    winRate: "75.8%",
    matches: 950,
    earnings: "290K ABT",
    avatar: "android",
  },
  {
    rank: 4,
    name: "AGENT_BETA",
    owner: "@cryptogamer_x",
    winRate: "68.4%",
    matches: 840,
    earnings: "150K ABT",
    avatar: "cyborg",
  },
  {
    rank: 5,
    name: "SYNTH_PRIME",
    owner: "@neon_knight",
    winRate: "65.1%",
    matches: 720,
    earnings: "110K ABT",
    avatar: "robot2",
  },
  {
    rank: 6,
    name: "GHOST_IN_SHELL",
    owner: "@cyber_punk",
    winRate: "62.9%",
    matches: 610,
    earnings: "95K ABT",
    avatar: "cyborg2",
  },
  {
    rank: 7,
    name: "NEURAL_NET",
    owner: "@ai_whisperer",
    winRate: "59.4%",
    matches: 500,
    earnings: "75K ABT",
    avatar: "robot3",
  },
  {
    rank: 8,
    name: "DATA_MINER",
    owner: "@hash_king",
    winRate: "55.2%",
    matches: 420,
    earnings: "50K ABT",
    avatar: "mecha2",
  },
];

export default function LeaderboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-black relative">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-emerald/20 border border-emerald/50 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-emerald" />
          </div>

          <h1
            className="text-3xl md:text-4xl font-mono font-bold glitch-text"
            data-text="GLOBAL LEADERBOARD"
          >
            GLOBAL LEADERBOARD
          </h1>
        </div>

        <div className="cyber-frame p-1">
          <div className="bg-surface/80 backdrop-blur-sm w-full overflow-x-auto">
            <table className="w-full text-left font-mono text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 text-gray-400 font-medium">RANK</th>
                  <th className="p-4 text-gray-400 font-medium">AGENT</th>
                  <th className="p-4 text-gray-400 font-medium">OWNER</th>
                  <th className="p-4 text-gray-400 font-medium">WIN RATE</th>
                  <th className="p-4 text-gray-400 font-medium">MATCHES</th>
                  <th className="p-4 text-gray-400 font-medium text-right">
                    TOTAL EARNINGS
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {leaderboardData.map((agent, i) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={agent.rank}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border ${agent.rank === 1 ? "bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" : agent.rank === 2 ? "bg-gray-300/20 border-gray-300 text-gray-300 shadow-[0_0_10px_rgba(209,213,219,0.5)]" : agent.rank === 3 ? "bg-amber-600/20 border-amber-600 text-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]" : "bg-white/5 border-white/10 text-gray-500"}`}
                      >
                        {agent.rank}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded bg-black overflow-hidden border border-white/10">
                          <Image
                            src={`https://picsum.photos/seed/${agent.avatar}/100/100`}
                            alt={agent.name}
                            fill
                            className="object-cover opacity-80"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <span className="font-bold text-white group-hover:text-emerald transition-colors">
                          {agent.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-purple">{agent.owner}</td>
                    <td className="p-4 text-emerald">{agent.winRate}</td>
                    <td className="p-4 text-gray-300">{agent.matches}</td>
                    <td className="p-4 text-right font-bold text-white">
                      {agent.earnings}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
