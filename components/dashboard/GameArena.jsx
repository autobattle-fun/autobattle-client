import { useReducer, useCallback, useState, useEffect } from "react";
import {
  gameReducer,
  makeInitialGameState,
  getDamage,
  absDiff21,
  INITIAL_HP,
  PHASE_META,
} from "./gameLogic";
import { PlayingCard } from "./PlayingCard";

// ─────────────────────────────────────────────────────────────
// HP BAR
// ─────────────────────────────────────────────────────────────
function HPBar({ hp, player, isActive, compact = false }) {
  const pct = Math.max(0, (hp / INITIAL_HP) * 100);
  const crit = hp <= 2;
  const low = hp <= 4;
  const isRed = player === "red";

  const trackColor = "rgba(255,255,255,0.07)";
  const fillColor = crit
    ? "#ef4444"
    : low
      ? "#f97316"
      : isRed
        ? "#fb7185"
        : "#60a5fa";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: compact ? 3 : 5 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: compact ? 6 : 8,
              height: compact ? 6 : 8,
              borderRadius: "50%",
              background: fillColor,
              boxShadow: isActive ? `0 0 10px ${fillColor}` : "none",
              transition: "box-shadow 0.4s ease",
            }}
          />
          <span
            className={
              compact
                ? "text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted"
                : "text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted"
            }
          >
            {isRed ? "Red Agent" : "Blue Agent"}
          </span>
          {isActive && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: fillColor,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                animation: "pulse 1.5s infinite",
              }}
            >
              ACTIVE
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: compact ? 13 : 15,
            fontWeight: 900,
            color: crit
              ? "#ef4444"
              : "color-mix(in srgb, var(--foreground) 86%, transparent)",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {hp}
          <span
            style={{
              fontSize: compact ? 9 : 10,
              opacity: 0.4,
              fontWeight: 500,
            }}
          >
            /{INITIAL_HP}
          </span>
        </span>
      </div>

      {/* Bar track */}
      <div
        style={{
          height: compact ? 5 : 7,
          borderRadius: 4,
          background: trackColor,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            background: fillColor,
            borderRadius: 4,
            transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: isActive ? `0 0 8px ${fillColor}60` : "none",
          }}
        />
      </div>

      {/* Pip indicators */}
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: INITIAL_HP }).map((_, i) => (
          <div
            key={i}
            style={{
              height: compact ? 2 : 3,
              flex: 1,
              borderRadius: 2,
              background: i < hp ? fillColor : "rgba(255,255,255,0.07)",
              transition: "background 0.35s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PLAYER ZONE (top / bottom)
// ─────────────────────────────────────────────────────────────
function PlayerZone({ player, ps, river, tbCards, isActive, flip = false }) {
  const isRed = player === "red";
  const bust = ps.score > 21;
  const is21 = ps.score === 21;
  const accentColor = isRed ? "#fb7185" : "#60a5fa";
  const accentRgb = isRed ? "251,113,133" : "96,165,250";

  // Main cards excluding river and tiebreaker
  const mainCards = ps.hand.slice(
    0,
    ps.hand.length - (river ? 1 : 0) - tbCards.length,
  );

  const statusLabel = bust ? "BUST" : is21 ? "21!" : ps.stayed ? "STOOD" : "";
  const statusColor = bust ? "#ef4444" : is21 ? "#fbbf24" : accentColor;

  const scoreColor = bust
    ? "#ef4444"
    : is21
      ? "#fbbf24"
      : isActive
        ? accentColor
        : "color-mix(in srgb, var(--foreground) 90%, transparent)";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: flip ? "column-reverse" : "column",
        gap: 14,
        padding: "18px 24px",
        position: "relative",
        background: isActive
          ? `radial-gradient(ellipse at ${flip ? "bottom" : "top"} center, rgba(${accentRgb},0.06) 0%, transparent 70%)`
          : "transparent",
        transition: "background 0.5s ease",
        borderBottom: flip ? "none" : "none",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          order: flip ? 1 : 0,
        }}
      >
        {/* Agent identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: isActive ? `0 0 14px ${accentColor}` : "none",
              transition: "box-shadow 0.4s ease",
            }}
          />
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "color-mix(in srgb, var(--foreground) 88%, transparent)",
                letterSpacing: "-0.01em",
              }}
            >
              {isRed ? "Red Agent" : "Blue Agent"}
            </div>
            {statusLabel && (
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: statusColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginTop: 1,
                }}
              >
                {statusLabel}
              </div>
            )}
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: scoreColor,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontVariantNumeric: "tabular-nums",
              fontFamily: "Georgia, 'Times New Roman', serif",
              transition: "color 0.3s ease",
            }}
          >
            {ps.score}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "color-mix(in srgb, var(--foreground) 42%, transparent)",
              marginTop: 2,
            }}
          >
            ±{absDiff21(ps.score)} from 21
          </div>
        </div>
      </div>

      {/* Cards row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          minHeight: 112,
          order: flip ? 0 : 1,
        }}
      >
        {mainCards.map((card, i) => (
          <PlayingCard
            key={card.id}
            card={card}
            size="xl"
            isNew={i === mainCards.length - 1 && mainCards.length > 1}
          />
        ))}
        {river && <PlayingCard key={river.id} card={river} size="xl" isRiver />}
        {tbCards.map((card) => (
          <PlayingCard key={card.id} card={card} size="xl" isTb />
        ))}
        {ps.hand.length === 0 && (
          <div
            style={{
              width: 80,
              height: 112,
              borderRadius: 9,
              border: "1.5px dashed rgba(255,255,255,0.1)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <span style={{ fontSize: 22, opacity: 0.15 }}>?</span>
          </div>
        )}
        {ps.hand.length === 0 && (
          <div
            style={{
              width: 80,
              height: 112,
              borderRadius: 9,
              border: "1.5px dashed rgba(255,255,255,0.06)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <span style={{ fontSize: 22, opacity: 0.07 }}>?</span>
          </div>
        )}
      </div>

      {/* Score bar */}
      <div
        style={{
          height: 2,
          borderRadius: 1,
          background: "rgba(255,255,255,0.05)",
          overflow: "hidden",
          order: flip ? -1 : 2,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min((ps.score / 21) * 100, 100)}%`,
            background: scoreColor,
            borderRadius: 1,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CENTER DIVIDER — phase indicator + action controls overlay
// ─────────────────────────────────────────────────────────────
function CenterStrip({ game, dispatch }) {
  const { phase, round, red, blue, active, winner } = game;
  const meta = PHASE_META[phase];
  const dmg = getDamage(round);

  const COLOR_MAP = {
    red: { text: "#fb7185", glow: "rgba(251,113,133,0.15)" },
    blue: { text: "#60a5fa", glow: "rgba(96,165,250,0.15)" },
    purple: { text: "#c084fc", glow: "rgba(192,132,252,0.15)" },
    amber: { text: "#fbbf24", glow: "rgba(251,191,36,0.15)" },
    danger: { text: "#fde047", glow: "rgba(253,224,71,0.2)" },
    neutral: { text: "rgba(255,255,255,0.5)", glow: "transparent" },
  };
  const { text: phaseColor, glow: phaseGlow } = COLOR_MAP[meta.color];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 64,
        flexShrink: 0,
        position: "relative",
        background: "rgba(255,255,255,0.025)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: phase label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: phaseColor,
            boxShadow: `0 0 8px ${phaseColor}`,
            animation: [
              "AwaitingAction_Red",
              "AwaitingAction_Blue",
              "AwaitingTiebreakerVRF",
            ].includes(phase)
              ? "pulse 1.4s infinite"
              : "none",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: phaseColor,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            animation:
              phase === "AwaitingTiebreakerVRF"
                ? "pulse 1.2s infinite"
                : "none",
          }}
        >
          {meta.label}
        </span>
      </div>

      {/* Center: action buttons */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {phase === "AwaitingInitialDeal" && (
          <GhostButton
            onClick={() => dispatch({ type: "DEAL" })}
            accent="#e2e2e2"
            strong
          >
            Deal Cards
          </GhostButton>
        )}

        {(phase === "AwaitingAction_Red" || phase === "AwaitingAction_Blue") &&
          active && (
            <>
              <GhostButton
                onClick={() => dispatch({ type: "HIT", player: active })}
                accent={active === "red" ? "#fb7185" : "#60a5fa"}
              >
                Hit
              </GhostButton>
              <GhostButton
                onClick={() => dispatch({ type: "STAY", player: active })}
                accent="rgba(255,255,255,0.5)"
              >
                Stay
              </GhostButton>
            </>
          )}

        {phase === "AwaitingFinalRevealVRF" && (
          <GhostButton
            onClick={() => dispatch({ type: "RIVER" })}
            accent="#c084fc"
            pulse
          >
            Reveal River
          </GhostButton>
        )}

        {phase === "ReadyToResolve" && (
          <GhostButton
            onClick={() => dispatch({ type: "RESOLVE" })}
            accent="#fbbf24"
          >
            Resolve Round
          </GhostButton>
        )}

        {phase === "AwaitingTiebreakerVRF" && (
          <GhostButton
            onClick={() => dispatch({ type: "TIEBREAKER" })}
            accent="#fde047"
            pulse
          >
            Draw Tiebreaker
          </GhostButton>
        )}

        {phase === "Ended" && !winner && (
          <GhostButton
            onClick={() => dispatch({ type: "RESET" })}
            accent="#e2e2e2"
          >
            New Game
          </GhostButton>
        )}
      </div>

      {/* Right: round + damage */}
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 9,
              color: "color-mix(in srgb, var(--foreground) 45%, transparent)",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
            }}
          >
            Round
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "color-mix(in srgb, var(--foreground) 76%, transparent)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {round}
          </div>
        </div>
        <div
          style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)" }}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 9,
              color: "color-mix(in srgb, var(--foreground) 45%, transparent)",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
            }}
          >
            Damage
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#fbbf24",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {dmg}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GHOST BUTTON
// ─────────────────────────────────────────────────────────────
function GhostButton({
  onClick,
  children,
  accent,
  pulse = false,
  strong = false,
}) {
  const [press, setPress] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      style={{
        padding: "7px 18px",
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        cursor: "pointer",
        border: `1px solid ${accent}40`,
        background: strong ? `${accent}15` : `${accent}0d`,
        color: accent,
        transform: press ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.1s ease, background 0.15s ease",
        animation: pulse ? "pulse 1.3s ease-in-out infinite" : "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// SCORE COMPARISON BAR (shown during resolve phases)
// ─────────────────────────────────────────────────────────────
function ScoreCompare({ red, blue }) {
  const rd = absDiff21(red.score),
    bd = absDiff21(blue.score);
  const tied = rd === bd;
  const redWins = !tied && rd < bd;
  const blueWins = !tied && bd < rd;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: "10px 24px",
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}
    >
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: redWins
              ? "#fb7185"
              : "color-mix(in srgb, var(--foreground) 32%, transparent)",
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {red.score}
        </span>
        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: redWins
                ? "#fb7185"
                : "color-mix(in srgb, var(--foreground) 34%, transparent)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {redWins ? "WINS" : tied ? "TIE" : "LOSES"}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "color-mix(in srgb, var(--foreground) 40%, transparent)",
            }}
          >
            ±{rd} from 21
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "color-mix(in srgb, var(--foreground) 35%, transparent)",
          padding: "0 16px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {tied ? "⚡ TIED" : "VS"}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: "flex-end",
        }}
      >
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: blueWins
                ? "#60a5fa"
                : "color-mix(in srgb, var(--foreground) 34%, transparent)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {blueWins ? "WINS" : tied ? "TIE" : "LOSES"}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "color-mix(in srgb, var(--foreground) 40%, transparent)",
            }}
          >
            ±{bd} from 21
          </div>
        </div>
        <span
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: blueWins
              ? "#60a5fa"
              : "color-mix(in srgb, var(--foreground) 32%, transparent)",
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {blue.score}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WINNER OVERLAY
// ─────────────────────────────────────────────────────────────
function WinnerOverlay({ winner, onReset }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  const isRed = winner === "red";
  const color = isRed ? "#fb7185" : "#60a5fa";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.86)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: vis ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "44px 60px",
          borderRadius: 24,
          border: `1px solid ${color}28`,
          background: "rgba(10,10,16,0.95)",
          boxShadow: `0 0 80px ${color}18, 0 24px 64px rgba(0,0,0,0.5)`,
          transform: vis
            ? "scale(1) translateY(0)"
            : "scale(0.88) translateY(20px)",
          transition: "transform 0.5s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        <div style={{ fontSize: 52, lineHeight: 1 }}>🏆</div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.22)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: 6,
            }}
          >
            VICTORY
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color,
              letterSpacing: "-0.02em",
            }}
          >
            {isRed ? "Red Agent" : "Blue Agent"}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              marginTop: 6,
            }}
          >
            wins the match
          </div>
        </div>
        <GhostButton onClick={onReset} accent="#e2e2e2" strong>
          Play Again
        </GhostButton>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GAME ARENA — main exported component
// ─────────────────────────────────────────────────────────────
export function GameArena({ onGameEvent }) {
  const [game, dispatch] = useReducer(gameReducer, makeInitialGameState());
  const { phase, round, red, blue, river, tb, winner, log, active } = game;

  const showCompare =
    ["ReadyToResolve", "AwaitingTiebreakerVRF", "Ended"].includes(phase) &&
    red.hand.length > 0;

  // Notify parent of game state changes for betting resolution
  useEffect(() => {
    if (onGameEvent) onGameEvent(game);
  }, [game, onGameEvent]);

  const handleDispatch = useCallback((action) => {
    dispatch(action);
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top HP bars */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 16,
          padding: "14px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <HPBar hp={red.hp} player="red" isActive={active === "red"} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            padding: "0 8px",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "color-mix(in srgb, var(--foreground) 40%, transparent)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Round
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "color-mix(in srgb, var(--foreground) 74%, transparent)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {round}
          </span>
        </div>
        <HPBar hp={blue.hp} player="blue" isActive={active === "blue"} />
      </div>

      {/* Score comparison strip (only when relevant) */}
      {showCompare && <ScoreCompare red={red} blue={blue} />}

      {/* Red player zone (top) */}
      <PlayerZone
        player="red"
        ps={red}
        river={river.red}
        tbCards={tb.red}
        isActive={active === "red"}
        flip={false}
      />

      {/* Center control strip */}
      <CenterStrip game={game} dispatch={handleDispatch} />

      {/* Blue player zone (bottom) */}
      <PlayerZone
        player="blue"
        ps={blue}
        river={river.blue}
        tbCards={tb.blue}
        isActive={active === "blue"}
        flip={true}
      />

      {/* Winner overlay */}
      {phase === "Ended" && winner && (
        <WinnerOverlay winner={winner} onReset={handleReset} />
      )}
    </div>
  );
}
