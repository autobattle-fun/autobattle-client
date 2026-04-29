import { Card } from "@/components/ui/card";
import { ChessPawn, History } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

async function getMatches(page = 1) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/games?status=RESOLVED&page=${page}&limit=10`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch matches error:", error);
    return null;
  }
}

export default async function HistoryPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page, 10) || 1;
  const data = await getMatches(page);

  const matches = data?.data?.matches || [];
  const pagination = data?.data?.pagination || { totalPages: 1 };

  return (
    <div className="max-w-xl mx-auto h-full flex flex-col pt-16 pb-12">
      <h1 className="text-4xl font-bold mb-2">Match History</h1>
      <p className="text-text-muted text-sm mb-6">
        All the previous matches and their results
      </p>

      <div className="flex flex-col gap-2">
        {matches.length === 0 ? (
          <div className="text-center py-20 bg-element rounded-3xl border border-border/50">
            <ChessPawn className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
            <p className="text-text-muted font-medium">No matches found</p>
          </div>
        ) : (
          matches.map((match) => (
            <Link key={match.id} href={`/history/${match.id}`}>
              <Card className="w-full bg-element rounded-2xl p-4 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none">
                <div className="flex items-center gap-4">
                  <div className="w-10 min-w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <ChessPawn className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-0.5">
                      Match #{match.gameId}
                    </div>
                    <div className="text-[10px] text-text-muted uppercase font-medium">
                      {formatDistanceToNow(new Date(match.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="font-bold text-sm flex items-center gap-2 justify-end">
                    {match.winner && (
                      <div
                        className={`flex gap-1 px-2 py-1 text-xs text-white rounded-sm items-center justify-center uppercase tracking-tight ${
                          match.winner === "RED" ? "bg-red-500" : "bg-blue-500"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        {match.winner === "RED" ? "Red Agent" : "Blue Agent"}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-text-muted font-medium mt-0.5">
                    View Details ↗
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/history?page=${i + 1}`}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                page === i + 1
                  ? "bg-primary text-white"
                  : "bg-element text-text-muted hover:bg-element-hover"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


