"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export function RootShell({ children, initialLoggedIn = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);

  const isLoginRoute = pathname === "/login";
  const showShell = !isLoginRoute;

  useEffect(() => {
    let cancelled = false;

    async function syncAuthState() {
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (cancelled) {
          return;
        }

        setIsLoggedIn(response.ok);
      } catch {
        if (!cancelled) {
          setIsLoggedIn(false);
        }
      }
    }

    syncAuthState();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    function onAuthChanged(event) {
      setIsLoggedIn(Boolean(event?.detail?.isAuthenticated));
    }

    window.addEventListener("autobattle-auth-changed", onAuthChanged);

    return () => {
      window.removeEventListener("autobattle-auth-changed", onAuthChanged);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && isLoginRoute) {
      router.replace("/");
    }
  }, [isLoggedIn, isLoginRoute, router]);

  if (!showShell) {
    return children;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isAuthenticated={isLoggedIn} />
      <div className="relative flex h-full flex-1 flex-col overflow-hidden">
        <Header isAuthenticated={isLoggedIn} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
