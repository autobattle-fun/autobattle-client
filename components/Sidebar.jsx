"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  Gamepad2,
  User,
  Clock,
  Settings,
  Trophy,
  Ellipsis,
} from "lucide-react";
import Image from "next/image";

// Shared sub-menu items for both desktop and mobile
const moreSubItems = [
  { href: "/games", icon: Gamepad2, label: "Games" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
];

// 1. Desktop Sidebar Component
function DesktopSidebar({ isAuthenticated, pathname }) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const publicLinks = [
    { href: "/", icon: Radio, label: "Live" },
    { href: "/history", icon: Clock, label: "History" },
  ];

  const privateLinks = [{ href: "/profile", icon: User, label: "Profile" }];

  const links = isAuthenticated
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  const isMoreActive = moreSubItems.some((item) => pathname === item.href);

  return (
    <aside className="hidden md:flex w-20 h-screen bg-background flex-col border-r border-border items-center justify-center py-6 shrink-0 z-20">
      <Link href="/">
        <Image
          src="/logo/Autobattle-logo.svg"
          width={30}
          height={30}
          alt="Autobattle.fun"
          className="mb-10"
          loading="eager"
        />
      </Link>

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

        {/* Desktop "More" Menu Button */}
        <div className="relative w-full flex flex-col items-center">
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center relative w-full justify-center gap-1 p-2 px-0 rounded-xl transition-colors ${
              isMoreActive || isMoreOpen
                ? "text-primary"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Ellipsis className="w-5 h-5" />
            <span className="text-xs font-bold">More</span>

            <div
              className={`absolute top-1 right-0 w-2 h-[80%] bg-primary rounded-full rounded-r-none ${isMoreActive ? "block" : "hidden"}`}
            ></div>
          </button>

          {/* Desktop "More" Popover */}
          {isMoreOpen && (
            <>
              {/* Invisible overlay to close on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMoreOpen(false)}
              />
              <div className="absolute left-full top-0 ml-2 bg-background border border-border p-3 rounded-xl z-50 flex flex-col gap-3 shadow-lg w-40">
                {moreSubItems.map((sub) => {
                  const isSubActive = pathname === sub.href;
                  const SubIcon = sub.icon;
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        isSubActive
                          ? "bg-primary/10 text-primary"
                          : "text-text-muted hover:bg-border hover:text-text-main"
                      }`}
                    >
                      <SubIcon className="w-5 h-5" />
                      <span className="text-sm font-semibold">{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </nav>

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
    </aside>
  );
}

// 2. Mobile Sidebar (Bottom Nav) Component
function MobileSidebar({ isAuthenticated, pathname }) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const publicLinks = [
    { href: "/", icon: Radio, label: "Live" },
    { href: "/history", icon: Clock, label: "History" },
  ];

  const privateLinks = [{ href: "/profile", icon: User, label: "Profile" }];
  const settingsLink = { href: "/settings", icon: Settings, label: "Settings" };

  const links = isAuthenticated
    ? [...publicLinks, ...privateLinks, settingsLink]
    : [...publicLinks, settingsLink];

  const isMoreActive = moreSubItems.some((item) => pathname === item.href);

  return (
    <aside className="flex md:hidden w-full h-[72px] bg-background flex-row border-t border-border items-center justify-between shrink-0 z-50 pb-safe">
      <nav className="flex flex-row w-full h-full">
        {/* Render half the links before the "More" button so it's somewhat centered */}
        {links.slice(0, 2).map((link) => {
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

              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-primary rounded-b-sm" />
              )}
            </Link>
          );
        })}

        {/* Mobile "More" Menu Button */}
        <div className="flex flex-col items-center relative justify-center flex-1 h-full">
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center relative justify-center w-full h-full gap-1 transition-colors ${
              isMoreActive || isMoreOpen
                ? "text-primary"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Ellipsis className="w-5 h-5" />
            <span className="text-[10px] font-bold">More</span>

            {isMoreActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-primary rounded-b-sm" />
            )}
          </button>

          {/* Mobile "More" Popover */}
          {isMoreOpen && (
            <>
              {/* Invisible overlay */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMoreOpen(false)}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-background border border-border p-3 rounded-xl z-50 flex flex-col gap-3 shadow-lg w-48">
                {moreSubItems.map((sub) => {
                  const isSubActive = pathname === sub.href;
                  const SubIcon = sub.icon;
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        isSubActive
                          ? "bg-primary/10 text-primary"
                          : "text-text-muted hover:bg-border hover:text-text-main"
                      }`}
                    >
                      <SubIcon className="w-5 h-5" />
                      <span className="text-sm font-semibold">{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Render remaining links after the "More" button */}
        {links.slice(2).map((link) => {
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
