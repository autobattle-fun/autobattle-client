export function trimWalletAddress(address, visibleChars = 4) {
  if (!address || typeof address !== "string") {
    return "No wallet linked yet";
  }

  if (address.length <= visibleChars * 2 + 3) {
    return address;
  }

  return `${address.slice(0, visibleChars)}...${address.slice(-visibleChars)}`;
}
