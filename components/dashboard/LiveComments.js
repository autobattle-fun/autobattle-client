"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Smile,
  ImageIcon,
  MoreHorizontal,
  ArrowUp,
  Shield,
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function LiveComments() {
  const [activeTab, setActiveTab] = useState("comments");
  const logs = useGameStore((state) => state.logs) || [];
  const gameState = useGameStore((state) => state.gameState) || [];

  const MOCK_COMMENTS = [
    {
      id: 1,
      user: "formulaleon",
      time: "2m ago",
      text: "someone please help me with just 2-3$ i always give the tips back please check my pfp",
      likes: 0,
      avatar: "bg-[#4a3424]",
    },
    {
      id: 2,
      user: "kutik",
      time: "5m ago",
      text: "Hey, hardworking guys! How are you?",
      likes: 0,
      avatar: "bg-gradient-to-br from-green-400 to-emerald-600",
    },
    {
      id: 3,
      user: "Blue31",
      time: "9m ago",
      text: "Please help just one",
      likes: 0,
      avatar: "bg-blue-900 border border-red-500",
    },
    {
      id: 4,
      user: "Pizzard",
      time: "11m ago",
      text: "Никто не играет рынком, просто трейдеры сами не знают куда и что пойдёт и прыгают из стороны в сторону, а дяди с деньгами выцепляют неуверенных людей. Но факт остаётся фактом - перекаты в другую сторону это норма, но когда идёт задержка polymarket это уже не нормально, они судят по заполнения скана да/нет куда пойдёт цена, хотя эти данные часто приходят с задержкой так как если вливают много в нет, транзакции долго обрабатываются, что мы и получаем на выхо...",
      likes: 0,
      hasReadMore: true,
      avatar: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="w-full mt-6 md:mt-10 backdrop-blur-md rounded-3xl flex flex-col relative shrink-0">
      {/* Header Tabs */}
      <div className="flex gap-4 md:gap-6 text-base md:text-xl font-semibold mb-4 md:mb-5 overflow-x-auto scrollbar-none whitespace-nowrap">
        <span
          onClick={() => setActiveTab("comments")}
          className={`cursor-pointer transition-colors ${
            activeTab === "comments"
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Comments (66,266)
        </span>
        <span
          onClick={() => setActiveTab("logs")}
          className={`cursor-pointer transition-colors ${
            activeTab === "logs"
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Logs
        </span>
      </div>

      {activeTab === "comments" ? (
        <>
          {/* Input Box */}
          <div className="relative w-full flex items-center bg-zinc-50 dark:bg-[#18181b] border border-foreground/10 rounded-xl p-1 md:p-2 mb-4 md:mb-5 transition-colors">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent px-3 text-xs md:text-sm outline-none dark:text-zinc-200 text-zinc-900 placeholder:text-zinc-500"
            />
            <div className="flex items-center gap-2 md:gap-3 pr-1 text-zinc-400">
              <Smile className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
              <button className="bg-primary hover:bg-primary/90 cursor-pointer transition-colors text-white px-3 md:px-5 py-1.5 rounded-lg text-[10px] md:text-sm font-semibold ml-1 md:ml-2">
                Post
              </button>
            </div>
          </div>

          {/* Filters & Warning */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 md:mb-6 text-sm">
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-3 py-1.5 rounded-full border dark:border-white/5 border-black/5">
              <Shield className="w-3.5 h-3.5" /> Beware of external links.
            </div>
          </div>

          {/* Comments List */}
          <div className="flex flex-col gap-4 md:gap-6 overflow-y-auto pr-2 pb-10 min-h-[400px] max-h-[400px] scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {MOCK_COMMENTS.map((c) => (
              <div key={c.id} className="flex gap-2 md:gap-3">
                <div
                  className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex-shrink-0 shadow-sm ${c.avatar}`}
                />
                <div className="flex-1 flex flex-col group pt-0.5">
                  <div className="flex justify-between items-start md:items-center mb-0.5 md:mb-1 relative">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-200">
                        {c.user}
                      </span>
                      <span className="text-[10px] md:text-xs text-zinc-500">
                        {c.time}
                      </span>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-zinc-400 dark:text-zinc-500 md:opacity-0 md:group-hover:opacity-100 cursor-pointer transition-opacity absolute right-0" />
                  </div>
                  <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pr-4 md:pr-6">
                    {c.text}
                  </p>
                  {c.hasReadMore && (
                    <span className="text-[10px] md:text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer mt-1 transition-colors">
                      Read more
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 md:mt-2.5 text-zinc-500 hover:text-red-500 cursor-pointer transition-colors w-fit">
                    <Heart className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-[10px] md:text-xs">{c.likes}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Back to top button */}
            <div className="flex justify-center mt-2 mb-2">
              <button className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-zinc-600 dark:text-zinc-300 transition-colors">
                Back to top <ArrowUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6 overflow-y-auto min-h-[400px] pb-10 max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {logs.length === 0 ? (
            <div className="text-zinc-500 italic p-4 text-center text-sm">
              No logs recorded yet.
            </div>
          ) : (
            [...logs].reverse().map((log, index) => (
              <div key={index} className="flex gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full flex-shrink-0 bg-primary flex items-center justify-center text-white">
                  <Image
                    src="logo/AutoBattle-logo.svg"
                    alt="Logo"
                    width={15}
                    height={15}
                    className="brightness-0 invert w-3 md:w-4"
                  />
                </div>
                <div className="flex-1 flex flex-col group pt-0.5">
                  <div className="flex justify-between items-start md:items-center mb-0.5 md:mb-1 relative">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-200">
                        {log.role === "red"
                          ? gameState?.red?.name
                          : log.role === "blue"
                            ? gameState?.blue?.name
                            : "System"}
                      </span>
                      <span className="text-[10px] md:text-xs text-zinc-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pr-4 md:pr-6">
                    {log.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
