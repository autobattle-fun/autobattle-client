"use client";

import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LoginStatusCard({ title, description }) {
  return (
    <Card className="rounded-3xl border-border/70 bg-element/80 p-4 shadow-none">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-text-main">{title}</div>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
