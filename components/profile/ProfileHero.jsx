import Image from "next/image";
import { Copy } from "lucide-react";
import { trimWalletAddress } from "@/lib/wallet";

export function ProfileHero({ profile }) {
  const walletAddress = profile?.walletAddress || "";
  const username = profile?.username || "username";
  const shortWallet = walletAddress
    ? trimWalletAddress(walletAddress)
    : "0x1234...5678";

  return (
    <div className="mb-3 h-72 w-full rounded-4xl border border-border/50 bg-primary p-10 shadow-none">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold text-white opacity-50">Balance</p>
          <p className="text-4xl font-semibold text-white">0 $AUTO</p>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-white opacity-50">
              {shortWallet}
            </p>
            <Copy className="h-4 w-4 text-white opacity-50" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-white" />
            <p className="text-base font-semibold text-white opacity-50">
              autobattle.fun/${username}
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
