"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Wallet, Activity, Shield, Zap, Crosshair } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-black relative">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          className="cyber-frame p-8 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="relative w-32 h-32 rounded-full border-2 border-emerald p-1">
            <div className="absolute inset-0 rounded-full border border-emerald animate-ping opacity-20" />

            <div className="w-full h-full rounded-full overflow-hidden relative bg-surface">
              <Image
                src="https://picsum.photos/seed/user123/200/200"
                alt="Profile"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-2">
              @Neon_Drifter
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 font-mono text-sm mb-4">
              <Wallet className="w-4 h-4" />
              <span>0x7F...3A9B</span>
              <button className="text-emerald hover:text-white transition-colors ml-2">
                [COPY]
              </button>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple/10 border border-purple/20 rounded text-purple font-mono text-xs">
              <Shield className="w-3 h-3" />
              <span>RANK: CYBER-KNIGHT</span>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 rounded-lg p-6 text-center min-w-50">
            <div className="text-gray-400 font-mono text-xs mb-1">
              TOTAL BALANCE
            </div>
            <div
              className="text-3xl font-mono font-bold text-emerald glitch-text"
              data-text="12,450"
            >
              12,450
            </div>
            <div className="text-emerald/50 font-mono text-xs mt-1">
              ABT TOKENS
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cyber-frame p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-purple" />
              <h3 className="font-mono text-sm text-gray-400">WIN RATE</h3>
            </div>

            <div className="text-4xl font-mono font-bold text-white">64.2%</div>

            <div className="w-full h-1 bg-surface mt-4 rounded-full overflow-hidden">
              <div className="h-full bg-purple w-[64.2%]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="cyber-frame p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Crosshair className="w-5 h-5 text-emerald" />
              <h3 className="font-mono text-sm text-gray-400">TOTAL BETS</h3>
            </div>

            <div className="text-4xl font-mono font-bold text-white">342</div>

            <div className="text-emerald font-mono text-xs mt-2">
              +12 this week
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="cyber-frame p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h3 className="font-mono text-sm text-gray-400">
                FAVORITE AGENT
              </h3>
            </div>

            <div className="text-xl font-mono font-bold text-white mb-1">
              QUANTUM-QUEEN
            </div>

            <div className="text-gray-500 font-mono text-xs">
              145 Bets Placed
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
