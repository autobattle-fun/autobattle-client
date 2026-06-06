"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, CalendarDays, Bot } from "lucide-react";

const tabs = [
  {
    label: "Current Week",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Last Week",
    href: "/leaderboard/last-week",
    icon: CalendarDays,
  },
  {
    label: "Agents",
    href: "/leaderboard/agents",
    icon: Bot,
  },
];

export default function LeaderboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center pb-12 pt-8 px-4">
      {/* Page Header */}
      <div className="w-full mb-6">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-2">
          Leaderboard
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Top performers across the arena
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="w-full mb-6">
        <div className="flex w-full rounded-2xl bg-element border border-border/50 p-1.5 gap-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center justify-center gap-2 flex-1 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-text-muted hover:text-text-main hover:bg-element-hover"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.label === "Current Week"
                    ? "This Week"
                    : tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {children}
    </div>
  );
}
