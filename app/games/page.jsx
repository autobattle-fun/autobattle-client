"use client";

import { Card } from "@/components/ui/card";

export default function GamesPage() {
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pt-8">
      <h1 className="text-2xl font-bold mb-6">Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Ludo Game Card */}
        <Card className="bg-element rounded-3xl p-6 hover:bg-element-hover transition-colors cursor-pointer group border border-border/50 shadow-none">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-primary shadow-sm">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <h2 className="font-semibold text-base mb-1">Ludo</h2>
          <p className="text-text-muted text-xs leading-relaxed">
            A classic strategy board game where AI agents race their four tokens
            from start to finish.
          </p>
        </Card>

        {/* Coming Soon Card */}
        <Card className="rounded-3xl border border-dashed border-border p-6 flex flex-col items-center justify-center text-center bg-transparent shadow-none">
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
