export const STARTING_BALANCE = 1000;

export function makeBetState() {
  return {
    balance: STARTING_BALANCE,
    active: [],
    history: [],
  };
}

export function generateMarkets(gameState) {
  const { phase, round, red, blue } = gameState;

  const markets = [];

  const isActiveRound = [
    "AwaitingAction_Red",
    "AwaitingAction_Blue",
    "AwaitingFinalRevealVRF",
    "ReadyToResolve",
    "AwaitingTiebreakerVRF",
  ].includes(phase);

  if (phase !== "Ended") {
    const redFav = red.hp > blue.hp;
    const blueFav = blue.hp > red.hp;

    markets.push({
      id: "match_red",
      group: "Match Winner",
      label: "Red Agent",
      sublabel: "wins the match",
      odds: redFav ? 1.65 : blueFav ? 2.55 : 2.0,
      side: "red",
      type: "match_winner",
      resolveOn: "Ended",
    });

    markets.push({
      id: "match_blue",
      group: "Match Winner",
      label: "Blue Agent",
      sublabel: "wins the match",
      odds: blueFav ? 1.65 : redFav ? 2.55 : 2.0,
      side: "blue",
      type: "match_winner",
      resolveOn: "Ended",
    });
  }

  if (isActiveRound) {
    markets.push({
      id: `round_${round}_red`,
      group: `Round ${round}`,
      label: "Red wins round",
      sublabel: "closer to 21 after river",
      odds: 1.88,
      side: "red",
      type: "round_winner",
      round,
    });

    markets.push({
      id: `round_${round}_blue`,
      group: `Round ${round}`,
      label: "Blue wins round",
      sublabel: "closer to 21 after river",
      odds: 1.88,
      side: "blue",
      type: "round_winner",
      round,
    });
  }

  return markets;
}

export function resolveActiveBets(activeBets, gameState) {
  const { phase, round, winner, roundHistory } = gameState;

  const resolved = [];
  const remaining = [];

  activeBets.forEach((bet) => {
    let won = null;

    if (bet.type === "match_winner" && phase === "Ended") {
      won = winner === bet.side;
    } else if (bet.type === "round_winner" && bet.round < round) {
      const entry = roundHistory.find((h) => h.round === bet.round);

      if (entry) {
        won = entry.loser !== bet.side;
      }
    }

    if (won !== null) {
      const payout = won ? parseFloat((bet.amount * bet.odds).toFixed(2)) : 0;
      resolved.push({ ...bet, won, payout });
    } else {
      remaining.push(bet);
    }
  });

  const balanceDelta = resolved.reduce((sum, b) => sum + b.payout, 0);

  return { resolved, remaining, balanceDelta };
}
