"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Plus, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";
import { useLogout } from "@privy-io/react-auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

export function Header({ isAuthenticated = false }) {
  const router = useRouter();
  const { logout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      if (!isAuthenticated) {
        setUsername("");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok || cancelled) {
          return;
        }

        const payload = await response.json();

        if (!cancelled) {
          setUsername(payload?.user?.username || "");
        }
      } catch {
        if (!cancelled) {
          setUsername("");
        }
      }
    }

    loadMe();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

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
      // Call backend to clear session
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Notify app of logout
      window.dispatchEvent(
        new CustomEvent("autobattle-auth-changed", {
          detail: { isAuthenticated: false },
        }),
      );
      setIsMenuOpen(false);
      // Redirect to login
      router.push("/login");
    }
  }

  const avatarLetter = (username || "A").charAt(0).toUpperCase();

  return (
    <header className="h-20 flex items-center justify-between px-8 w-full shrink-0 relative">
      {/* Search Bar */}
      <div className="max-w-xl w-full flex justify-center mx-auto absolute left-1/2 -translate-x-1/2">
        <div className="relative flex items-center w-full border border-border shadow-inner max-w-md h-10 rounded-full bg-element px-4 transition-colors focus-within:bg-surface focus-within:ring-1 focus-within:ring-border">
          <Search className="w-4 h-4 text-text-muted mr-2" />
          <Input
            type="text"
            aria-label="Search by address or name"
            placeholder="Search by address or name"
            className="h-auto bg-transparent px-0 py-0 text-sm shadow-none border-0 focus-visible:ring-0!"
          />
        </div>
      </div>

      <div />

      <div className="flex items-center gap-3">
        <ThemeToggle className="bg-element hover:bg-element-hover border border-border shadow-inner" />
        {/* <Button
          variant="secondary"
          size="icon"
          className="bg-element hover:bg-element-hover"
        >
          <Mail className="w-4 h-4 text-text-main" />
        </Button> */}
        {/* <Button
          variant="secondary"
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/10" />
          </div>
          <span className="text-sm font-medium">$0.00</span>
        </Button> */}

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-border bg-element px-2 py-1.5 transition-colors hover:bg-element-hover"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label="Open profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {avatarLetter}
              </div>
              <div className="max-w-28 truncate text-sm font-semibold text-text-main">
                {username || "Profile"}
              </div>
            </button>

            {isMenuOpen ? (
              <div className="absolute right-0 top-12 z-50 min-w-44 rounded-2xl border border-border bg-surface p-1.5 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-main transition-colors hover:bg-element"
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
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
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
            className="flex items-center gap-2 font-semibold py-1 rounded-full transition-all! hover:scale-105 duration-200 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            <Plus className="w-4 h-4" />
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
