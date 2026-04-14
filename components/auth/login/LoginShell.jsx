"use client";

import { Card } from "@/components/ui/card";

export function LoginShell({ eyebrow, title, description, children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-xl rounded-4xl border-border/70 bg-surface/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-text-muted">
              {eyebrow}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-main sm:text-[2.15rem]">
              {title}
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-6 text-text-muted sm:text-[0.95rem]">
              {description}
            </p>
          </div>

          <div className="space-y-4">{children}</div>
        </div>
      </Card>
    </div>
  );
}
