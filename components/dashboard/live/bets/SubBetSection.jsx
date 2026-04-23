import { BetMarketCard } from "./BetMarketCard";

export function SubBetSection({ markets, activeBets, onPlace, maxStake }) {
  const groups = [...new Set(markets.map((market) => market.group))];

  return (
    <div className="space-y-3">
      <div className="mb-1 flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          Sub Bets
        </h4>
        <span className="text-[11px] text-text-muted">Round winner only</span>
      </div>

      {markets.length === 0 ? (
        <p className="rounded-lg border border-border/60 bg-element/35 px-3 py-2 text-xs text-text-muted">
          Round winner market appears during live rounds.
        </p>
      ) : (
        groups.map((group) => (
          <section key={group} className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted/90">
              {group}
            </p>
            <div className="space-y-2">
              {markets
                .filter((market) => market.group === group)
                .map((market) => (
                  <BetMarketCard
                    key={market.id}
                    market={market}
                    onPlace={onPlace}
                    maxStake={maxStake}
                    existingBet={activeBets.find(
                      (bet) => bet.betId === market.id,
                    )}
                  />
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
