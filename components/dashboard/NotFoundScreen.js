"use client";

import { RefreshCcw } from "lucide-react";
import Image from "next/image";

export default function PauseScreen() {
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full px-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src="/logo/Autobattle-logo.svg"
            alt="Autobattle"
            width={60}
            height={60}
            className=""
          />

          <span className="text-xl md:text-3xl font-black tracking-tight mt-5">
            Server is Down!
          </span>

          <div className="flex-1 bg-zinc-300 dark:bg-zinc-800 rounded-xl md:rounded-2xl pb-[4px] md:pb-[7px] cursor-pointer group mt-5">
            <div className="h-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 py-3 md:py-4 px-6 rounded-xl md:rounded-2xl flex justify-center items-center transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]">
              <div className="font-bold flex items-center gap-2 text-sm md:text-base tracking-wide text-zinc-900 dark:text-zinc-100">
                <RefreshCcw size={20} /> Refresh
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
