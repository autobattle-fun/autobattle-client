"use client";

import { useEffect, useState } from "react";
import { ProfileRecentHistory } from "./ProfileRecentHistory";
import { Pagination } from "../ui/pagination";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  const username = useUserStore((state) => state.user?.username);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    const controller = new AbortController();

    async function fetchPredictions() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/predictions/${username}`,
          { signal: controller.signal },
        );
        const data = await res.json();

        if (!cancelled) {
          setPredictions(data.predictions);
          setPagination(data.pagination);
        }
      } catch (error) {
        if (!cancelled && error.name !== "AbortError") {
          console.error("Failed to fetch predictions:", error);
        }
      }
    }

    fetchPredictions();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [username]);

  return (
    <div className="w-full mt-8">
      <ProfileRecentHistory predictions={predictions} />

      {pagination?.total > 10 && (
        <div className="mt-6">
          <Pagination
            currentPage={1}
            totalPages={pagination?.totalPages}
            baseUrl="/profile"
          />
        </div>
      )}

      {predictions?.length > 0 && (
        <Link
          href="/predictions"
          className="mt-4 block text-center text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main transition-colors"
        >
          View Full History ↗
        </Link>
      )}
    </div>
  );
}
