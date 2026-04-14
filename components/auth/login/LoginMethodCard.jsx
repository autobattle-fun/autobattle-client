"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LoginMethodCard({ method, busy = false, onSelect }) {
  return (
    <Card
      className={`w-full rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 ${busy ? "cursor-wait opacity-80" : "cursor-pointer hover:-translate-y-0.5 hover:bg-element"}`}
      onClick={() => {
        if (!busy) {
          onSelect();
        }
      }}
      role="button"
      aria-disabled={busy}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {method.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-main">
              {method.label}
            </span>
            <span className="text-xs leading-5 text-text-muted">
              {method.description}
            </span>
          </div>
        </div>

        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
        ) : (
          <ArrowRight className="h-4 w-4 text-text-muted" />
        )}
      </div>
    </Card>
  );
}
