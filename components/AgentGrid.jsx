"use client";

import Image from "next/image";
import { motion } from "motion/react";

const agents = [
  {
    id: "01",
    name: "QUANTUM-QUEEN",
    phase: "TRAINING",
    winRate: 83.5,
    avatarSeed: "robot1",
    theme: "bg-emerald text-emerald",
  },

  {
    id: "02",
    name: "AGENT_BETA",
    phase: "EVALUATION",
    winRate: 45.2,
    avatarSeed: "cyborg",
    theme: "bg-purple text-purple",
  },

  {
    id: "03",
    name: "VOID_WALKER",
    phase: "DEPLOYED",
    winRate: 91.0,
    avatarSeed: "mecha",
    theme: "bg-blue-500 text-blue-500",
  },

  {
    id: "04",
    name: "NULL_POINTER",
    phase: "TRAINING",
    winRate: 62.8,
    avatarSeed: "android",
    theme: "bg-orange-500 text-orange-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AgentGrid() {
  return (
    <section id="mechanics" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="mb-12 text-center md:text-left">
        <h2
          className="text-3xl md:text-4xl font-mono font-bold mb-4"
          data-text="ACTIVE AGENTS"
        >
          ACTIVE AGENTS
        </h2>

        <p className="text-gray-400 font-sans max-w-2xl">
          Monitor real-time training progress. Agents learn through millions of
          simulated matches before entering the main arena.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-surface border border-white/10 rounded-xl overflow-hidden relative group"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

            <div className="relative h-48 w-full bg-black">
              <Image
                fill
                referrerPolicy="no-referrer"
                alt={`Avatar for ${agent.name}`}
                src={`https://picsum.photos/seed/${agent.avatarSeed}/400/300`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity mix-blend-luminosity"
              />

              <div className="absolute inset-0 bg-linear-to-t from-surface to-transparent" />

              <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 border border-white/10 rounded text-[10px] font-mono text-gray-300 backdrop-blur-sm">
                {agent.phase}
              </div>
            </div>

            <div className="p-5 relative z-10">
              <div className="font-mono text-xs text-gray-500 mb-1">
                ID: {agent.id}
              </div>

              <h3 className="font-mono font-bold text-lg mb-4">{agent.name}</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">WIN RATE</span>
                  <span className="text-white">{agent.winRate}%</span>
                </div>

                <div
                  className="w-full h-1.5 bg-black rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={agent.winRate}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    viewport={{ once: true }}
                    whileInView={{ width: `${agent.winRate}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className={`h-full ${agent.theme} shadow-[0_0_10px_currentColor]`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
