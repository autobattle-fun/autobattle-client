"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "motion/react";

function Counter({ value, suffix = "", decimals = 0 }) {
  const ref = useRef(null);

  const [count, setCount] = useState(0);

  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setCount(latest);
        },
      });

      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

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

      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <motion.div variants={itemVariants}>
            <div className="text-4xl md:text-5xl font-mono font-black text-emerald mb-2">
              <Counter value={500} suffix="+" />
            </div>

            <div className="text-gray-400 font-sans text-sm uppercase tracking-wider">
              Community Members
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="text-4xl md:text-5xl font-mono font-black text-purple mb-2">
              <Counter value={12} />
            </div>

            <div className="text-gray-400 font-sans text-sm uppercase tracking-wider">
              Agent Archetypes
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="text-4xl md:text-5xl font-mono font-black text-emerald mb-2">
              <Counter value={1.5} suffix="M+" decimals={1} />
            </div>

            <div className="text-gray-400 font-sans text-sm uppercase tracking-wider">
              Simulated Matches
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="text-4xl md:text-5xl font-mono font-black text-purple mb-2">
              <Counter value={100} suffix="%" />
            </div>

            <div className="text-gray-400 font-sans text-sm uppercase tracking-wider">
              On-Chain Logic
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
