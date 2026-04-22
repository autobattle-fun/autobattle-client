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
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [draft, setDraft] = useState("");

  const countLabel = useMemo(
    () => `${comments.length} comments`,
    [comments.length],
  );

  return (
    <SectionCard
      title="Comments"
      subtitle="Community signal"
      right={<span className="text-xs text-text-muted">{countLabel}</span>}
    >
      <div className="space-y-3">
        <div className="space-y-2 rounded-lg border border-border/50 bg-background/30 p-2.5">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-lg border border-border/50 bg-element/35 px-3 py-2"
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
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="Share your market read..."
            className="w-full resize-none rounded-lg border border-border/70 bg-background/30 px-3 py-2 text-sm text-text-main outline-none placeholder:text-text-muted"
          />
          <button
            type="submit"
            className="rounded-lg border border-border/70 bg-element px-3 py-1.5 text-xs font-semibold text-text-main transition hover:bg-element-hover"
          >
            Post Comment
          </button>
        </form>
      </div>
    </SectionCard>
  );
}
