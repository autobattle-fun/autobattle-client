"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Copy, Calendar } from "lucide-react";

export function PredictionHeader({ market, createdAt }) {
  const marketId = market?.id || "";
  const title = market?.title || "Market Title";

  return (
    <div className="mb-3 h-72 w-full rounded-4xl border border-border/50 bg-primary p-10 shadow-none">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold text-white opacity-50">Market</p>
          <p className="text-3xl font-bold text-white leading-tight">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-white opacity-50">
              ID: {marketId.slice(0, 12)}...
            </p>
            <Copy
              className="h-4 w-4 text-white opacity-50 cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => {
                navigator.clipboard.writeText(marketId);
                toast.success("Market ID copied");
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white opacity-50" />
            <p className="text-base font-semibold text-white opacity-50">
              Placed on {new Date(createdAt).toLocaleDateString()}
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
