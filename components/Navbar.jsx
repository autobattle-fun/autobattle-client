"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Shield } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/90 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Shield className="w-6 h-6 text-purple group-hover:text-emerald transition-colors duration-300" />
          <span className="font-mono font-bold text-xl tracking-tighter text-white group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-300">
            AUTO<span className="text-emerald">BATTLE</span>.FUN
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-mono text-sm text-gray-400">
          <Link
            href="#about"
            className="hover:text-emerald hover:drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all"
          >
            About
          </Link>
          <Link
            href="#mechanics"
            className="hover:text-emerald hover:drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all"
          >
            Mechanics
          </Link>
          <Link
            href="#roadmap"
            className="hover:text-emerald hover:drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all"
          >
            Roadmap
          </Link>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-6 py-2 font-mono text-sm font-bold text-white bg-surface border border-emerald/50 rounded overflow-hidden group"
          >
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
              JOIN WAITLIST
            </span>
            <div className="absolute inset-0 bg-emerald translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <div className="absolute inset-0 shadow-[0_0_15px_rgba(16,185,129,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
