// ─────────────────────────────────────────────────────────────
// GAME LOGIC — constants, helpers, pure reducer
// ─────────────────────────────────────────────────────────────

export const INITIAL_HP = 10;
export const RANKS = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
export const SUITS = ["spades","hearts","diamonds","clubs"];
export const SUIT_SYMBOL = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" };
export const RED_SUITS = ["hearts", "diamonds"];

export function getCardValue(rank) {
  if (["J", "Q", "K"].includes(rank)) return 10;
  if (rank === "A") return 11;
  return parseInt(rank, 10);
}

export function calcScore(cards) {
  let score = cards.reduce((sum, c) => sum + c.value, 0);
  let aces = cards.filter(c => c.rank === "A").length;
  while (score > 21 && aces > 0) { score -= 10; aces--; }
  return score;
}

export function absDiff21(score) {
  return Math.abs(21 - score);
}

export function getDamage(round) {
  return Math.pow(2, round - 1);
}

export function drawCard(prefix = "") {
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  return {
    rank, suit,
    value: getCardValue(rank),
    id: `${prefix}_${rank}_${suit}_${Math.random().toString(36).slice(2, 7)}`,
  };
}

export function makePlayer() {
  return { hand: [], score: 0, stayed: false, hp: INITIAL_HP };
}

export function makeInitialGameState() {
  return {
    phase: "AwaitingInitialDeal",
    round: 1,
    red: makePlayer(),
    blue: makePlayer(),
    river: { red: null, blue: null },
    lastDmg: 0,
    winner: null,
    log: [],
    tb: { red: [], blue: [] },
    active: null,
    roundHistory: [],
  };
}

function pushLog(state, msg) {
  return { ...state, log: [...state.log.slice(-99), msg] };
}

