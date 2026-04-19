"use client";

import { Loader2 } from "lucide-react";

export function LoginStatusCard({ title, description }) {
  return (
    <div className="border-t border-border border-dashed pt-5">
      <div className="flex flex-col items-center gap-3">
        <div className="mt-0.5 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <div className="min-w-0 flex-1 text-center">
          <div className="text-lg font-semibold text-text-main">{title}</div>
          <p className="mt-1 text-sm font-semibold px-10 leading-5 text-text-muted">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
