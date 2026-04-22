import { useState, useEffect } from "react";
import { SUIT_SYMBOL, RED_SUITS } from "./gameLogic";

/**
 * size: "sm" | "md" | "lg" | "xl"
 * isRiver: triggers face-down → flip reveal with delay
 * isTb: tiebreaker reveal
 * isNew: glows yellow briefly (last hit card)
 */
export function PlayingCard({ card, size = "md", isRiver = false, isTb = false, isNew = false }) {
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState(!isRiver && !isTb);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isRiver || isTb) {
      const delay = isRiver ? 580 : 200;
      const t1 = setTimeout(() => setFlipping(true), delay);
      const t2 = setTimeout(() => { setRevealed(true); setFlipping(false); }, delay + 360);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isRiver, isTb]);

  const isRed = RED_SUITS.includes(card.suit);

  const SIZES = {
    sm:  { w: 36, h: 50,  rankSize: 10, suitSize: 12, centerSize: 22 },
    md:  { w: 50, h: 70,  rankSize: 12, suitSize: 15, centerSize: 30 },
    lg:  { w: 64, h: 90,  rankSize: 15, suitSize: 19, centerSize: 40 },
    xl:  { w: 80, h: 112, rankSize: 18, suitSize: 23, centerSize: 50 },
  };

  const s = SIZES[size] || SIZES.md;

  const baseStyle = {
    width: s.w,
    height: s.h,
    borderRadius: 9,
    flexShrink: 0,
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.35s cubic-bezier(0.34,1.2,0.64,1), opacity 0.25s ease",
    transform: `translateY(${visible ? 0 : -10}px) scaleX(${flipping ? 0.02 : 1})`,
    opacity: visible ? 1 : 0,
    willChange: "transform",
  };

  if (!revealed) {
    return (
      <div style={{
        ...baseStyle,
        background: "linear-gradient(145deg, #1c2d4a 0%, #0e1929 100%)",
        border: "1px solid rgba(99, 140, 220, 0.18)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
      }}>
        <div style={{
          position: "absolute", inset: 4,
          border: "1px solid rgba(99,140,220,0.1)",
          borderRadius: 5,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(99,140,220,0.04) 0px, rgba(99,140,220,0.04) 1px, transparent 1px, transparent 8px)",
        }} />
      </div>
    );
  }

  const glowShadow = isRiver
    ? `0 0 20px ${isRed ? "rgba(251,113,133,0.35)" : "rgba(96,165,250,0.35)"}, 0 4px 14px rgba(0,0,0,0.3)`
    : isTb
    ? "0 0 20px rgba(251,191,36,0.35), 0 4px 14px rgba(0,0,0,0.3)"
    : isNew
    ? "0 0 16px rgba(251,191,36,0.4), 0 4px 12px rgba(0,0,0,0.25)"
    : "0 4px 14px rgba(0,0,0,0.25)";

  return (
    <div style={{
      ...baseStyle,
      background: "linear-gradient(160deg, #ffffff 0%, #f8f8f8 100%)",
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: glowShadow,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "4px 5px",
    }}>
      {/* River/TB glow overlay */}
      {(isRiver || isTb) && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 9, pointerEvents: "none",
          boxShadow: isRiver
            ? `inset 0 0 12px ${isRed ? "rgba(239,68,68,0.22)" : "rgba(59,130,246,0.22)"}`
            : "inset 0 0 12px rgba(234,179,8,0.28)",
        }} />
      )}

      {/* Top-left rank + suit */}
      <div style={{ color: isRed ? "#dc2626" : "#111827", lineHeight: 1 }}>
        <div style={{ fontSize: s.rankSize, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "Georgia, serif" }}>
          {card.rank}
        </div>
        <div style={{ fontSize: s.suitSize, lineHeight: 1.1 }}>
          {SUIT_SYMBOL[card.suit]}
        </div>
      </div>

      {/* Center suit watermark */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}>
        <span style={{
          fontSize: s.centerSize,
          color: isRed ? "rgba(220,38,38,0.07)" : "rgba(17,24,39,0.07)",
          userSelect: "none",
        }}>
          {SUIT_SYMBOL[card.suit]}
        </span>
      </div>

      {/* Bottom-right (rotated) */}
      <div style={{
        color: isRed ? "#dc2626" : "#111827",
        lineHeight: 1,
        transform: "rotate(180deg)",
        alignSelf: "flex-end",
      }}>
        <div style={{ fontSize: s.rankSize, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "Georgia, serif" }}>
          {card.rank}
        </div>
        <div style={{ fontSize: s.suitSize, lineHeight: 1.1 }}>
          {SUIT_SYMBOL[card.suit]}
        </div>
      </div>
    </div>
  );
}
