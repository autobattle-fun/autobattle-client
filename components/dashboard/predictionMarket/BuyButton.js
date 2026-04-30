"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogPanel,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import Image from "next/image";

export default function BuyButton({ candidate, price, color, market }) {
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState("");

  const handleAmount = (value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleModeSwitch = (newMode) => {
    if (mode === newMode) return;
    setMode(newMode);
    setAmount("");
  };

  const addAmount = (val) => {
    setAmount((prev) => (Number(prev || 0) + val).toString());
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            className={cn(
              "flex-1 rounded-xl md:rounded-2xl pb-[4px] md:pb-[7px] cursor-pointer group",
              color === "red" && "bg-red-500",
              color === "blue" && "bg-blue-500",
            )}
          >
            <div
              className={cn(
                "h-full  rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col items-center transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]",
                color === "red" && "bg-red-400",
                color === "blue" && "bg-blue-400",
              )}
            >
              <div className="text-[10px] md:text-sm text-white font-bold tracking-widest mb-1 md:mb-2 text-center">
                {candidate?.length > 20
                  ? candidate?.slice(0, 20) + "..."
                  : candidate}
              </div>
              <div className="text-xl md:text-3xl text-white font-bold tracking-tighter">
                {price}
              </div>
            </div>
          </button>
        }
      />

      <DialogPopup
        className="bg-background rounded-4xl! p-3! border-text-muted/30 border"
        showCloseButton={false}
      >
        <DialogHeader className={"relative"}>
          <Image
            width={150}
            height={150}
            src={"/logo/Autobattle-logo.svg"}
            alt="autobattle logo"
            className="rounded-lg absolute top-0 right-0 opacity-10"
          />

          <DialogTitle className="text-4xl font-semibold">
            {candidate?.length > 20
              ? candidate?.slice(0, 20) + "..."
              : candidate}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground -mt-1 font-semibold opacity-50">
            {market?.marketIndex === 0 ? (
              <span>will win the match</span>
            ) : (
              <span>will win the round</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-4 py-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-2 flex-1">
              <button
                className={cn(
                  "w-full rounded-xl md:rounded-2xl pb-[4px] cursor-pointer bg-green-500",
                  mode === "sell" && "group",
                )}
                onClick={() => handleModeSwitch("buy")}
              >
                <div
                  className={cn(
                    "h-full  rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px] bg-green-400",
                    mode === "buy" && "bg-green-500",
                  )}
                >
                  <div className="text-2xl text-white font-bold tracking-tighter">
                    Buy
                  </div>
                </div>
              </button>

              {mode === "buy" ? (
                <div className="text-sm h-2 font-semibold opacity-50">
                  4.52 $AUTO
                </div>
              ) : (
                <div className="h-2"></div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 flex-1">
              <button
                className={cn(
                  "w-full rounded-xl md:rounded-2xl pb-[4px] cursor-pointer bg-red-500",
                  mode === "buy" && "group",
                )}
                onClick={() => handleModeSwitch("sell")}
              >
                <div
                  className={cn(
                    "h-full  rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px] bg-red-400",
                    mode === "sell" && "bg-red-500",
                  )}
                >
                  <div className="text-2xl text-white font-bold tracking-tighter">
                    Sell
                  </div>
                </div>
              </button>

              {mode === "sell" ? (
                <div className="text-sm h-2 font-semibold opacity-50">
                  9.2 Shares
                </div>
              ) : (
                <div className="h-2"></div>
              )}
            </div>
          </div>

          <div className="flex flex-row-reverse gap-2 relative overflow-hidden h-24">
            <input
              type="text"
              placeholder="0"
              value={amount}
              onChange={(e) => handleAmount(e.target.value)}
              style={{
                fontSize: `clamp(1.5rem, ${Math.max(1.5, 4.5 - Math.max(0, amount.length - 6) * 0.3)}rem, 4.5rem)`,
                transition: "font-size 0.2s ease",
              }}
              className="flex-1 w-full font-semibold h-full focus:outline-none text-right"
            />
            <span className="text-lg font-semibold h-full mt-2">
              {mode === "buy" ? "$AUTO" : "Shares"}
            </span>
          </div>

          {mode === "buy" && (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addAmount(10)}
                  className="rounded-md font-semibold p-2 py-1 text-foreground/70 cursor-pointer border border-foreground/40 hover:bg-foreground/10 transition-all"
                >
                  +10
                </button>
                <button
                  onClick={() => addAmount(100)}
                  className="rounded-md font-semibold p-2 py-1 text-foreground/70 cursor-pointer border border-foreground/40 hover:bg-foreground/10 transition-all"
                >
                  +100
                </button>
                <button
                  onClick={() => addAmount(1000)}
                  className="rounded-md font-semibold p-2 py-1 text-foreground/70 cursor-pointer border border-foreground/40 hover:bg-foreground/10 transition-all"
                >
                  +1000
                </button>
              </div>

              <div className="w-[80%] mx-auto border-t border-foreground/20 mt-2"></div>

              <div className="flex flex-row-reverse gap-2 relative overflow-hidden h-24">
                <input
                  type="text"
                  disabled
                  value={(
                    amount *
                    (1 / (color === "red" ? market?.yesPrice : market?.noPrice))
                  ).toFixed(2)}
                  style={{
                    fontSize: `clamp(1.5rem, ${Math.max(1.5, 4.5 - Math.max(0, String((amount * (1 / (color === "red" ? market?.yesPrice : market?.noPrice))).toFixed(2)).length - 6) * 0.3)}rem, 4.5rem)`,
                    transition: "font-size 0.2s ease",
                  }}
                  className={cn(
                    "flex-1 w-full font-semibold h-full focus:outline-none text-right",
                    amount ? "text-green-500" : "text-foreground/50",
                  )}
                />
                <span className="text-lg font-semibold h-full mt-2">
                  To Win
                </span>
              </div>

              <div className="w-fit flex items-center gap-2 text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-3 py-1.5 rounded-full border dark:border-white/5 border-black/5">
                <TriangleAlert className="w-3.5 h-3.5" /> Max Buy is 720,000
                $AUTO
              </div>
            </>
          )}

          {mode === "sell" && (
            <>
              {" "}
              <button
                onClick={() => {}}
                className="rounded-md w-fit font-semibold p-2 py-1 text-foreground/70 cursor-pointer border border-foreground/40 hover:bg-foreground/10 transition-all"
              >
                MAX
              </button>
            </>
          )}
        </DialogPanel>

        <DialogFooter variant="bare" className="sm:space-x-0">
          <button
            className={cn(
              "flex-1 rounded-xl md:rounded-2xl pb-[4px] cursor-pointer group bg-primary/70",
            )}
          >
            <div
              className={cn(
                "h-full  rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px] bg-primary",
              )}
            >
              <div className="text-2xl text-white font-bold tracking-tighter">
                {mode === "buy" ? "Buy" : "Sell"} @ {price}/Share
              </div>
            </div>
          </button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
