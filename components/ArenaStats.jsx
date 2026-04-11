"use client";

import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    const duration = 2000;
    const frame = 16;
    const increment = value / (duration / frame);
    let current = 0;

    const timer = window.setInterval(() => {
      current = Math.min(current + increment, value);
      setCount(current);

      if (current >= value) {
        window.clearInterval(timer);
      }
    }, frame);

    return () => window.clearInterval(timer);
  }, [isInView, value]);

  const formatted = Number.isInteger(value)
    ? Math.floor(count)
    : count.toFixed(1);

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export function ArenaStats() {
  return (
    <section className="relative py-32 border-y border-white/10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 mix-blend-luminosity bg-center bg-cover"
        style={{
          backgroundImage:
            "url(https://picsum.photos/seed/colosseum/1920/1080)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl md:text-5xl font-mono font-black text-emerald mb-2">
              <Counter value={500} suffix="+" />
            </div>
            <div className="text-gray-400 font-sans text-sm uppercase tracking-wider">
              Community Members
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-4xl md:text-5xl font-mono font-black text-primary mb-2">
              <Counter value={12} />
            </div>
            <div className="text-gray-400 font-sans text-sm uppercase tracking-wider">
              Agent Archetypes
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl md:text-5xl font-mono font-black text-emerald mb-2">
              <Counter value={1.5} suffix="M+" />
            </div>
            <div className="text-gray-400 font-sans text-sm uppercase tracking-wider">
              Simulated Matches
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-4xl md:text-5xl font-mono font-black text-primary mb-2">
              <Counter value={100} suffix="%" />
            </div>
            <div className="text-gray-400 font-sans text-sm uppercase tracking-wider">
              On-Chain Logic
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
