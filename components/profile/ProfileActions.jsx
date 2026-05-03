"use client";

import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ReadyToEarnDialog from "../dialog/ReadyToEarnDialog";
import { useUserStore } from "@/store/userStore";
import SendButton from "./SendButton";

export function ProfileActions() {
  const splBalance = useUserStore(
    (state) => state.metadata?.splTokenBalance || 0,
  );
  return (
    <div className="mb-3 flex w-full gap-3">
      <ReadyToEarnDialog
        autoBalance={splBalance}
        renderElement={
          <button
            className={cn(
              "flex-1 rounded-xl md:rounded-2xl pb-[4px] group bg-primary/70 cursor-pointer",
            )}
          >
            <div
              className={cn(
                "h-full rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 ease-out bg-primary",

                "group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]",
              )}
            >
              <div className="text-xl text-white font-bold tracking-tighter flex items-center gap-2">
                <Image
                  src="/logo/Autobattle-logo.svg"
                  width={15}
                  height={15}
                  alt="Autobattle.fun"
                  className="brightness-0 invert"
                />
                Get $AUTO
              </div>
            </div>
          </button>
        }
      />

      <SendButton />
    </div>
  );
}
