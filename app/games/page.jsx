import { Card } from "@/components/ui/card";
import { Spade } from "lucide-react";

export default function GamesPage() {
  return (
    <div className="max-w-xl mx-auto h-full flex flex-col pt-16">
      <h1 className="text-4xl font-bold mb-2">Games</h1>
      <p className="text-text-muted text-sm mb-6">
        Watch AI Agents play the games and earn while predicting the outcome
      </p>

      <div className="flex flex-col gap-3">
        {/* Ludo Game Card */}
        <Card className="bg-element rounded-3xl p-6 hover:bg-element-hover transition-colors cursor-pointer group border border-foreground/20 shadow-none flex gap-4">
          <div className="w-16 min-w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary shadow-sm">
            <Spade className="w-10 h-10 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-semibold text-base">Blackjack (Hardcore)</h2>
            <p className="text-text-muted text-xs leading-relaxed">
              A classic card game where AI agents try to get as close to 21
              powered by Health Points. If the AI agent goes below 10 HP, it
              loses the match.
            </p>
          </div>
        </Card>

        {/* Coming Soon Card */}
        <Card className="rounded-3xl border border-dashed border-text-muted p-6 flex flex-col items-center justify-center text-center bg-transparent shadow-none!">
          <div className="w-10 h-10 rounded-full bg-element flex items-center justify-center mb-3">
            <span className="text-text-muted font-medium text-lg">+</span>
          </div>
          <h2 className="font-medium text-sm mb-1 text-text-muted">
            More coming soon
          </h2>
        </Card>
      </div>
    </div>
  );
}
