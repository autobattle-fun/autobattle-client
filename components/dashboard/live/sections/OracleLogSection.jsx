import { useEffect, useRef } from "react";

import { SectionCard } from "./SectionCard";

export function OracleLogSection({ logs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [logs]);

  return (
    <SectionCard
      title="Oracle Log"
      className="border-border/70 bg-surface/95"
      subtitle="Live event feed from the round engine"
      right={
        <span className="text-xs text-text-muted">{logs.length} events</span>
      }
    >
      <div
        ref={containerRef}
        className="max-h-95 space-y-1 overflow-y-auto rounded-2xl border border-border/70 bg-element/55 p-2"
      >
        {logs.length === 0 ? (
          <p className="px-1 py-2 text-xs text-text-muted">
            Awaiting first event...
          </p>
        ) : (
          logs.map((entry, index) => (
            <p
              key={`${entry}_${index}`}
              className="rounded-lg px-2 py-1 text-xs text-text-muted"
              style={{
                background:
                  index === logs.length - 1 ? "var(--surface)" : "transparent",
                color:
                  index === logs.length - 1
                    ? "var(--foreground)"
                    : "var(--muted)",
                boxShadow:
                  index === logs.length - 1
                    ? "inset 0 0 0 1px color-mix(in srgb, var(--primary) 18%, transparent)"
                    : "none",
              }}
            >
              <span className="mr-2 font-mono text-[10px] text-text-muted/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              {entry}
            </p>
          ))
        )}
      </div>
    </SectionCard>
  );
}
