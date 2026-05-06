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
import { Loader2, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useMarketStore } from "@/store/marketStore";
import { useUserStore } from "@/store/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import useShares from "@/hooks/useShares";
import { toast } from "sonner";
import { formatNumber } from "@/lib/format";

export default function BuyButton({
  candidate,
  price,
  color,
  market,
  isRound,
}) {
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isYes = color === "red";
  const user = useUserStore((state) => state.user);

  const isLoadingMainShares = useMarketStore(
    (state) => state.isLoadingMainShares,
  );
  const isLoadingRoundShares = useMarketStore(
    (state) => state.isLoadingRoundShares,
  );
  const mainShares = useMarketStore((state) => state.mainShares);
  const roundShares = useMarketStore((state) => state.roundShares);
  const metadata = useUserStore((state) => state.metadata);
  const isLoadingMetadata = useUserStore((state) => state.isLoadingMetadata);
  const { buyShares, sellShares } = useShares();

  const handleAmount = (value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleModeSwitch = (newMode) => {
    if (mode === newMode) return;
    if (isLoading) return;
    setMode(newMode);
    setAmount("");
  };

  const addAmount = (val) => {
    if (isLoading) return;
    setAmount((prev) => (Number(prev || 0) + val).toString());
  };

  const handleDialogOpenChange = (open) => {
    if (open === true && !user) {
      toast.error("Login to Start Earning");
      return;
    }

    if (isLoading) return;
    setIsDialogOpen(open);
  };

  // --- NEW: Helper variables to clean up balance logic ---
  const currentSplBalance = Number(metadata?.splTokenBalance || 0);
  const currentShareBalance =
    Number(
      isRound
        ? isYes
          ? roundShares?.yesShares
          : roundShares?.noShares
        : isYes
          ? mainShares?.yesShares
          : mainShares?.noShares,
    ) || 0;

  // --- NEW: Dynamic Validation Logic ---
  const numericAmount = Number(amount || 0);
  let isError = false;
  let errorMessage = "";

  if (mode === "buy") {
    if (numericAmount > 7200000) {
      isError = true;
      errorMessage = "Exceeds Max Buy Limit";
    } else if (numericAmount > currentSplBalance) {
      isError = true;
      errorMessage = "Insufficient $AUTO Balance";
    }
  } else if (mode === "sell") {
    if (numericAmount > currentShareBalance) {
      isError = true;
      errorMessage = "Insufficient Shares";
    }
  }

  // Disable submit if loading, empty, zero, or error
  const isSubmitDisabled =
    isLoading || isError || numericAmount <= 0 || amount === "";

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
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
                isLoadingMetadata ? (
                  <Skeleton className="w-10 h-2 rounded" />
                ) : (
                  <div className="text-sm h-2 font-semibold opacity-50">
                    {formatNumber(currentSplBalance, 2)} $AUTO
                  </div>
                )
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
                (isRound ? isLoadingRoundShares : isLoadingMainShares) ? (
                  <Skeleton className="w-10 h-2 rounded" />
                ) : (
                  <div className="text-sm h-2 font-semibold opacity-50">
                    {formatNumber(currentShareBalance, 2)} Shares
                  </div>
                )
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

              <div className="w-[80%] mx-auto border-t-2 border-foreground/20 border-dashed mt-2"></div>

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
                <TriangleAlert className="w-3.5 h-3.5" /> Max Buy is 7,200,000
                $AUTO
              </div>
            </>
          )}

          {mode === "sell" && (
            <>
              {" "}
              <button
                onClick={() => setAmount(String(currentShareBalance))}
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
              "flex-1 rounded-xl md:rounded-2xl pb-[4px] group bg-primary/70",
              isSubmitDisabled
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer",
            )}
            disabled={isSubmitDisabled}
            onClick={() => {
              if (mode === "buy") {
                buyShares(
                  market?.id,
                  isYes ? "YES" : "NO",
                  amount,
                  isRound,
                  setIsLoading,
                );
              } else {
                sellShares(
                  market?.id,
                  isYes ? "YES" : "NO",
                  amount,
                  isRound,
                  setIsLoading,
                );
              }
            }}
          >
            <div
              className={cn(
                "h-full rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 ease-out bg-primary",
                !isSubmitDisabled &&
                  "group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]",
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2 text-2xl text-white font-bold tracking-tighter">
                  <Loader2
                    className="w-6 h-6 text-white animate-spin"
                    strokeWidth={2.5}
                  />
                  {mode === "buy" ? "Buying" : "Selling"}...
                </div>
              ) : isError ? (
                <div className="text-xl md:text-2xl text-white font-bold tracking-tighter">
                  {errorMessage}
                </div>
              ) : (
                <div className="text-2xl text-white font-bold tracking-tighter">
                  {mode === "buy" ? "Buy" : "Sell"} @ {price}/Share
                </div>
              )}
            </div>
          </button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
