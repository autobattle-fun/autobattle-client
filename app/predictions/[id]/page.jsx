"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2, ChevronLeft } from "lucide-react";
import { ProfileRecentHistory } from "@/components/profile/ProfileRecentHistory";
import { Pagination } from "@/components/ui/pagination";

export default function PredictionsPage() {
  const router = useRouter();
  const params = useParams(); // Grab dynamic route parameters
  const searchParams = useSearchParams();

  // Extract username from the route (e.g., app/predictions/[username]/page.jsx)
  const username = params?.id;
  const page = parseInt(searchParams.get("page")) || 1;

  const [data, setData] = useState({
    predictions: [],
    pagination: { total: 0, totalPages: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until username is available from the URL params
    if (!username) return;

    let isMounted = true;
    const controller = new AbortController();

    async function fetchPredictions() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/predictions/${username}?page=${page}&limit=10`,
          {
            signal: controller.signal,
            credentials: "include",
          },
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch predictions");
        }

        const payload = await response.json();

        if (isMounted) {
          setData({
            predictions: payload.predictions || [],
            pagination: payload.pagination || { total: 0, totalPages: 0 },
          });
        }
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          console.error(error);
          setData({ predictions: [], pagination: { total: 0, totalPages: 0 } });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPredictions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [username, page, router]);

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center pb-12 pt-8 px-4">
      {/* Back Navigation */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex w-full items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="w-full mb-6">
        <h1 className="text-4xl font-bold">Predictions</h1>
        <p className="text-sm text-text-muted">
          View all historical match predictions
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
        </div>
      ) : (
        <>
          <ProfileRecentHistory
            predictions={data.predictions}
            hideTitle={true}
          />

          {data.pagination.total > 10 && (
            <div className="mt-8 w-full">
              <Pagination
                currentPage={page}
                totalPages={data.pagination.totalPages}
                // Update baseUrl so pagination links retain the username in the path
                baseUrl={`/predictions/${username}`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
