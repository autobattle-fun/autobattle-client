"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Swords,
  Clock,
  CheckCircle2,
  XCircle,
  Coins,
  Ticket,
  Calendar,
  Target,
  ShieldCheck,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/config";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";

// Helper to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PredictionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // Global State
  const currentUser = useUserStore((state) => state.user);

  // Local State
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function fetchPrediction() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/predictions/get/${id}`,
          {
            method: "GET",
            credentials: "include", // Ensures auth cookies are sent
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const payload = await response.json();
        if (isMounted) {
          setPrediction(payload.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchPrediction();

    return () => {
      isMounted = false;
    };
  }, [id, router]);

  // Handle mock claim action
  const handleClaim = async () => {
    if (isClaiming) return;
    setIsClaiming(true);
    // Add your actual claim logic/API call here
    setTimeout(() => {
      setIsClaiming(false);
      // setPrediction(prev => ({ ...prev, hasClaimed: true })) // Optimistic update
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <p className="text-text-main font-semibold">Prediction not found</p>
        <Link href="/profile" className="text-primary hover:underline">
          Go back to profile
        </Link>
      </div>
    );
  }

  // Destructure payload
  const { side, amount, shareAmount, hasClaimed, createdAt, market, userId } =
    prediction;
  const match = market?.match;

  // Logic & Formatting
  const isResolved = market?.status === "RESOLVED";
  const isWinner = isResolved && market?.winningOutcome === side;
  const isLoser =
    isResolved &&
    market?.winningOutcome !== side &&
    market?.winningOutcome !== null;
  const isRedBet = side === "YES";

  const redName = match?.redName || "Red";
  const blueName = match?.blueName || "Blue";
  const votedAgentName = isRedBet ? redName : blueName;

  const matchScope = market?.marketType === "MID_GAME" ? "round" : "match";
  const predictionStatement = `${votedAgentName} will win the ${matchScope}`;

  // Check ownership
  const isOwner = currentUser?.id === userId;

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

      {/* 1. HERO CARD: Top level prediction overview */}
      <Card className="flex w-full flex-col gap-6 rounded-3xl border border-border/50 bg-element p-6 shadow-none">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-1">
              {isWinner ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              ) : isLoser ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              )}
            </div>

            {/* Statement */}
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-text-main leading-tight">
                {predictionStatement}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-text-muted font-medium">
                <span className="flex items-center gap-1">
                  <Swords className="w-3.5 h-3.5" />
                  Match #{match?.gameId || id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border/40" />

        {/* Topline Result */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold text-text-main tracking-tight">
            {shareAmount ? Number(shareAmount).toFixed(2) : "0"}{" "}
            <span className="text-xl text-text-muted font-semibold">
              Shares
            </span>
          </span>
          {isResolved ? (
            <span
              className={`text-sm font-bold uppercase tracking-wider ${
                isWinner ? "text-green-500" : "text-text-muted"
              }`}
            >
              {isWinner ? `Won` : "Loss"}
            </span>
          ) : (
            <span className="text-sm font-bold uppercase tracking-wider text-yellow-500">
              Pending Resolution
            </span>
          )}
        </div>
      </Card>

      {/* 2. METADATA SECTION: Detailed breakdown of the payload */}
      <div className="w-full mt-7">
        <div className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          Prediction Metadata
        </div>

        <Card className="flex w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-element shadow-none">
          {/* Matchup */}
          <div className="flex items-center justify-between border-b border-border/30 p-4">
            <div className="flex items-center gap-3 text-text-muted">
              <Swords className="w-4 h-4" />
              <span className="text-sm font-medium">Matchup</span>
            </div>
            <span className="text-sm font-bold text-text-main">
              {redName} vs {blueName}
            </span>
          </div>

          {/* Market Type / Target */}
          <div className="flex items-center justify-between border-b border-border/30 p-4 bg-element-hover/20">
            <div className="flex items-center gap-3 text-text-muted">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Market Scope</span>
            </div>
            <span className="text-sm font-bold text-text-main capitalize">
              {market?.marketType === "MAIN"
                ? "Overall Match Winner"
                : `Round ${market?.targetRound || "X"} Winner`}
            </span>
          </div>

          {/* Wager Details ($AUTO) */}
          <div className="flex items-center justify-between border-b border-border/30 p-4">
            <div className="flex items-center gap-3 text-text-muted">
              <Coins className="w-4 h-4" />
              <span className="text-sm font-medium">Amount Wagered</span>
            </div>
            <span className="text-sm font-bold text-text-main">
              {amount ? Number(amount).toString() : "0"} $AUTO
            </span>
          </div>

          {/* Position (Yes/No) */}
          <div className="flex items-center justify-between border-b border-border/30 p-4 bg-element-hover/20">
            <div className="flex items-center gap-3 text-text-muted">
              <Ticket className="w-4 h-4" />
              <span className="text-sm font-medium">Your Position</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isRedBet ? "bg-red-500" : "bg-blue-500"}`}
              />
              <span className="text-sm font-bold text-text-main">
                {votedAgentName} ({side})
              </span>
            </div>
          </div>

          {/* Claim Status */}
          <div className="flex items-center justify-between border-b border-border/30 p-4">
            <div className="flex items-center gap-3 text-text-muted">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Claim Status</span>
            </div>
            {hasClaimed ? (
              <span className="text-sm font-bold text-green-500">Claimed</span>
            ) : (
              <span className="text-sm font-bold text-text-muted">
                {isWinner
                  ? "Pending Claim"
                  : isLoser
                    ? "Lost Wager"
                    : "Unclaimed"}
              </span>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center justify-between p-4 bg-element-hover/20">
            <div className="flex items-center gap-3 text-text-muted">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Placed On</span>
            </div>
            <span className="text-sm font-semibold text-text-main">
              {formatDate(createdAt)}
            </span>
          </div>
        </Card>
      </div>

      {/* 3. CONDITIONAL ACTION BUTTON */}
      {isOwner && (
        <div className="w-full mt-6 pb-6">
          {isWinner && !hasClaimed ? (
            /* PRIMARY BUTTON: Eligible to Claim */
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className={cn(
                "w-full rounded-xl md:rounded-2xl pb-[4px] group bg-primary/70 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed",
              )}
            >
              <div
                className={cn(
                  "h-full rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 ease-out bg-primary",
                  !isClaiming &&
                    "group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]",
                )}
              >
                <div className="text-xl text-white font-bold tracking-tighter flex items-center gap-2">
                  {isClaiming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Image
                        src="/logo/Autobattle-logo.svg"
                        width={20}
                        height={20}
                        alt="Autobattle.fun"
                        className="brightness-0 invert"
                      />
                      Claim Winnings
                    </>
                  )}
                </div>
              </div>
            </button>
          ) : (
            /* SECONDARY BUTTON: Pending, Lost, or Already Claimed */
            <button
              disabled
              className={cn(
                "w-full rounded-xl md:rounded-2xl pb-[4px] group cursor-not-allowed bg-foreground/10",
              )}
            >
              <div
                className={cn(
                  "h-full rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 border border-foreground/10 ease-out bg-element-hover",
                )}
              >
                <div className="text-lg text-text-muted font-bold tracking-tight flex items-center gap-2">
                  {hasClaimed ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Winnings Claimed
                    </>
                  ) : isLoser ? (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      Prediction Lost
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Awaiting Resolution
                    </>
                  )}
                </div>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
