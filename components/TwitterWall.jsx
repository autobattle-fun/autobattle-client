"use client";

import { motion } from "motion/react";
import { BadgeCheck, Radio } from "lucide-react";
import Image from "next/image";

const tweets = [
  {
    id: "TX-992A",
    name: "0xDegen",
    handle: "@0xdegen_eth",
    content:
      "Just watched Agent_Beta execute a flawless flanking maneuver in the testnet arena. The AI logic on @AutoBattleFun is insane. 🤯 #Web3Gaming",
    avatar: "avatar1",
    time: "2 MIN AGO",
  },
  {
    id: "TX-841B",
    name: "CryptoGamer",
    handle: "@cryptogamer_x",
    content:
      "Sub-betting on individual AI moves is going to change how we watch esports. Can't wait for the mainnet launch! 🚀",
    avatar: "avatar2",
    time: "15 MIN AGO",
  },
  {
    id: "TX-773C",
    name: "AI_Maxi",
    handle: "@aimaxi_sol",
    content:
      "The on-chain immutability of the training weights means no one can cheat the system. Pure meritocracy for AI agents. 🛡️",
    avatar: "avatar3",
    time: "1 HOUR AGO",
  },
  {
    id: "TX-112D",
    name: "Web3Builder",
    handle: "@builder_web3",
    content:
      "UI is clean, mechanics are solid. AutoBattle is definitely one to watch this cycle. The terminal aesthetic is 🔥",
    avatar: "avatar4",
    time: "3 HOURS AGO",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TwitterWall() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-white/10 rounded-full mb-6">
          <Radio className="w-4 h-4 text-emerald animate-pulse" />
          <span className="font-mono text-xs text-gray-400 tracking-widest">
            INTERCEPTED SIGNALS
          </span>
        </div>
        <h2
          className="text-3xl md:text-5xl font-mono font-black mb-4 tracking-tighter glitch-text"
          data-text="TRANSMISSIONS"
        >
          TRANSMISSIONS
        </h2>
        <p className="text-gray-400 font-sans max-w-2xl mx-auto">
          Raw data streams and sentiment analysis from the network.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
      >
        {tweets.map((tweet) => (
          <motion.div
            variants={cardVariants}
            key={tweet.id}
            className="group bg-surface/40 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:border-emerald/40 hover:bg-surface/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 px-3 py-1 bg-white/5 text-[10px] font-mono text-gray-500 rounded-bl-lg border-b border-l border-white/5 group-hover:text-emerald/70 group-hover:border-emerald/20 transition-colors">
              REF: {tweet.id}
            </div>

            <div className="flex justify-between items-start mb-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-black border border-white/10 group-hover:border-emerald/50 transition-colors">
                  <Image
                    src={`https://picsum.photos/seed/${tweet.avatar}/100/100`}
                    alt={tweet.name}
                    fill
                    className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                    sizes="48px"
                  />
                  <div className="absolute inset-0 bg-emerald/20 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold font-sans text-white group-hover:text-emerald transition-colors">
                      {tweet.name}
                    </span>
                    <BadgeCheck className="w-4 h-4 text-emerald" />
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {tweet.handle}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-300 font-sans leading-relaxed text-sm">
              {tweet.content}
            </p>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-600">
              <span>STATUS: VERIFIED</span>
              <span className="group-hover:text-emerald/50 transition-colors">
                {tweet.time}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
