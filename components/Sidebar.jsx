"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Radio, Gamepad2, User, Clock, Settings } from "lucide-react";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", icon: Radio, label: "Live" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/games", icon: Gamepad2, label: "Games" },
    { href: "/history", icon: Clock, label: "History" },
  ];

  return (
    <aside className="w-20 h-screen bg-background flex flex-col border-r border-border items-center justify-center py-6 shrink-0 z-20">
      <Image
        src="/logo/Autobattle-logo.svg"
        width={30}
        height={30}
        alt="Autobattle.fun"
        className="mb-10"
        loading="eager"
      />

      {/* Navigation Links */}
      <nav className="flex flex-1 justify-center flex-col gap-4 w-full">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center relative justify-center gap-1 p-2 px-0 rounded-xl transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-bold">{link.label}</span>

              <div
                className={`absolute top-1 right-0 w-2 h-[80%] bg-primary rounded-full rounded-r-none ${isActive ? "block" : "hidden"}`}
              ></div>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="mt-auto w-full">
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center relative gap-1 p-2 px-0 w-full rounded-xl transition-colors ${
            pathname === "/settings"
              ? "text-primary"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>

          <div
            className={`absolute top-1 right-0 w-2 h-[80%] bg-primary rounded-full rounded-r-none ${pathname === "/settings" ? "block" : "hidden"}`}
          ></div>
        </Link>
      </div>
    </aside>
  );
}
