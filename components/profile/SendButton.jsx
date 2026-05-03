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
import { Loader2, ArrowUp, Wallet } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import useShares from "@/hooks/useShares";
import Image from "next/image";

export default function SendButton() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const metadata = useUserStore((state) => state.metadata);
  const { transferTokens } = useShares();

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
    }
  };

  // --- Helper variables for balance logic ---
  const currentSplBalance = Number(metadata?.splTokenBalance || 0);
  const numericAmount = Number(amount || 0);

  // --- Dynamic Validation Logic ---
  let isError = false;
  let errorMessage = "";

  if (numericAmount > currentSplBalance) {
    isError = true;
    errorMessage = "Insufficient Balance";
  } else if (
    recipient.length > 0 &&
    (recipient.length < 32 || recipient.length > 44)
  ) {
    // Basic Solana address length validation
    isError = true;
    errorMessage = "Invalid Address";
  }

  // Disable submit if loading, empty, zero, error, or no recipient
  const isSubmitDisabled =
    isLoading ||
    isError ||
    numericAmount <= 0 ||
    amount === "" ||
    recipient.length === 0;

  const handleSend = async () => {
    if (isSubmitDisabled) return;
    const res = await transferTokens(recipient, amount, setIsLoading);

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
            Send $AUTO
          </DialogTitle>
          <DialogDescription className="text-sm -mt-1 text-muted-foreground font-semibold opacity-60">
            Transfer tokens instantly and gas-free.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-4 py-4 mb-3 mt-2">
          {/* Balance Display */}
          <div className="flex items-center gap-4 p-4 bg-element border border-text-muted/30 rounded-2xl">
            <Image
              src="/logo/Autobattle-logo.svg"
              width={32}
              height={32}
              alt="Autobattle.fun"
              className="ml-1.5"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-2xl leading-tight">
                {currentSplBalance || 0} $AUTO
              </span>
              <span className="text-sm text-muted-foreground font-semibold opacity-50">
                Your $AUTO Balance
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
              onClick={() => setAmount(String(currentSplBalance))}
              className="rounded-md w-fit font-semibold p-2 py-1 text-foreground/70 cursor-pointer border border-foreground/40 hover:bg-foreground/10 transition-all text-xs"
            >
              MAX
            </button>
          </div>

          {/* Transparent Auto-Scaling Amount Input (Matches BuyButton) */}
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
            <span className="text-lg font-semibold h-full mt-2">$AUTO</span>
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
                  Confirm Send <ArrowUp className="w-6 h-6" />
                </div>
              )}
            </div>
          </button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
