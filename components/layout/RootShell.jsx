"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { API_BASE_URL } from "@/lib/config";
import { useUser } from "@openfort/react";
import { useUserStore } from "@/store/userStore";
import { useMarketStore } from "@/store/marketStore";
import useUserUtil from "@/hooks/useUserUtil";
import { useSolanaEmbeddedWallet } from "@openfort/react/solana";

export function RootShell({ children, initialLoggedIn = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
  const { user, getAccessToken } = useUser();
  const setUser = useUserStore((state) => state.setUser);
  const setMetadata = useUserStore((state) => state.setMetadata);
  const reset = useUserStore((state) => state.reset);
  const setIsLoadingUser = useUserStore((state) => state.setIsLoadingUser);
  const { loadShares } = useUserUtil();
  const market = useMarketStore((state) => state.market);

  const isLoginRoute = pathname === "/login" || pathname === "/verify-login";
  const showShell = !isLoginRoute;

  const { setActive } = useSolanaEmbeddedWallet();

  const fetchUserFromDB = async (isCancelled = false) => {
    try {
      setIsLoadingUser(true);
      const access_token = await getAccessToken();

      if (!access_token) {
        reset();
        setIsLoggedIn(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (isCancelled) return;

      if (!response.ok) {
        reset();
        setIsLoggedIn(false);
        return;
      }

      const payload = await response.json();
      setUser(payload?.user);
      setMetadata(payload?.metadata);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
      if (!isCancelled) {
        reset();
        setIsLoggedIn(false);
      }
    } finally {
      setTimeout(() => {
        setIsLoadingUser(false);
      }, 1000);
    }
  };

  useEffect(() => {
    let cancelled = false;

    if (user?.id) {
      fetchUserFromDB(cancelled);
    } else {
      reset();
      setIsLoggedIn(false);
    }

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    function onAuthChanged(event) {
      if (event?.detail?.isAuthenticated) {
        fetchUserFromDB();
      } else {
        setIsLoggedIn(false);
        reset();
      }
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

  useEffect(() => {
    if (!user?.walletAddress) return;
    setActive({
      address: user?.walletAddress,
    });
  }, [user?.walletAddress]);

  useEffect(() => {
    if (!market?.mainMarket?.id || !user?.id) return;

    loadShares(market?.mainMarket?.id, false);
  }, [market?.mainMarket?.id, user?.id]);

  useEffect(() => {
    if (!market?.roundMarket?.id || !user?.id) return;

    loadShares(market?.roundMarket?.id, true);
  }, [market?.roundMarket?.id, user?.id]);

  if (!showShell) {
    return children;
  }

  return (
    // 👇 CHANGED HERE: flex-col-reverse for Mobile, flex-row for Desktop
    <div className="flex flex-col-reverse md:flex-row h-screen overflow-hidden">
      <Sidebar isAuthenticated={isLoggedIn} />
      <div className="relative flex h-full flex-1 flex-col overflow-hidden">
        <Header isAuthenticated={isLoggedIn} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
