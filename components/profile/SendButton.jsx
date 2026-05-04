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
import { Loader2, ArrowUp, Send } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import useShares from "@/hooks/useShares";
import Image from "next/image";

export default function SendButton() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [assetType, setAssetType] = useState("AUTO"); // "AUTO" or "SOL"
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const metadata = useUserStore((state) => state.metadata);
  const { transferTokens, transferSol } = useShares(); // <-- Destructure new function

  const handleAmount = (value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleDialogOpenChange = (open) => {
    if (isLoading) return;
    setIsDialogOpen(open);
    if (!open) {
      // Reset state when closed
      setAmount("");
      setRecipient("");
      setAssetType("AUTO");
    }
  };

  // --- Helper variables for balance logic ---
  const currentSplBalance = Number(metadata?.splTokenBalance || 0);
  const currentSolBalance = Number(metadata?.solBalance || 0);
  const numericAmount = Number(amount || 0);

  // Active balance based on selected asset
  const activeBalance =
    assetType === "AUTO" ? currentSplBalance : currentSolBalance;

  // --- Dynamic Validation Logic ---
  let isError = false;
  let errorMessage = "";

  if (numericAmount > activeBalance) {
    isError = true;
    errorMessage = "Insufficient Balance";
  } else if (
    assetType === "SOL" &&
    activeBalance - numericAmount < 0.005 &&
    numericAmount > 0
  ) {
    // Basic safety check to ensure they don't drain their entire SOL wallet
    // and fail to pay the base network fee.
    isError = true;
    errorMessage = "Keep SOL for gas fees";
  } else if (
    recipient.length > 0 &&
    (recipient.length < 32 || recipient.length > 44)
  ) {
    isError = true;
    errorMessage = "Invalid Address";
  }

  const isSubmitDisabled =
    isLoading ||
    isError ||
    numericAmount <= 0 ||
    amount === "" ||
    recipient.length === 0;

  const handleSend = async () => {
    if (isSubmitDisabled) return;

    let res;
    if (assetType === "AUTO") {
      res = await transferTokens(recipient, amount, setIsLoading);
    } else {
      res = await transferSol(recipient, amount, setIsLoading);
    }

    // Close modal on success
    if (res?.success) {
      setIsDialogOpen(false);
      setAmount("");
      setRecipient("");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger
        render={
          <button
            className={cn(
              "flex-1 rounded-xl md:rounded-2xl pb-[4px] group cursor-pointer bg-foreground/30",
            )}
            onClick={() => setIsDialogOpen(true)}
          >
            <div
              className={cn(
                "h-full rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 border border-foreground/30 ease-out bg-background",
                "group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]",
              )}
            >
              <div className="text-xl text-foreground font-bold tracking-tighter flex items-center gap-2">
                <ArrowUp className="w-4 h-4" /> Send
              </div>
            </div>
          </button>
        }
      />

      <DialogPopup
        className="bg-background rounded-4xl! p-3! border-text-muted/30 border max-w-md w-full"
        showCloseButton={false}
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-3xl font-semibold flex items-center gap-2">
            Send Assets
          </DialogTitle>
          <DialogDescription className="text-sm -mt-1 text-muted-foreground font-semibold opacity-60">
            Transfer {assetType} securely to any Solana wallet.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-4 py-4 mb-3 mt-2">
          {/* Asset Type Selector */}
          <div className="flex bg-foreground/5 p-1 rounded-xl">
            <button
              onClick={() => setAssetType("AUTO")}
              className={cn(
                "flex-1 py-2 font-semibold text-sm rounded-lg transition-all",
                assetType === "AUTO"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-foreground/50 hover:text-foreground/80 cursor-pointer",
              )}
            >
              $AUTO Token
            </button>
            <button
              onClick={() => setAssetType("SOL")}
              className={cn(
                "flex-1 py-2 font-semibold text-sm rounded-lg transition-all",
                assetType === "SOL"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-foreground/50 hover:text-foreground/80 cursor-pointer",
              )}
            >
              Native SOL
            </button>
          </div>

          {/* Balance Display */}
          <div className="flex items-center gap-4 p-4 bg-element border border-text-muted/30 rounded-2xl">
            {assetType === "AUTO" ? (
              <Image
                src="/logo/Autobattle-logo.svg"
                width={32}
                height={32}
                alt="Autobattle.fun"
                className="ml-1.5"
              />
            ) : (
              <Image
                src="/logo/SOL-logo.svg"
                width={32}
                height={32}
                alt="SOL"
                className="ml-1.5"
              />
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-2xl leading-tight">
                {activeBalance} {assetType === "AUTO" ? "$AUTO" : "SOL"}
              </span>
              <span className="text-sm text-muted-foreground font-semibold opacity-50">
                Your Balance
              </span>
            </div>
          </div>

          {/* Recipient Input */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-semibold text-foreground/70 ml-1">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="Paste Solana address..."
              value={recipient}
              disabled={isLoading}
              onChange={(e) => setRecipient(e.target.value.trim())}
              className="w-full bg-foreground/5 border border-foreground/20 rounded-xl p-4 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Amount Input Header */}
          <div className="flex justify-between items-end mt-2">
            <label className="text-sm font-semibold text-foreground/70 ml-1">
              Amount
            </label>
            <button
              onClick={() => {
                // If SOL, leave a tiny buffer so they can pay network fee to execute the tx
                const maxVal =
                  assetType === "SOL"
                    ? Math.max(0, currentSolBalance - 0.005)
                    : currentSplBalance;
                setAmount(String(maxVal));
              }}
              className="rounded-md w-fit font-semibold p-2 py-1 text-foreground/70 cursor-pointer border border-foreground/40 hover:bg-foreground/10 transition-all text-xs"
            >
              MAX
            </button>
          </div>

          {/* Transparent Auto-Scaling Amount Input */}
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
              disabled={isLoading}
              className="flex-1 w-full font-semibold h-full focus:outline-none text-right bg-transparent"
            />
            <span className="text-lg font-semibold h-full mt-2">
              {assetType === "AUTO" ? "$AUTO" : "SOL"}
            </span>
          </div>
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
            onClick={handleSend}
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
                  Sending...
                </div>
              ) : isError ? (
                <div className="text-xl md:text-2xl text-white font-bold tracking-tighter">
                  {errorMessage}
                </div>
              ) : (
                <div className="text-2xl text-white font-bold tracking-tighter flex items-center gap-2">
                  Confirm Send <Send className="w-5 h-5 ml-1" />
                </div>
              )}
            </div>
          </button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
