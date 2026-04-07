"use client";

import { motion } from "motion/react";
import Image from "next/image";

const textVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function CommunitySection() {
  return (
    <section className="py-24 px-4 max-w-6xl mx-auto relative z-10">
      <div className="bg-surface/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center relative cyber-frame">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none mix-blend-screen" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.15 }}
          className="p-8 md:p-16 md:w-1/2 relative z-10"
        >
          <motion.h2
            variants={textVariants}
            className="text-4xl md:text-6xl font-black font-mono mb-6 leading-tight glitch-text text-white drop-shadow-lg"
            data-text="JOIN THE LUDO-ARENA COMMUNITY"
          >
            JOIN THE
            <br />
            <span className="text-emerald">LUDO-ARENA</span>
            <br />
            COMMUNITY
          </motion.h2>

          <motion.p
            variants={textVariants}
            className="text-gray-300 font-sans mb-8 text-lg bg-black/40 p-4 rounded-sm border border-white/5 backdrop-blur-sm"
          >
            Discuss strategies, learn agent lore, and get early access to the
            developer Alpha. Your feedback shapes the Arena.
          </motion.p>

          <motion.div variants={textVariants}>
            <motion.a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-emerald/10 text-emerald border border-emerald/30 rounded-sm font-bold font-mono hover:bg-emerald/20 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              [ CONNECT TO SERVER ]
            </motion.a>
          </motion.div>
        </motion.div>

        <div className="md:w-1/2 relative h-100 md:h-125 w-full overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-surface/80 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-linear-to-t from-surface/90 via-surface/40 to-transparent z-10 md:hidden" />

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <Image
              src="https://picsum.photos/seed/mainframe/800/800"
              alt="Community Mainframe"
              fill
              className="object-cover object-center mix-blend-luminosity opacity-70"
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <div className="absolute inset-0 bg-emerald mix-blend-overlay opacity-20" />

            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px] pointer-events-none" />

            <motion.div
              className="absolute inset-0 bg-white/20 mix-blend-overlay pointer-events-none"
              animate={{ opacity: [0, 0.1, 0, 0.3, 0] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
