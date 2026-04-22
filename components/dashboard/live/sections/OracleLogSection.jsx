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
      subtitle="Live event feed from the round engine"
      right={
        <span className="text-xs text-text-muted">{logs.length} events</span>
      }
    >
      <div
        ref={containerRef}
        className="space-y-1 rounded-lg border border-border/50 bg-background/30 p-2"
      >
        {logs.length === 0 ? (
          <p className="px-1 py-2 text-xs text-text-muted">
            Awaiting first event...
          </p>
        ) : (
          logs.map((entry, index) => (
            <p
              key={`${entry}_${index}`}
              className="rounded px-2 py-1 text-xs text-text-muted"
              style={{
                background:
                  index === logs.length - 1
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
                color:
                  index === logs.length - 1
                    ? "rgba(255,255,255,0.82)"
                    : "var(--muted)",
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
