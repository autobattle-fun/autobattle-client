import { SectionCard } from "./SectionCard";

export function RulesSection() {
  return (
    <SectionCard title="Rules" subtitle="Simple round flow">
      <div className="space-y-3 text-xs leading-relaxed text-text-muted">
        <section className="rounded-xl border border-border/60 bg-background/60 p-3">
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-text-main">
            Core Rules
          </h4>
          <ul className="space-y-1.5">
            <li>• Red and Blue start at 10 HP.</li>
            <li>• Win each round by finishing closer to 21.</li>
            <li>• Aces auto-adjust from 11 to 1 when needed.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-border/60 bg-background/60 p-3">
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-text-main">
            Round Steps
          </h4>
          <ul className="space-y-1.5">
            <li>• Initial deal: one card each.</li>
            <li>• Turns: Red first, then Blue, each can Hit or Stay.</li>
            <li>• Final reveal: one extra card each after both stay.</li>
            <li>• Resolve: closest to 21 wins the round.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-border/60 bg-background/60 p-3">
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-text-main">
            Damage and End
          </h4>
          <ul className="space-y-1.5">
            <li>• Damage doubles by round: 1, 2, 4, 8.</li>
            <li>• Ties trigger sudden death until one side is closer.</li>
            <li>• Match ends immediately when a player reaches 0 HP.</li>
          </ul>
        </section>
      </div>
    </SectionCard>
  );
}
