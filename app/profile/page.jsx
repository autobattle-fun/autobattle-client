"use client";

import { CheckCircle2, Copy, Link2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="max-w-xl mx-auto h-full flex flex-col items-center pt-8 pb-12">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/10 mb-4 overflow-hidden shadow-sm" />

      {/* Title & Subtitle */}
      <div className="flex items-center gap-1 mb-1">
        <h1 className="text-2xl font-bold">User Name</h1>
        <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/10" />
      </div>
      <p className="text-text-muted text-base mb-6">0x1234...5678</p>

      {/* Stats Row 1 */}
      <div className="flex gap-3 w-full mb-3">
        <Card className="flex-1 bg-element rounded-2xl p-3 text-center border border-border/50 shadow-none">
          <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5 tracking-wider">
            Win Rate
          </div>
          <div className="text-sm font-bold">64.2%</div>
        </Card>
        <Card className="flex-1 bg-element rounded-2xl p-3 text-center border border-border/50 shadow-none">
          <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5 tracking-wider">
            Predictions
          </div>
          <div className="text-sm font-bold">342</div>
        </Card>
        <Card className="flex-1 bg-element rounded-2xl p-3 text-center border border-border/50 shadow-none">
          <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5 tracking-wider">
            Earnings
          </div>
          <div className="text-sm font-bold">$1,204.50</div>
        </Card>
      </div>

      {/* Address Copy Button */}
      <Button
        type="button"
        variant="secondary"
        className="w-full bg-element hover:bg-element-hover transition-colors rounded-2xl p-3 flex items-center justify-center gap-2 border border-border/50 mb-3"
      >
        <span className="text-sm font-medium">0x1234...5678</span>
        <Copy className="w-3.5 h-3.5 text-text-muted" />
      </Button>

      {/* Social Links */}
      <div className="flex gap-3 w-full mb-8">
        <Button
          type="button"
          variant="secondary"
          className="flex-1 bg-element hover:bg-element-hover transition-colors rounded-2xl p-3 flex items-center justify-center gap-2 border border-border/50"
        >
          <Link2 className="w-4 h-4" />
          <span className="text-sm font-medium">twitter</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex-1 bg-element hover:bg-element-hover transition-colors rounded-2xl p-3 flex items-center justify-center gap-2 border border-border/50"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">website</span>
        </Button>
      </div>

      {/* History Section */}
      <div className="w-full">
        <div className="text-[10px] text-text-muted uppercase font-bold mb-2 tracking-wider">
          Recent History
        </div>

        <div className="flex flex-col gap-2 w-full">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="w-full bg-element rounded-2xl p-4 flex items-center justify-between border border-border/50 shadow-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-text-main" />
                <span className="text-sm font-medium uppercase">
                  Match {1000 - i}
                </span>
              </div>
              <span className="text-sm font-bold">Won</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
