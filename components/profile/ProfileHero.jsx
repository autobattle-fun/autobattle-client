"use client";

import Image from "next/image";
import { ArrowUpDown, Copy } from "lucide-react";
import { trimWalletAddress } from "@/lib/wallet";
import Avatar from "boring-avatars";
import { toast } from "sonner";
import { useState } from "react";
import { formatNumber } from "@/lib/format";

export function ProfileHero({ user, metadata }) {
  const walletAddress = user?.walletAddress || "";
  const username = user?.username || "username";
  const shortWallet = walletAddress
    ? trimWalletAddress(walletAddress)
    : "0x1234...5678";
  const [currentShow, setCurrentShow] = useState("AUTO");

  return (
    <div className="mb-3 h-72 min-h-72 w-full rounded-4xl border border-border/50 bg-primary p-10 shadow-none">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold text-white opacity-50">Balance</p>
          <div className="text-4xl font-semibold text-white flex items-center">
            <p>
              {currentShow === "AUTO"
                ? formatNumber(metadata?.splTokenBalance, 4) || 0
                : formatNumber(metadata?.solBalance, 4) || 0}{" "}
              {currentShow === "AUTO" ? "$AUTO" : "SOL"}
            </p>
            <ArrowUpDown
              className="h-5 w-5 text-white opacity-50 cursor-pointer mx-2"
              onClick={() =>
                setCurrentShow(currentShow === "AUTO" ? "SOL" : "AUTO")
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-white opacity-50">
              {shortWallet}
            </p>
            <Copy
              className="h-4 w-4 text-white opacity-50 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
                toast.success("Wallet address copied to clipboard");
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar name={username} size={32} />
            <p
              className="text-base font-semibold text-white opacity-50 hover:opacity-70 cursor-pointer transition-all duration-200 ease-in-out"
              onClick={() => {
                navigator.clipboard.writeText(
                  "autobattle.fun/profile/" + username,
                );
                toast.success("Profile URL copied to clipboard");
              }}
            >
              autobattle.fun/profile/
              {username?.length > 20 ? username.slice(0, 20) + "..." : username}
            </p>
          </div>

          <Image
            src="/logo/Autobattle-logo.svg"
            width={30}
            height={30}
            alt="Autobattle.fun"
            className="brightness-0 invert"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
