"use client";

import {
  Activity,
  ScrollText,
  Crosshair,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const activeAgents = [
  {
    id: "A1",
    name: "QUANTUM-QUEEN",
    hp: 85,
    maxHp: 100,
    status: "Aggressive",
    avatar: "robot1",
    color: "bg-emerald",
  },
  {
    id: "B2",
    name: "AGENT_BETA",
    hp: 42,
    maxHp: 100,
    status: "Defensive",
    avatar: "cyborg",
    color: "bg-primary",
  },
  {
    id: "C3",
    name: "VOID_WALKER",
    hp: 12,
    maxHp: 100,
    status: "Critical",
    avatar: "mecha",
    color: "bg-red-500",
  },
  {
    id: "D4",
    name: "NULL_POINTER",
    hp: 100,
    maxHp: 100,
    status: "Idle",
    avatar: "android",
    color: "bg-blue-500",
  },
];

const moveHistory = [
  {
    id: 1,
    time: "14:02:45",
    agent: "QUANTUM-QUEEN",
    action: "Rolled 5. Moved to D4.",
    type: "move",
    icon: Activity,
  },
  {
    id: 2,
    time: "14:02:42",
    agent: "AGENT_BETA",
    action: "Deployed shield. Defense +20.",
    type: "defend",
    icon: ShieldAlert,
  },
  {
    id: 3,
    time: "14:02:38",
    agent: "VOID_WALKER",
    action: "Critical hit on AGENT_BETA! -45 HP.",
    type: "attack",
    icon: Crosshair,
  },
  {
    id: 4,
    time: "14:02:30",
    agent: "NULL_POINTER",
    action: "Gathered resources. +10 Energy.",
    type: "buff",
    icon: Zap,
  },
  {
    id: 5,
    time: "14:02:25",
    agent: "QUANTUM-QUEEN",
    action: "Initiated combat sequence.",
    type: "move",
    icon: Activity,
  },
  {
    id: 6,
    time: "14:02:10",
    agent: "System",
    action: "Match #49202 started.",
    type: "system",
    icon: ScrollText,
  },
];

export function LeftSidebar() {
  return (
    <aside className="w-80 border-r border-white/10 bg-surface/30 flex flex-col h-full shrink-0">
      {/* Active Agents Section */}
      <div className="p-4 border-b border-white/10 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-emerald" />
          <h2 className="font-mono font-bold text-sm tracking-wider">
            ACTIVE AGENTS
          </h2>
        </div>

        <div className="space-y-3">
          {activeAgents.map((agent) => (
            <Card
              key={agent.id}
              className="bg-black/40 border border-white/5 rounded p-3 hover:border-white/10 transition-colors shadow-none"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-8 h-8 rounded bg-surface overflow-hidden shrink-0">
                  <Image
                    src={`https://picsum.photos/seed/${agent.avatar}/100/100`}
                    alt={agent.name}
                    fill
                    className="object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-bold truncate">
                    {agent.name}
                  </div>
                  <div className="font-mono text-[10px] text-gray-500">
                    {agent.status}
                  </div>
                </div>
                <div className="font-mono text-xs text-right">
                  <span
                    className={agent.hp < 30 ? "text-red-400" : "text-white"}
                  >
                    {agent.hp}
                  </span>
                  <span className="text-gray-600">/{agent.maxHp}</span>
                </div>
              </div>

              {/* HP Bar */}
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(agent.hp / agent.maxHp) * 100}%` }}
                  className={`h-full ${agent.color}`}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Move History Section */}
      <div className="p-4 flex-1 overflow-y-auto bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-primary" />
            <h2 className="font-mono font-bold text-sm tracking-wider">
              LIVE LOG
            </h2>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald"></span>
          </span>
        </div>

        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[1px] before:bg-white/10">
          {moveHistory.map((move, i) => {
            const Icon = move.icon;
            return (
              <motion.div
                key={move.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface border border-white/20 flex items-center justify-center z-10">
                  <Icon className="w-3 h-3 text-gray-400" />
                </div>
                <div className="font-mono text-[10px] text-gray-500 mb-0.5">
                  {move.time} • {move.agent}
                </div>
                <div className="font-sans text-xs text-gray-300 leading-relaxed">
                  {move.action}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
