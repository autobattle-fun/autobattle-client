"use client";

import { motion } from "motion/react";
import { Shield } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-mono font-bold text-xl tracking-tighter">
            AUTO<span className="text-emerald">BATTLE</span>.FUN
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-mono text-sm text-gray-400">
          <Link href="#about" className="hover:text-emerald transition-colors">
            About
          </Link>
          <Link
            href="#mechanics"
            className="hover:text-emerald transition-colors"
          >
            Mechanics
          </Link>
          <Link
            href="#roadmap"
            className="hover:text-emerald transition-colors"
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
            <span className="relative z-10">JOIN WAITLIST</span>
            <div className="absolute inset-0 bg-emerald/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <div className="absolute inset-0 shadow-[0_0_15px_rgba(16,185,129,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
