import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Swords, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PredictionHeader } from "@/components/predictions/PredictionHeader";
import { PredictionPerformanceCards } from "@/components/predictions/PredictionPerformanceCards";

async function getPredictionDetail(id) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/user/predictions/${id}`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      redirect("/login");
    }

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload.data;
  } catch {
    return null;
  }
}

export default async function PredictionDetailPage({ params }) {
  const { id } = await params;
  const prediction = await getPredictionDetail(id);

  if (!prediction) {
    notFound();
  }

  const { side, amount, market, createdAt, shareAmount } = prediction;
  const match = market?.match;
  const rounds = match?.rounds || [];

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center pb-12 pt-8 px-4">
      <Link
        href="/profile"
        className="mb-6 flex w-full items-center gap-2 text-sm text-text-muted hover:text-text-main transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      <PredictionHeader market={market} createdAt={createdAt} />
      
      <PredictionPerformanceCards 
        amount={amount} 
        share={shareAmount} 
        side={side} 
      />

      <div className="w-full mt-6">
        <div className="mb-4 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          Match History (Rounds)
        </div>

        <div className="flex w-full flex-col gap-3">
          {rounds.length === 0 ? (
            <Card className="flex w-full items-center justify-center rounded-2xl border border-border/50 bg-element p-8 shadow-none">
              <p className="text-sm text-text-muted">No rounds recorded for this match</p>
            </Card>
          ) : (
            rounds.map((round) => (
              <Card key={round.id} className="flex w-full flex-col gap-4 rounded-2xl border border-border/50 bg-element p-4 shadow-none">
                <div className="flex items-center justify-between border-b border-border/10 pb-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-text-muted">
                    Round {round.roundNumber}
                  </span>
                </div>
                
                <div className="flex flex-col gap-4">
                  {round.moves?.map((move) => (
                    <div key={move.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                          move.side === 'GREEN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {move.type === 'ATTACK' ? <Swords className="w-4 h-4" /> : 
                           move.type === 'DEFEND' ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            {move.side === 'GREEN' ? 'Green Agent' : 'Red Agent'}
                          </span>
                          <span className="text-[10px] font-bold uppercase text-text-muted">
                            {move.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "text-sm font-bold",
                          move.isSuccessful ? (move.side === 'GREEN' ? 'text-green-500' : 'text-red-500') : 'text-text-muted line-through'
                        )}>
                          {move.damage > 0 ? `-${move.damage} HP` : 'MISSED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

