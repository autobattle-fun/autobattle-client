"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyWalletAddressButton({
  walletAddress,
  compact = false,
  className,
}) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    if (!walletAddress) {
      return;
    }

    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className={cn(
        compact
          ? "h-7 rounded-lg px-2 text-[11px]"
          : "h-8 rounded-xl px-3 text-xs",
        className,
      )}
      onClick={copyAddress}
      disabled={!walletAddress}
    >
      {copied ? (
        <>
          <Check className="mr-1 h-3 w-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="mr-1 h-3 w-3" />
          Copy
        </>
      )}
    </Button>
  );
}
