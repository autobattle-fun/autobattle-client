"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Activity, Loader2, Crosshair, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useUserStore } from "@/store/userStore";

export default function BountiesPage() {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = useUserStore((state) => state.user?.username);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchBounties() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bounties`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bounties");
        }

        const payload = await response.json();

        if (isMounted && payload.success) {
          setBounties(payload.data || []);
        }
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          console.error("Fetch bounties error:", error);
          setBounties([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBounties();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center pb-12 pt-8 px-4">
      {/* Page Header */}
      <div className="w-full mb-6">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-2">
          Bounties
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Complete bounties to earn rewards and climb the ranks
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {bounties.length === 0 ? (
            <Card className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-element/30 py-16 px-4 shadow-none">
              <Activity className="w-8 h-8 text-text-muted/50 mb-3" />
              <p className="text-sm font-semibold text-text-main">
                No bounties available
              </p>
              <p className="text-xs text-text-muted mt-1 text-center">
                Check back later for new bounties and challenges!
              </p>
            </Card>
          ) : (
            bounties.map((bounty) => (
              <Card
                key={bounty.id}
                className="flex w-full flex-col gap-4 rounded-2xl border border-border/50 bg-element p-5 shadow-none hover:bg-element-hover hover:border-border transition-all duration-200"
              >
                {/* Top Row: Icon + Title + Time */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <Crosshair className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-bold text-text-main">
                      {bounty.title}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-muted font-medium">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>
                        {bounty.createdAt
                          ? formatDistanceToNow(new Date(bounty.createdAt), {
                              addSuffix: true,
                            })
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {bounty.description && (
                  <p className="text-xs text-text-muted leading-relaxed pl-14">
                    {bounty.description}
                  </p>
                )}

                {/* Tweet Content */}
                {bounty.tweetContent && (
                  <div className="ml-14 flex flex-col gap-2.5">
                    <div className="flex items-start gap-2.5 rounded-xl bg-background border border-border/50 p-3.5">
                      <Image
                        src="/provider/x.png"
                        alt="Twitter"
                        width={20}
                        height={20}
                        className="w-4 h-4 shrink-0 mt-0.5 brightness-0 dark:invert"
                      />
                      <p className="text-xs text-text-main font-medium leading-relaxed whitespace-pre-line">
                        {bounty.tweetContent}
                      </p>
                    </div>

                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(bounty.tweetContent + (username ? `\n\n- @${username}` : ""))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors duration-200 shadow-md shadow-primary/20"
                    >
                      <Image
                        src="/provider/x.png"
                        alt="Twitter"
                        width={16}
                        height={16}
                        className="w-3.5 h-3.5 brightness-0 invert"
                      />
                      Post on X
                    </a>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
