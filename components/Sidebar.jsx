"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Gamepad2, User, Clock, Settings } from "lucide-react";
import Image from "next/image";

// 1. Desktop Sidebar Component (Exact match to your original design)
function DesktopSidebar({ isAuthenticated, pathname }) {
  const publicLinks = [
    { href: "/", icon: Radio, label: "Live" },
    { href: "/games", icon: Gamepad2, label: "Games" },
    { href: "/history", icon: Clock, label: "History" },
  ];

  const privateLinks = [{ href: "/profile", icon: User, label: "Profile" }];

  const links = isAuthenticated
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  return (
    <aside className="hidden md:flex w-20 h-screen bg-background flex-col border-r border-border items-center justify-center py-6 shrink-0 z-20">
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

      {isAuthenticated ? (
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
            <span className="text-[10px] font-semibold">Settings</span>

            <div
              className={`absolute top-1 right-0 w-2 h-[80%] bg-primary rounded-full rounded-r-none ${pathname === "/settings" ? "block" : "hidden"}`}
            ></div>
          </Link>
        </div>
      ) : null}
    </aside>
  );
}

// 2. Mobile Sidebar (Bottom Nav) Component
function MobileSidebar({ isAuthenticated, pathname }) {
  const publicLinks = [
    { href: "/", icon: Radio, label: "Live" },
    { href: "/games", icon: Gamepad2, label: "Games" },
    { href: "/history", icon: Clock, label: "History" },
  ];

  // For mobile, we append Settings directly into the array so it flexes inline
  const privateLinks = [
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  const links = isAuthenticated
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  return (
    <aside className="flex md:hidden w-full h-[72px] bg-background flex-row border-t border-border items-center justify-between shrink-0 z-20 pb-safe">
      <nav className="flex flex-row w-full h-full">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center relative justify-center gap-1 flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{link.label}</span>

              {/* Mobile Active Indicator - Top flush horizontal bar */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-primary rounded-b-sm" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// 3. Main Export Wrapper
export function Sidebar({ isAuthenticated = false }) {
  const pathname = usePathname();

  return (
    <>
      <DesktopSidebar isAuthenticated={isAuthenticated} pathname={pathname} />
      <MobileSidebar isAuthenticated={isAuthenticated} pathname={pathname} />
    </>
  );
}
