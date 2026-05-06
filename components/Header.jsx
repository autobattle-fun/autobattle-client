"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Plus, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";
import Avatar from "boring-avatars";
import ReadyToEarnDialog from "./dialog/ReadyToEarnDialog";
import { useOpenfort } from "@openfort/react";
import { useUserStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";
import { formatNumber } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const router = useRouter();
  const { logout } = useOpenfort();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const splBalance = useUserStore(
    (state) => state.metadata?.splTokenBalance || 0,
  );
  const solBalance = useUserStore((state) => state.metadata?.solBalance || 0);
  const isLoadingUser = useUserStore((state) => state.isLoadingUser);
  const username = useUserStore((state) => state.user?.username || "");
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    function onClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.dispatchEvent(
        new CustomEvent("autobattle-auth-changed", {
          detail: { isAuthenticated: false },
        }),
      );
      setIsMenuOpen(false);
      router.push("/login");
    }
  }

  return (
    <header className="h-16 md:h-20 flex items-center justify-between px-3 md:px-8 w-full shrink-0 bg-background/80 backdrop-blur-md z-[50] border-b border-border md:border-none gap-2 md:gap-4">
      {/* 1. LEFT: Mobile Logo / Desktop Spacer */}
      {/* On mobile: Shrink to fit logo. On desktop: flex-1 to push search to exact center */}
      <div className="flex shrink-0 md:flex-1 items-center justify-start min-w-0">
        <Link href="/" className="md:hidden flex items-center shrink-0">
          <Image
            src="/logo/Autobattle-logo.svg"
            width={25}
            height={25}
            alt="Autobattle.fun"
            className="shrink-0"
          />
        </Link>
      </div>

      {/* 2. CENTER: Search Bar */}
      {/* On mobile: flex-1 (fills all remaining space). On desktop: fixed max-width */}
      <div className="flex-1 md:w-full md:max-w-md shrink flex justify-center min-w-0">
        <div className="relative flex items-center w-full border border-border shadow-inner h-9 md:h-10 rounded-full bg-element px-3 md:px-4 transition-colors focus-within:bg-surface focus-within:ring-1 focus-within:ring-border min-w-0">
          <Search className="w-4 h-4 text-text-muted mr-2 shrink-0" />
          <Input
            type="text"
            aria-label="Search by address or name"
            placeholder="Search..."
            className="h-auto bg-transparent px-0 py-0 text-sm shadow-none border-0 focus-visible:ring-0! w-full min-w-0 truncate"
          />
        </div>
      </div>

      {/* 3. RIGHT: Actions */}
      {/* On mobile: Shrink to fit avatar. On desktop: flex-1 to balance the left side */}
      <div className="flex shrink-0 md:flex-1 items-center gap-2 md:gap-3 justify-end min-w-0">
        {user && (
          <div className="hidden sm:block">
            <ReadyToEarnDialog
              autoBalance={splBalance}
              solBalance={solBalance}
            />
          </div>
        )}

        <ThemeToggle className="bg-element hover:bg-element-hover border border-border shadow-inner hidden lg:flex" />

        {user ? (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-border bg-element p-1 md:px-2 md:py-1.5 transition-colors hover:bg-element-hover"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label="Open profile menu"
            >
              <Avatar name={username} size={24} className="shrink-0" />

              <div className="hidden xl:flex items-center gap-2">
                <div className="max-w-24 truncate text-sm font-semibold text-text-main">
                  {splBalance ? formatNumber(splBalance, 2) : 0} $AUTO
                </div>
                <div className="border-r border-foreground/40 h-3 border-dashed w-px shrink-0"></div>
                <div className="max-w-24 truncate text-sm font-semibold text-text-main pr-1">
                  {solBalance ? formatNumber(solBalance, 2) : 0} SOL
                </div>
              </div>
            </button>

            {isMenuOpen ? (
              <div className="absolute right-0 top-12 z-99 w-48 md:min-w-44 rounded-2xl border border-border bg-surface p-1.5 shadow-lg">
                <div className="flex flex-col xl:hidden px-3 py-2 border-b border-border/50 mb-1 gap-1">
                  <div className="text-xs text-text-muted">Balances</div>
                  <div className="text-sm font-bold text-text-main">
                    {splBalance ? formatNumber(splBalance, 2) : 0} $AUTO
                  </div>
                  <div className="text-sm font-bold text-text-main">
                    {solBalance ? formatNumber(solBalance, 2) : 0} SOL
                  </div>
                </div>

                <button
                  type="button"
                  className="flex w-full items-center font-semibold gap-2 rounded-xl px-3 py-2 text-sm text-text-main opacity-80 transition-colors hover:bg-element"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/profile");
                  }}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 font-semibold rounded-xl px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <Button
            className="flex items-center gap-1.5 font-semibold py-1 px-3 md:px-4 rounded-full transition-all! hover:scale-105 duration-200 cursor-pointer text-xs md:text-sm shrink-0"
            onClick={() => router.push("/login")}
          >
            {isLoadingUser ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Sign In
              </>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
