import { notFound } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { MatchHero } from "@/components/history/MatchHero";
import { MatchStats } from "@/components/history/MatchStats";
import { RoundList } from "@/components/history/RoundList";

async function getMatchDetail(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload.data || null;
  } catch (error) {
    console.error("Fetch match detail error:", error);
    return null;
  }
}

export default async function MatchDetailPage({ params }) {
  const { id } = await params;
  const data = await getMatchDetail(id);

  if (!data || !data.match) {
    notFound();
  }

  const match = data.match;
  const rounds = match.rounds || [];

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center pb-12 pt-8">
      <MatchHero match={match} />
      <MatchStats match={match} />
      <RoundList rounds={rounds} />
    </div>
  );
}
