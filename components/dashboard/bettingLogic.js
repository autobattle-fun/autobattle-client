// ─────────────────────────────────────────────────────────────
// BETTING LOGIC — market generation + bet state helpers
// ─────────────────────────────────────────────────────────────

export const STARTING_BALANCE = 1000;

export function makeBetState() {
  return {
    balance: STARTING_BALANCE,
    active: [],    // placed but not yet resolved
    history: [],   // resolved bets
  };
}

/**
 * Generate available markets from current game state.
 * Returns an array of market objects.
 */
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

  // ── Match winner (always open unless game ended)
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

  // ── Round winner (during an active round)
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
    markets.push({
      id: `round_${round}_tie`,
      group: `Round ${round}`,
      label: "Round ties",
      sublabel: "equal distance from 21",
      odds: 9.0,
      side: "tie",
      type: "round_tie",
      round,
    });
  }

  // ── Red hand size (early in round)
  if (["AwaitingAction_Red", "AwaitingAction_Blue"].includes(phase) && red.hand.length <= 2) {
    markets.push({
      id: `red_hand_stay_${round}`,
      group: "Red Hand",
      label: "Red draws 2 cards",
      sublabel: "stays on initial card",
      odds: 2.25,
      side: "red",
      type: "hand_size_exact",
      count: 2,
      round,
    });
    markets.push({
      id: `red_hand_hit_${round}`,
      group: "Red Hand",
      label: "Red draws 3+ cards",
      sublabel: "hits at least once",
      odds: 1.52,
      side: "red",
      type: "hand_size_plus",
      round,
    });
  }

  // ── Blue hand size (before blue acts)
  if (phase === "AwaitingAction_Blue" && blue.hand.length <= 1) {
    markets.push({
      id: `blue_hand_stay_${round}`,
      group: "Blue Hand",
      label: "Blue draws 2 cards",
      sublabel: "stays on initial card",
      odds: 2.25,
      side: "blue",
      type: "hand_size_exact",
      count: 2,
      round,
    });
    markets.push({
      id: `blue_hand_hit_${round}`,
      group: "Blue Hand",
      label: "Blue draws 3+ cards",
      sublabel: "hits at least once",
      odds: 1.52,
      side: "blue",
      type: "hand_size_plus",
      round,
    });
  }

  // ── Score range bets (after both have acted)
  if (["AwaitingFinalRevealVRF", "ReadyToResolve"].includes(phase)) {
    markets.push({
      id: `red_score_perfect_${round}`,
      group: "Final Scores",
      label: "Red scores 19–21",
      sublabel: "near-perfect hand",
      odds: 2.4,
      side: "red",
      type: "score_range",
      target: "red",
      min: 19, max: 21,
      round,
    });
    markets.push({
      id: `red_bust_${round}`,
      group: "Final Scores",
      label: "Red busts",
      sublabel: "ends above 21",
      odds: 3.2,
      side: "red",
      type: "score_range",
      target: "red",
      min: 22, max: 999,
      round,
    });
    markets.push({
      id: `blue_score_perfect_${round}`,
      group: "Final Scores",
      label: "Blue scores 19–21",
      sublabel: "near-perfect hand",
      odds: 2.4,
      side: "blue",
      type: "score_range",
      target: "blue",
      min: 19, max: 21,
      round,
    });
    markets.push({
      id: `blue_bust_${round}`,
      group: "Final Scores",
      label: "Blue busts",
      sublabel: "ends above 21",
      odds: 3.2,
      side: "blue",
      type: "score_range",
      target: "blue",
      min: 22, max: 999,
      round,
    });
  }

  // ── Sudden death
  if (phase === "AwaitingTiebreakerVRF") {
    markets.push({
      id: `sd_red_${round}`,
      group: "Sudden Death",
      label: "Red survives",
      sublabel: "wins the tiebreaker draw",
      odds: 1.95,
      side: "red",
      type: "tiebreaker_winner",
      round,
    });
    markets.push({
      id: `sd_blue_${round}`,
      group: "Sudden Death",
      label: "Blue survives",
      sublabel: "wins the tiebreaker draw",
      odds: 1.95,
      side: "blue",
      type: "tiebreaker_winner",
      round,
    });
    markets.push({
      id: `sd_again_${round}`,
      group: "Sudden Death",
      label: "Still tied after draw",
      sublabel: "another tiebreaker needed",
      odds: 12.0,
      side: "neutral",
      type: "tiebreaker_retie",
      round,
    });
  }

  return markets;
}

/**
 * Attempt to resolve active bets given new game state.
 * Returns { resolved, remaining, balanceDelta }
 */
export function resolveActiveBets(activeBets, gameState) {
  const { phase, round, red, blue, winner, roundHistory } = gameState;
  const resolved = [];
  const remaining = [];

  activeBets.forEach(bet => {
    let won = null;

    if (bet.type === "match_winner" && phase === "Ended") {
      won = winner === bet.side;
    }

    else if (bet.type === "round_winner" && bet.round < round) {
      const entry = roundHistory.find(h => h.round === bet.round);
      if (entry) won = entry.loser !== bet.side;
    }

    else if (bet.type === "round_tie" && bet.round < round) {
      // Simplified: if we moved past the round, a tie would've kept us in sudden death
      // In practice, resolve as false unless there was an actual tie entry
      won = false;
    }

    else if (bet.type === "score_range") {
      // Can resolve once river is dealt (ReadyToResolve or later)
      const inResolveOrLater = ["ReadyToResolve","AwaitingTiebreakerVRF","AwaitingInitialDeal","Ended"].includes(phase);
      if (inResolveOrLater && bet.round <= round) {
        const sc = bet.target === "red" ? red.score : blue.score;
        won = sc >= bet.min && sc <= bet.max;
      }
    }

    else if (bet.type === "hand_size_exact") {
      // Can resolve when the relevant player has finalized their hand
      const isRiver = ["AwaitingFinalRevealVRF","ReadyToResolve","AwaitingTiebreakerVRF","AwaitingInitialDeal","Ended"].includes(phase);
      if (isRiver && bet.round <= round) {
        const handLength = bet.side === "red" ? red.hand.length : blue.hand.length;
        won = handLength === bet.count;
      }
    }

    else if (bet.type === "hand_size_plus") {
      const isRiver = ["AwaitingFinalRevealVRF","ReadyToResolve","AwaitingTiebreakerVRF","AwaitingInitialDeal","Ended"].includes(phase);
      if (isRiver && bet.round <= round) {
        const handLength = bet.side === "red" ? red.hand.length : blue.hand.length;
        won = handLength >= 3;
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
