"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyWalletAddressButton({ walletAddress }) {
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
      className="h-8 rounded-xl px-3 text-xs"
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
