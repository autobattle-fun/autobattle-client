"use client";

import { useEffect, useState } from "react";
import { ProfileRecentHistory } from "./ProfileRecentHistory";
import { Pagination } from "../ui/pagination";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";
import { Card } from "../ui/card";

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/predictions/${username}`,
          { signal: controller.signal },
        );
        const data = await res.json();

        if (!cancelled) {
          setPredictions(data.predictions || []);
          setPagination(data.pagination || { total: 0, totalPages: 0 });
        }
      } catch (error) {
        if (!cancelled && error.name !== "AbortError") {
          console.error("Failed to fetch predictions:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
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
    <div className="w-full mt-8 pb-8">
      {loading ? (
        <div className="w-full space-y-4">
          <div className="mb-4 text-2xl font-bold text-foreground flex items-center gap-2">
            Recent History
          </div>
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="h-20 w-full animate-pulse rounded-2xl border border-border/50 bg-element/50 shadow-none"
            />
          ))}
        </div>
      ) : (
        <ProfileRecentHistory predictions={predictions} />
      )}

      {!loading && pagination?.total > 10 && (
        <div className="mt-6">
          <Pagination
            currentPage={1}
            totalPages={pagination?.totalPages}
            baseUrl="/profile"
          />
        </div>
      )}

      {!loading && predictions?.length > 0 && (
        <Link
          href={`/predictions/${username}`}
          className="mt-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main transition-colors group"
        >
          View Full History
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
