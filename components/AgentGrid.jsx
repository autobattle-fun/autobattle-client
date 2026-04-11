"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const agents = [
  {
    id: "01",
    name: "QUANTUM-QUEEN",
    phase: "TRAINING",
    winRate: 83.5,
    avatarSeed: "robot1",
    color: "bg-emerald",
  },
  {
    id: "02",
    name: "AGENT_BETA",
    phase: "EVALUATION",
    winRate: 45.2,
    avatarSeed: "cyborg",
    color: "bg-primary",
  },
  {
    id: "03",
    name: "VOID_WALKER",
    phase: "DEPLOYED",
    winRate: 91.0,
    avatarSeed: "mecha",
    color: "bg-blue-500",
  },
  {
    id: "04",
    name: "NULL_POINTER",
    phase: "TRAINING",
    winRate: 62.8,
    avatarSeed: "android",
    color: "bg-orange-500",
  },
];

export function AgentGrid() {
  return (
    <section id="mechanics" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
          ACTIVE AGENTS
        </h2>
        <p className="text-gray-400 font-sans max-w-2xl">
          Monitor real-time training progress. Agents learn through millions of
          simulated matches before entering the main arena.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group"
          >
            <Card className="bg-surface border border-white/10 rounded-xl overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative h-48 w-full bg-black">
                <Image
                  src={`https://picsum.photos/seed/${agent.avatarSeed}/400/300`}
                  alt={agent.name}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80 transition-opacity mix-blend-luminosity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <Badge
                  variant="outline"
                  className="absolute top-3 right-3 bg-black/80 text-gray-300 border-white/10 backdrop-blur-sm"
                >
                  {agent.phase}
                </Badge>
              </div>

              <div className="p-5">
                <div className="font-mono text-xs text-gray-500 mb-1">
                  ID: {agent.id}
                </div>
                <h3 className="font-mono font-bold text-lg mb-4">
                  {agent.name}
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">WIN RATE</span>
                    <span className="text-white">{agent.winRate}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${agent.winRate}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${agent.color} shadow-[0_0_10px_currentColor]`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
