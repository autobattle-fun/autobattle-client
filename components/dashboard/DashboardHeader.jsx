"use client";

import { Shield, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Arena", href: "/dashboard" },
    { name: "Leaderboard", href: "/dashboard/leaderboard" },
    { name: "History", href: "/dashboard/history" },
  ];

  return (
    <header className="h-16 border-b border-white/10 bg-surface/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20 relative">
      <div className="flex items-center gap-8 h-full">
        <Link href="/" className="flex items-center gap-2 group">
          <Shield className="w-6 h-6 text-primary group-hover:text-emerald transition-colors" />
          <span className="font-mono font-bold text-xl tracking-tighter">
            AUTO<span className="text-emerald">BATTLE</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-mono text-sm h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`h-full flex items-center border-b-2 transition-colors ${isActive ? "text-emerald border-emerald" : "text-gray-400 border-transparent hover:text-white"}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-white/10 rounded-full font-mono text-xs">
          <span className="text-gray-400">Balance:</span>
          <span className="text-emerald font-bold">12,450 ABT</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:text-white"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald rounded-full"></span>
        </Button>

        <Link
          href="/dashboard/profile"
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${pathname === "/dashboard/profile" ? "bg-emerald/20 border-emerald text-emerald" : "bg-primary/20 border-primary/50 text-primary hover:border-emerald"}`}
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
