export const formatNumber = (val, dec = 2) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: dec,
  }).format(Number(val) || 0);
};