// Pure game reducer — no side effects
export function gameReducer(state, action) {
  switch (action.type) {

    case "DEAL": {
      const rc = drawCard("r"), bc = drawCard("b");
      return pushLog({
        ...state,
        phase: "AwaitingAction_Red",
        red: { ...state.red, hand: [rc], score: calcScore([rc]), stayed: false },
        blue: { ...state.blue, hand: [bc], score: calcScore([bc]), stayed: false },
        river: { red: null, blue: null },
        tb: { red: [], blue: [] },
        active: "red",
      }, `Round ${state.round} opened — Red drew ${rc.rank}${SUIT_SYMBOL[rc.suit]}, Blue drew ${bc.rank}${SUIT_SYMBOL[bc.suit]}`);
    }

    case "HIT": {
      const { player } = action;
      const card = drawCard(player[0]);
      const newHand = [...state[player].hand, card];
      const newScore = calcScore(newHand);
      const forced = newScore >= 21;
      const newP = { ...state[player], hand: newHand, score: newScore, stayed: forced };
      let s = { ...state, [player]: newP };

      if (player === "red") {
        if (forced && state.blue.stayed) { s.phase = "AwaitingFinalRevealVRF"; s.active = null; }
        else if (forced)                 { s.phase = "AwaitingAction_Blue"; s.active = "blue"; }
        else                             { s.phase = "AwaitingAction_Red"; s.active = "red"; }
      } else {
        if (forced) { s.phase = "AwaitingFinalRevealVRF"; s.active = null; }
        else        { s.phase = "AwaitingAction_Blue"; s.active = "blue"; }
      }
      return pushLog(s,
        `${player === "red" ? "Red" : "Blue"} hits → ${card.rank}${SUIT_SYMBOL[card.suit]} (score ${newScore})${forced ? " — forced stay" : ""}`
      );
    }

    case "STAY": {
      const { player } = action;
      const np = { ...state[player], stayed: true };
      let s = { ...state, [player]: np };
      if (player === "red") {
        s.phase = state.blue.stayed ? "AwaitingFinalRevealVRF" : "AwaitingAction_Blue";
        s.active = state.blue.stayed ? null : "blue";
      } else {
        s.phase = "AwaitingFinalRevealVRF";
        s.active = null;
      }
      return pushLog(s, `${player === "red" ? "Red" : "Blue"} stays at ${state[player].score}`);
    }

    case "RIVER": {
      const rr = drawCard("rr"), br = drawCard("br");
      const rh = [...state.red.hand, rr], bh = [...state.blue.hand, br];
      const rs = calcScore(rh), bs = calcScore(bh);
      return pushLog({
        ...state,
        phase: "ReadyToResolve",
        red: { ...state.red, hand: rh, score: rs },
        blue: { ...state.blue, hand: bh, score: bs },
        river: { red: rr, blue: br },
        active: null,
      }, `River revealed — Red +${rr.rank}${SUIT_SYMBOL[rr.suit]} (${rs}), Blue +${br.rank}${SUIT_SYMBOL[br.suit]} (${bs})`);
    }

    case "RESOLVE": {
      const rd = absDiff21(state.red.score), bd = absDiff21(state.blue.score);
      const dmg = getDamage(state.round);

      if (rd === bd) {
        return pushLog({ ...state, phase: "AwaitingTiebreakerVRF", lastDmg: dmg },
          `Scores tied at ±${rd} from 21 — sudden death! ${dmg} damage pending`
        );
      }

      const loser = rd > bd ? "red" : "blue";
      const newHp = Math.max(0, state[loser].hp - dmg);
      const over = newHp <= 0;
      const winner = over ? (loser === "red" ? "blue" : "red") : null;

      return pushLog({
        ...state,
        [loser]: { ...state[loser], hp: newHp },
        phase: over ? "Ended" : "AwaitingInitialDeal",
        round: over ? state.round : state.round + 1,
        lastDmg: dmg,
        winner,
        active: null,
        roundHistory: [...state.roundHistory, {
          round: state.round, loser, dmg,
          redScore: state.red.score, blueScore: state.blue.score,
        }],
      }, `${loser === "red" ? "Red" : "Blue"} takes ${dmg} dmg! (${state.red.score} vs ${state.blue.score})${over ? " — GAME OVER" : ""}`);
    }

    case "TIEBREAKER": {
      const rc = drawCard("tr"), bc = drawCard("tb");
      const rh = [...state.red.hand, rc], bh = [...state.blue.hand, bc];
      const rs = calcScore(rh), bs = calcScore(bh);
      const rd = absDiff21(rs), bd = absDiff21(bs);
      const dmg = state.lastDmg;
      const tied = rd === bd;
      const loser = tied ? null : rd > bd ? "red" : "blue";
      const nrh = loser === "red" ? Math.max(0, state.red.hp - dmg) : state.red.hp;
      const nbh = loser === "blue" ? Math.max(0, state.blue.hp - dmg) : state.blue.hp;
      const over = loser && (loser === "red" ? nrh : nbh) <= 0;
      const winner = over ? (loser === "red" ? "blue" : "red") : null;
      const phase = tied ? "AwaitingTiebreakerVRF" : over ? "Ended" : "AwaitingInitialDeal";

      return pushLog({
        ...state, phase, winner,
        red: { ...state.red, hand: rh, score: rs, hp: nrh },
        blue: { ...state.blue, hand: bh, score: bs, hp: nbh },
        tb: { red: [...state.tb.red, rc], blue: [...state.tb.blue, bc] },
        round: phase === "AwaitingInitialDeal" ? state.round + 1 : state.round,
        roundHistory: loser ? [...state.roundHistory, {
          round: state.round, loser, dmg, redScore: rs, blueScore: bs,
        }] : state.roundHistory,
      }, `Tiebreaker — Red ${rc.rank}${SUIT_SYMBOL[rc.suit]}(${rs}) vs Blue ${bc.rank}${SUIT_SYMBOL[bc.suit]}(${bs})${loser ? ` — ${loser} -${dmg} HP` : " — still tied!"}`);
    }

    case "RESET":
      return makeInitialGameState();

    default:
      return state;
  }
}

// Phase metadata used by UI
export const PHASE_META = {
  AwaitingInitialDeal:    { label: "Deal Phase",        short: "DEAL",         color: "neutral" },
  AwaitingAction_Red:     { label: "Red Agent's Turn",  short: "RED TURN",     color: "red" },
  AwaitingAction_Blue:    { label: "Blue Agent's Turn", short: "BLUE TURN",    color: "blue" },
  AwaitingFinalRevealVRF: { label: "River Incoming",    short: "RIVER VRF",    color: "purple" },
  ReadyToResolve:         { label: "Resolving Round",   short: "RESOLVING",    color: "amber" },
  AwaitingTiebreakerVRF:  { label: "Sudden Death",      short: "SUDDEN DEATH", color: "danger" },
  Ended:                  { label: "Game Over",         short: "ENDED",        color: "neutral" },
};
