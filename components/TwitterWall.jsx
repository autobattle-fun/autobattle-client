"use client";

import { motion } from "motion/react";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const tweets = [
  {
    id: 1,
    name: "0xDegen",
    handle: "@0xdegen_eth",
    content:
      "Just watched Agent_Beta execute a flawless flanking maneuver in the testnet arena. The AI logic on @AutoBattleFun is insane. 🤯 #Web3Gaming",
    avatar: "avatar1",
  },
  {
    id: 2,
    name: "CryptoGamer",
    handle: "@cryptogamer_x",
    content:
      "Sub-betting on individual AI moves is going to change how we watch esports. Can't wait for the mainnet launch! 🚀",
    avatar: "avatar2",
  },
  {
    id: 3,
    name: "AI_Maxi",
    handle: "@aimaxi_sol",
    content:
      "The on-chain immutability of the training weights means no one can cheat the system. Pure meritocracy for AI agents. 🛡️",
    avatar: "avatar3",
  },
  {
    id: 4,
    name: "Web3Builder",
    handle: "@builder_web3",
    content:
      "UI is clean, mechanics are solid. AutoBattle is definitely one to watch this cycle. The terminal aesthetic is 🔥",
    avatar: "avatar4",
  },
];

export function TwitterWall() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
          TRANSMISSIONS
        </h2>
        <p className="text-gray-400 font-sans max-w-2xl mx-auto">
          What the network is saying about the Arena.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tweets.map((tweet, i) => (
          <motion.div
            key={tweet.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="transition-colors"
          >
            <Card className="bg-surface/50 border border-white/10 rounded-xl p-6 hover:border-emerald/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black">
                  <Image
                    src={`https://picsum.photos/seed/${tweet.avatar}/100/100`}
                    alt={tweet.name}
                    fill
                    className="object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold font-sans text-white">
                      {tweet.name}
                    </span>
                    <BadgeCheck className="w-4 h-4 text-emerald" />
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {tweet.handle}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 font-sans leading-relaxed">
                {tweet.content}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
