export function oddsToCents(odds) {
  if (!odds || odds <= 0) return 50;
  const cents = Math.round((1 / odds) * 100);
  return Math.max(1, Math.min(99, cents));
}
