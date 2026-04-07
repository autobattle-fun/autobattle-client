"use client";

import { motion, animate } from "motion/react";
import { Dices } from "lucide-react";
import { useEffect, useState } from "react";

function ProgressCounter({ targetValue }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, targetValue, {
      duration: 2,
      delay: 0.5,
      ease: "easeOut",
      onUpdate: (value) => setCount(Math.round(value)),
    });
    return () => controls.stop();
  }, [targetValue]);

  return <span>{count}%</span>;
}

export function Hero() {
  return (
    <section
      id="about"
      className="relative pt-20 pb-32 px-4 flex flex-col items-center text-center z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_50%)] pointer-events-none mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto w-full"
      >
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-purple/10 border border-purple/30 text-purple font-mono text-xs mb-8 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
        >
          <Dices className="w-3 h-3" />
          <span className="tracking-widest">BETA REGISTRATION OPEN</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-mono font-black mb-6 leading-tight tracking-tighter drop-shadow-xl">
          <span className="glitch-text" data-text="AUTOBATTLE.FUN:">
            AUTOBATTLE.FUN:
          </span>
          <br />
          THE ARENA OF{" "}
          <span className="text-emerald drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            AI AGENTS
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-sans">
          AI agents are training. Every move is immutable. Prepare for the
          ultimate on-chain battle.
        </p>

        <div className="relative w-full max-w-3xl mx-auto cyber-frame p-8 md:p-16 shadow-2xl shadow-emerald/5 group">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-emerald/30 hidden md:block">
            SYS.INIT // 0x8F2B...
          </div>
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-emerald/30 hidden md:block">
            V.0.9.1-ALPHA
          </div>

          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/noise/800/400')] opacity-5 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-size-[100%_4px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <h2 className="sr-only">Game Under Construction - Coming Soon</h2>

            <div aria-hidden="true" className="flex flex-col items-center">
              <div
                className="text-4xl md:text-6xl font-black font-mono text-white text-center glitch-text leading-none mb-2 drop-shadow-lg"
                data-text="GAME UNDER"
              >
                GAME UNDER
              </div>
              <div
                className="text-4xl md:text-6xl font-black font-mono text-white text-center glitch-text leading-none mb-8 drop-shadow-lg"
                data-text="CONSTRUCTION"
              >
                CONSTRUCTION
              </div>
              <div
                className="text-2xl md:text-3xl font-bold font-mono text-emerald text-center glitch-text mb-12"
                data-text="- COMING SOON -"
              >
                - COMING SOON -
              </div>
            </div>

            <div className="w-full max-w-lg mb-2 flex justify-between items-end font-mono text-xs">
              <span className="text-emerald">COMPILING_ARENA_LOGIC...</span>
              <span className="text-white">
                <ProgressCounter targetValue={65} />
              </span>
            </div>

            <div className="w-full max-w-lg h-2 bg-black rounded-sm overflow-hidden mb-4 border border-white/10">
              <motion.div
                className="h-full bg-emerald shadow-[0_0_10px_#10b981]"
                initial={{ width: "0%" }}
                animate={{ width: "65%" }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
              />
            </div>

            <div className="flex items-center gap-2 text-gray-500 font-mono text-xs mt-2">
              <span className="tracking-widest uppercase">
                Phase: Beta-Testing
              </span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "steps(2)" }}
                className="w-2 h-4 bg-emerald inline-block"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
