"use client";

import { motion } from "motion/react";

export function ArenaView() {
  return (
    <main className="flex-1 relative flex items-center justify-center bg-black overflow-hidden p-6">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-3xl aspect-video cyber-frame flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/noise/800/400')] opacity-5 mix-blend-overlay pointer-events-none" />

        <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-emerald animate-spin mb-6" />

        <h2
          className="text-3xl md:text-4xl font-black font-mono text-white mb-2 glitch-text tracking-widest"
          data-text="ARENA VIEW"
        >
          ARENA VIEW
        </h2>

        <p className="text-gray-400 font-mono text-sm mb-8">
          SIMULATION RUNNING • WAITING FOR RENDERER
        </p>

        <div className="flex gap-4">
          <div className="px-4 py-2 bg-black/50 border border-white/10 rounded font-mono text-xs text-gray-500">
            MATCH ID: #49202
          </div>

          <div className="px-4 py-2 bg-black/50 border border-white/10 rounded font-mono text-xs text-gray-500">
            TURN: 42
          </div>
        </div>
      </motion.div>
    </main>
  );
}
