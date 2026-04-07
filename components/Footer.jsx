"use client";

import { motion } from "motion/react";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative border-t border-white/10 bg-surface/80 py-12 mt-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <Shield className="w-5 h-5 text-purple group-hover:text-emerald transition-colors duration-300" />
          <span className="font-mono font-bold text-lg tracking-tighter text-gray-400 group-hover:text-white transition-colors duration-300">
            AUTO<span className="text-emerald">BATTLE</span>.FUN
          </span>
        </div>

        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-sm border border-white/5">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          />
          <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">
            System Ops: Nominal
          </span>
          <span className="text-gray-600 font-mono text-[10px] hidden sm:inline border-l border-white/10 pl-3 ml-1">
            © 2026 ABF
          </span>
        </div>

        <div className="flex gap-6 font-mono text-xs text-gray-500">
          {["TERMS", "PRIVACY", "DOCS"].map((link) => (
            <motion.a
              key={link}
              href="#"
              whileHover={{ y: -2, color: "#10b981" }}
              className="transition-colors hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            >
              [{link}]
            </motion.a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
