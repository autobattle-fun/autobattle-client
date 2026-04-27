export const SUIT_SYMBOLS = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export const SUIT_COLORS = {
  hearts: "text-red-600 dark:text-red-500",
  diamonds: "text-red-600 dark:text-red-500",
  clubs: "text-zinc-900 dark:text-zinc-100",
  spades: "text-zinc-900 dark:text-zinc-100",
};

export function drawRandomCard(existingCards = []) {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  let card;
  let isDuplicate = true;

  while (isDuplicate) {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];

    isDuplicate = existingCards.some((c) => c.suit === suit && c.rank === rank);

    if (!isDuplicate) {
      card = {
        id: Math.random().toString(36).substring(7),
        suit,
        rank,
        isFaceUp: true,
      };
    }
  }

  return card;
}

// "Smart Aces" -> Ace=11 unless over 21, then Ace=1
export function calculateScore(cards) {
  let score = 0;
  let aces = 0;

  for (const c of cards) {
    if (!c.isFaceUp) continue;
    if (c.rank === "A") {
      score += 11;
      aces += 1;
    } else if (["J", "Q", "K"].includes(c.rank)) {
      score += 10;
    } else {
      score += parseInt(c.rank);
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return { score, isBust: score > 21 };
}

export function getDamageValue(round) {
  return Math.pow(2, round - 1); // Round 1=1, 2=2, 3=4, 4=8
}
