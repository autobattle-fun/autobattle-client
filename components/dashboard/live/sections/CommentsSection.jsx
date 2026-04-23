"use client";

import { useMemo, useState } from "react";

import { SectionCard } from "./SectionCard";

const INITIAL_COMMENTS = [
  {
    id: "c1",
    user: "oracle_watch",
    text: "Red has momentum this round.",
    ago: "2m",
  },
  {
    id: "c2",
    user: "market_maker",
    text: "Tie odds look overpriced right now.",
    ago: "1m",
  },
];

export function CommentsSection() {
  const [draft, setDraft] = useState("");
  const [comments, setComments] = useState(INITIAL_COMMENTS);

  const countLabel = useMemo(
    () => `${comments.length} comments`,
    [comments.length],
  );

  return (
    <SectionCard
      title="Comments"
      subtitle="Community signal below the arena"
      className="border-white/10 bg-slate-950/70"
      right={<span className="text-xs text-text-muted">{countLabel}</span>}
    >
      <div className="space-y-3">
        <div className="max-h-65 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-black/25 p-2.5">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-lg border border-white/10 bg-white/3 px-3 py-2"
            >
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-text-main">
                  @{comment.user}
                </span>

                <span className="text-text-muted">{comment.ago}</span>
              </div>

              <p className="text-xs text-text-muted">{comment.text}</p>
            </article>
          ))}
        </div>

        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            const text = draft.trim();

            if (!text) return;

            setComments((prev) => [
              ...prev,
              { id: `${Date.now()}`, user: "you", text, ago: "now" },
            ]);

            setDraft("");
          }}
        >
          <textarea
            rows={3}
            value={draft}
            placeholder="Share your market read..."
            onChange={(event) => setDraft(event.target.value)}
            className="w-full resize-none rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-text-main outline-none placeholder:text-text-muted"
          />

          <button
            type="submit"
            className="rounded-xl border border-cyan-300/40 bg-cyan-400/15 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/25"
          >
            Post Comment
          </button>
        </form>
      </div>
    </SectionCard>
  );
}
