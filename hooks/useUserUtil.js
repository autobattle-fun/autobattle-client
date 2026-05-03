"use client";

import { API_BASE_URL } from "@/lib/config";
import { useUserStore } from "@/store/userStore";
import { useUser as useOpenfortUser } from "@openfort/react";
import { useMarketStore } from "@/store/marketStore";

export default function useUserUtil() {
  const setMetadata = useUserStore((state) => state.setMetadata);
  const setIsLoadingMetadata = useUserStore(
    (state) => state.setIsLoadingMetadata,
  );
  const reset = useUserStore((state) => state.reset);
  const { getAccessToken } = useOpenfortUser();

  const setMainShares = useMarketStore((state) => state.setMainShares);
  const setRoundShares = useMarketStore((state) => state.setRoundShares);
  const setIsLoadingMainShares = useMarketStore(
    (state) => state.setIsLoadingMainShares,
  );
  const setIsLoadingRoundShares = useMarketStore(
    (state) => state.setIsLoadingRoundShares,
  );

  const loadMetadata = async () => {
    try {
      setIsLoadingMetadata(true);

      const access_token = await getAccessToken();

      if (!access_token) {
        reset();
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

      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      setMetadata(payload?.metadata);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoadingMetadata(false);
      }, 1000);
    }
  };

  const loadShares = async (marketId, isRound = false) => {
    try {
      if (!marketId) {
        if (isRound) {
          setRoundShares(null);
        } else {
          setMainShares(null);
        }
        return;
      }

      if (isRound) {
        setIsLoadingRoundShares(true);
      } else {
        setIsLoadingMainShares(true);
      }

      const access_token = await getAccessToken();

      if (!access_token) {
        reset();
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/trades/my-shares/${marketId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!response.ok) {
        return;
      }

      const payload = await response.json();

      if (isRound) {
        setRoundShares(payload?.data);
      } else {
        setMainShares(payload?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        if (isRound) {
          setIsLoadingRoundShares(false);
        } else {
          setIsLoadingMainShares(false);
        }
      }, 1000);
    }
  };

  return { loadMetadata, loadShares };
}
