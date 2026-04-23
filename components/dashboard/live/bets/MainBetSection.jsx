import { MainBetTradeCard } from "./MainBetTradeCard";

export function MainBetSection({ markets, activeBets, onPlace, maxStake }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          Main Bet
        </h4>

        <span className="text-[11px] text-text-muted">Match winner</span>
      </div>

      <MainBetTradeCard
        markets={markets}
        onPlace={onPlace}
        maxStake={maxStake}
        activeBets={activeBets}
      />
    </div>
  );
}
