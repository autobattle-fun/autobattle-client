"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";

import { MatchHero } from "@/components/history/MatchHero";
import { RoundList } from "@/components/history/RoundList";

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState({ match: null, liveGameState: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function fetchMatchDetail() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/games/search/${id}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const payload = await response.json();

        if (isMounted) {
          setData({
            match: payload?.data?.match || payload?.match,
            liveGameState:
              payload?.data?.liveGameState || payload?.liveGameState,
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch match:", err);
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchMatchDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
      </div>
    );
  }

  if (error || !data.match) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <p className="text-text-main font-semibold">Match not found</p>
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const { match } = data;

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center pb-12 pt-8 px-4">
      {/* Extracted Top Hero Card */}
      <MatchHero match={match} />

      <div className="w-full">
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider mb-8">
          <div className="border-t border-foreground/30 flex-1 border-dashed ml-8"></div>
          <span className="opacity-50">Battle Timeline</span>
          <div className="border-t border-foreground/30 flex-1 border-dashed mr-8"></div>
        </div>

        {/* Extracted Accordion List */}
        <RoundList
          rounds={match.rounds || []}
          redName={match.redName || "Red Agent"}
          blueName={match.blueName || "Blue Agent"}
        />
      </div>
    </div>
  );
}
