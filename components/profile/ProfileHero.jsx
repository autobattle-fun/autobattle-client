import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CopyWalletAddressButton } from "@/components/client/CopyWalletAddressButton";
import { trimWalletAddress } from "@/lib/wallet";

function StatTile({ label, children }) {
  return (
    <Card className="rounded-[22px] border-white/10 bg-white/5 p-4 shadow-none">
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-white">{children}</div>
    </Card>
  );
}

export function ProfileHero({ profile }) {
  const walletAddress = profile?.walletAddress || "";

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(135,84,255,0.2),transparent_38%),linear-gradient(180deg,rgba(15,18,30,1),rgba(9,11,20,1))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:p-8">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
            Authenticated profile
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            {profile?.username || "anonymous"}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/65">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              {profile?.privyUserId || "Privy account verified"}
            </span>
          </div>
        </div>

        <Image
          src="/logo/Autobattle-logo.svg"
          width={36}
          height={36}
          alt="Autobattle.fun"
          className="brightness-0 invert"
          loading="eager"
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Wallet">
          <div className="flex items-center justify-between gap-2">
            <span>{trimWalletAddress(walletAddress)}</span>
            <CopyWalletAddressButton walletAddress={walletAddress} />
          </div>
        </StatTile>

        <StatTile label="Status">{profile?.status || "active"}</StatTile>

        <StatTile label="Email">{profile?.email || "not linked"}</StatTile>

        <StatTile label="Onboarded">
          {profile?.createdAt
            ? new Date(profile.createdAt).toLocaleDateString()
            : "now"}
        </StatTile>

        <StatTile label="Source">{profile?.authProvider || "Privy"}</StatTile>
      </div>
    </section>
  );
}
