import { CheckCircle2, Clock, XCircle, Swords, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function ProfileRecentHistory({ predictions = [], hideTitle = false }) {
  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      {!hideTitle && (
        <div className="mb-4 text-2xl font-bold text-foreground flex items-center gap-2">
          Recent History
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        {predictions.length === 0 ? (
          <Card className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-element/30 py-12 px-4 shadow-none">
            <Swords className="w-8 h-8 text-text-muted/50 mb-3" />
            <p className="text-sm font-semibold text-text-main">
              No battle predictions yet
            </p>
            <p className="text-xs text-text-muted mt-1 text-center">
              Your market predictions will appear here once you place them.
            </p>
          </Card>
        ) : (
          predictions.map((prediction) => {
            const market = prediction.market;
            const match = market?.match;
            const isResolved = market?.status === "RESOLVED";
            const isWinner =
              isResolved && market?.winningOutcome === prediction.side;
            const isLoser =
              isResolved && market?.winningOutcome !== prediction.side;

            // From Schema: YES = Red, NO = Blue
            const isRedBet = prediction.side === "YES";

            // Fetch the specific name of the agent the user voted for
            const votedAgentName = isRedBet
              ? match?.redName || "Red"
              : match?.blueName || "Blue";

            // Frame the sentence based on the market type
            const matchScope =
              market?.marketType === "MID_GAME" ? "round" : "match";
            const predictionStatement = `${votedAgentName} will win the ${matchScope}`;

            return (
              <Link
                key={prediction.id}
                href={`/predictions/get/${prediction.id}`}
                className="group block"
              >
                <Card className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border/50 bg-element p-4 shadow-none hover:bg-element-hover hover:border-border transition-all duration-200">
                  {/* Left Side: Match Info & Status */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex-shrink-0">
                      {isWinner ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                      ) : isLoser ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20">
                          <Clock className="w-5 h-5 text-yellow-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-text-main group-hover:text-primary transition-colors truncate">
                        {predictionStatement}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-muted font-medium truncate">
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Swords className="w-3 h-3" />
                          Match #
                          {match?.gameId ||
                            prediction.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="flex-shrink-0">•</span>
                        <span className="truncate">
                          {formatDate(prediction.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Shares & Status Text */}
                  <div className="flex items-center gap-3 flex-shrink-0 pl-2">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-text-main whitespace-nowrap">
                        {prediction.shareAmount
                          ? Number(prediction?.shareAmount).toFixed(2)
                          : "0"}{" "}
                        Shares
                      </span>
                      {isResolved ? (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isWinner ? "text-green-500" : "text-text-muted"}`}
                        >
                          {isWinner ? `Won` : "Loss"}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 text-yellow-500">
                          Pending
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted/50 group-hover:text-text-main transition-colors hidden sm:block flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
