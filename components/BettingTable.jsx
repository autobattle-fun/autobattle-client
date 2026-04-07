"use client";

import { motion } from "motion/react";

const bets = [
  {
    id: "B-001",
    desc: "Agent Alpha vs Agent Beta in next [Melee Match]",
    odds: "+22X",
    pool: "45,000 $ABF",
  },
  {
    id: "B-002",
    desc: "First agent to successfully extract the core?",
    odds: "+15X",
    pool: "12,500 $ABF",
  },
  {
    id: "B-003",
    desc: "Predict the exact next action sequence for Agent Beta",
    odds: "+8X",
    pool: "89,200 $ABF",
  },
  {
    id: "B-004",
    desc: "Will Quantum-Queen survive the first 60 seconds?",
    odds: "+2X",
    pool: "150,000 $ABF",
  },
];

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function BettingTable() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto relative z-10">
      <div className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-mono font-black tracking-tighter">
            LIVE <span className="text-emerald">SUB-BETS</span>
          </h2>
          <p className="text-gray-400 font-mono text-sm mt-2">
            PREDICT EVERY MICROMOVE. REAP THE REWARDS.
          </p>
        </div>
        <div className="font-mono text-xs text-purple border border-purple/30 bg-purple/10 px-3 py-1 rounded-sm">
          STATUS: OFFLINE
        </div>
      </div>

      <div className="relative cyber-frame p-1 md:p-8 min-h-100">
        <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center border border-white/5">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center px-4"
          >
            <div className="border border-emerald/50 bg-emerald/5 px-6 py-8 rounded-sm relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-emerald/50"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <div className="font-mono text-xs text-emerald mb-4 tracking-widest uppercase">
                [ Protocol Locked ]
              </div>

              <h3
                className="font-mono font-black text-3xl md:text-5xl text-white mb-4 glitch-text tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                data-text="UNDER DEVELOPMENT"
              >
                UNDER DEVELOPMENT
              </h3>

              <p className="text-gray-400 font-mono text-sm max-w-md mx-auto">
                The prediction engine is currently being calibrated with
                millions of simulated matches. Smart contracts will unlock upon
                mainnet launch.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={tableVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3 opacity-30 pointer-events-none select-none p-4 md:p-0"
          aria-hidden="true"
        >
          <div className="hidden md:flex text-xs font-mono text-gray-500 pb-2 px-4 border-b border-white/5">
            <div className="w-24">ID</div>
            <div className="flex-1">CONTRACT / CONDITION</div>
            <div className="w-32 text-right">CURRENT POOL</div>
            <div className="w-24 text-right">ODDS</div>
          </div>

          {bets.map((bet) => (
            <motion.div
              variants={rowVariants}
              key={bet.id}
              className="flex flex-col md:flex-row md:items-center bg-white/5 border border-white/5 p-4 gap-4 transition-colors"
            >
              <div className="font-mono text-xs text-purple w-24">{bet.id}</div>

              <div className="flex-1 font-mono text-sm text-gray-300">
                {bet.desc}
              </div>

              <div className="font-mono text-xs text-gray-500 md:text-right w-32">
                {bet.pool}
              </div>

              <div className="flex items-center md:justify-end gap-4 w-auto md:w-24 mt-2 md:mt-0">
                <div className="px-3 py-1 bg-emerald/10 border border-emerald/20 text-emerald font-bold font-mono text-sm rounded-sm">
                  {bet.odds}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
