import { useState, useEffect, useRef, useCallback } from "react";
import {
  generateMarkets,
  resolveActiveBets,
  makeBetState,
} from "./bettingLogic";

// ─────────────────────────────────────────────────────────────
// BET MARKET CARD
// ─────────────────────────────────────────────────────────────
function MarketCard({ market, onPlace, balance, existingBet }) {
  const [expanded, setExpanded] = useState(false);
  const [amount, setAmount] = useState(10);

  const isRed = market.side === "red";
  const isBlue = market.side === "blue";
  const accentColor = isRed ? "#fb7185" : isBlue ? "#60a5fa" : "#a78bfa";
  const potential = (amount * market.odds).toFixed(2);
  const alreadyBet = !!existingBet;

  const QUICK_AMOUNTS = [5, 10, 25, 50, 100, 250];

  return (
    <div
      style={{
        borderRadius: 11,
        border: `1px solid ${expanded && !alreadyBet ? `${accentColor}28` : "rgba(255,255,255,0.07)"}`,
        background:
          expanded && !alreadyBet
            ? `rgba(${isRed ? "251,113,133" : isBlue ? "96,165,250" : "167,139,250"},0.04)`
            : "rgba(255,255,255,0.02)",
        overflow: "hidden",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {/* Main row */}
      <button
        onClick={() => !alreadyBet && setExpanded((e) => !e)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "10px 12px",
          background: "transparent",
          border: "none",
          cursor: alreadyBet ? "default" : "pointer",
          gap: 10,
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.35,
            }}
          >
            {market.label}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              marginTop: 2,
              lineHeight: 1.3,
            }}
          >
            {market.sublabel}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {alreadyBet && (
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#4ade80",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: 5,
                padding: "2px 6px",
              }}
            >
              ${existingBet.amount}
            </div>
          )}
          {/* Odds pill */}
          <div
            style={{
              padding: "5px 10px",
              borderRadius: 8,
              background: `${accentColor}14`,
              border: `1px solid ${accentColor}30`,
              minWidth: 46,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: accentColor,
                lineHeight: 1,
              }}
            >
              {market.odds.toFixed(2)}x
            </span>
          </div>
        </div>
      </button>

      {/* Expanded bet form */}
      {expanded && !alreadyBet && (
        <div
          style={{
            padding: "0 12px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            animation: "slideDown 0.18s ease",
          }}
        >
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

          {/* Quick amounts */}
          <div style={{ display: "flex", gap: 4 }}>
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                style={{
                  flex: 1,
                  padding: "4px 2px",
                  borderRadius: 7,
                  fontSize: 10,
                  fontWeight: 700,
                  border: `1px solid ${amount === a ? `${accentColor}40` : "rgba(255,255,255,0.07)"}`,
                  background:
                    amount === a
                      ? `${accentColor}18`
                      : "rgba(255,255,255,0.03)",
                  color: amount === a ? accentColor : "rgba(255,255,255,0.38)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                ${a}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span
                style={{
                  position: "absolute",
                  left: 9,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  pointerEvents: "none",
                }}
              >
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    Math.min(
                      balance,
                      Math.max(1, parseInt(e.target.value) || 1),
                    ),
                  )
                }
                style={{
                  width: "100%",
                  padding: "7px 8px 7px 20px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.85)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              →{" "}
              <span style={{ color: accentColor, fontWeight: 700 }}>
                ${potential}
              </span>
            </div>
          </div>

          {/* Place button */}
          <button
            onClick={() => {
              if (amount <= balance && amount >= 1) {
                onPlace(market, amount);
                setExpanded(false);
              }
            }}
            disabled={amount > balance || amount < 1}
            style={{
              width: "100%",
              padding: "9px",
              borderRadius: 9,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.04em",
              cursor: amount > balance ? "not-allowed" : "pointer",
              opacity: amount > balance ? 0.35 : 1,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}45`,
              color: accentColor,
              transition: "opacity 0.2s",
            }}
          >
            Place ${amount} · Win ${potential}
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ACTIVE BET ROW
// ─────────────────────────────────────────────────────────────
function ActiveBetRow({ bet }) {
  const isRed = bet.side === "red";
  const isBlue = bet.side === "blue";
  const accentColor = isRed ? "#fb7185" : isBlue ? "#60a5fa" : "#a78bfa";

  return (
    <div
      style={{
        padding: "9px 12px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          {bet.label}
        </div>
        <div
          style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 1 }}
        >
          ${bet.amount} @ {bet.odds.toFixed(2)}x
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24" }}>
          ${(bet.amount * bet.odds).toFixed(0)}
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
          potential
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESOLVED BET ROW
// ─────────────────────────────────────────────────────────────
function ResolvedBetRow({ bet }) {
  return (
    <div
      style={{
        padding: "9px 12px",
        borderRadius: 10,
        background: bet.won ? "rgba(74,222,128,0.04)" : "rgba(239,68,68,0.04)",
        border: `1px solid ${bet.won ? "rgba(74,222,128,0.12)" : "rgba(239,68,68,0.12)"}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: bet.won ? "rgba(74,222,128,0.85)" : "rgba(239,68,68,0.72)",
          }}
        >
          {bet.won ? "✓" : "✗"} {bet.label}
        </div>
        <div
          style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", marginTop: 1 }}
        >
          ${bet.amount} staked
        </div>
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: bet.won ? "#4ade80" : "#f87171",
        }}
      >
        {bet.won
          ? `+$${(bet.payout - bet.amount).toFixed(0)}`
          : `-$${bet.amount}`}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ORACLE LOG
// ─────────────────────────────────────────────────────────────
function OracleLog({ logs }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#22c55e",
            animation: "pulse 2s infinite",
          }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(255,255,255,0.28)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Oracle Log
        </span>
        <span
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.18)",
            marginLeft: "auto",
          }}
        >
          {logs.length} events
        </span>
      </div>
      <div
        ref={ref}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {logs.length === 0 ? (
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.2)",
              fontStyle: "italic",
              padding: "4px 0",
            }}
          >
            Awaiting first deal...
          </div>
        ) : (
          logs.map((entry, i) => (
            <div
              key={i}
              style={{
                fontSize: 10,
                padding: "3px 7px",
                borderRadius: 5,
                background:
                  i === logs.length - 1
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                color:
                  i === logs.length - 1
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(255,255,255,0.22)",
                lineHeight: 1.4,
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.15)",
                  marginRight: 6,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB BUTTON
// ─────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: "8px 8px 0 0",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        background: active ? "rgba(255,255,255,0.07)" : "transparent",
        border: `1px solid ${active ? "rgba(255,255,255,0.09)" : "transparent"}`,
        borderBottom: active
          ? "1px solid var(--panel-bg, #171a24)"
          : "1px solid transparent",
        color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.32)",
        display: "flex",
        alignItems: "center",
        gap: 5,
        marginBottom: "-1px",
        transition: "color 0.2s",
      }}
    >
      {children}
      {count > 0 && (
        <span
          style={{
            fontSize: 9,
            fontVariantNumeric: "tabular-nums",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "1px 5px",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// PREDICTION PANEL — main exported component
// ─────────────────────────────────────────────────────────────
export function PredictionPanel({ gameState }) {
  const [bets, setBets] = useState(makeBetState());
  const [tab, setTab] = useState("markets");

  // Resolve bets whenever game phase/round changes
  useEffect(() => {
    if (!gameState || bets.active.length === 0) return;
    const { resolved, remaining, balanceDelta } = resolveActiveBets(
      bets.active,
      gameState,
    );
    if (resolved.length > 0) {
      setBets((prev) => ({
        balance: prev.balance + balanceDelta,
        active: remaining,
        history: [...prev.history, ...resolved],
      }));
    }
  }, [gameState?.phase, gameState?.round]);

  const handlePlace = useCallback(
    (market, amount) => {
      setBets((prev) => {
        if (amount > prev.balance || amount < 1) return prev;
        return {
          ...prev,
          balance: prev.balance - amount,
          active: [
            ...prev.active,
            {
              id: `${market.id}_${Date.now()}`,
              betId: market.id,
              label: market.label,
              amount,
              odds: market.odds,
              type: market.type,
              side: market.side,
              target: market.target,
              round: market.round || gameState?.round || 1,
              min: market.min,
              max: market.max,
            },
          ],
        };
      });
    },
    [gameState?.round],
  );

  const markets = gameState ? generateMarkets(gameState) : [];
  const groups = [...new Set(markets.map((m) => m.group))];

  const netWon = bets.history
    .filter((b) => b.won)
    .reduce((s, b) => s + b.payout - b.amount, 0);
  const netLost = bets.history
    .filter((b) => !b.won)
    .reduce((s, b) => s + b.amount, 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* ── Balance header ── */}
      <div
        style={{
          padding: "16px 18px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Balance
          </span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ${bets.balance.toFixed(0)}
          </span>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <div
            style={{
              padding: "7px 10px",
              borderRadius: 9,
              background: "rgba(74,222,128,0.07)",
              border: "1px solid rgba(74,222,128,0.14)",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "rgba(74,222,128,0.55)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 2,
              }}
            >
              Won
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#4ade80",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              +${netWon.toFixed(0)}
            </div>
          </div>
          <div
            style={{
              padding: "7px 10px",
              borderRadius: 9,
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.14)",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "rgba(239,68,68,0.55)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 2,
              }}
            >
              Lost
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#f87171",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              -${netLost.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          padding: "8px 18px 0",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          gap: 3,
        }}
      >
        <TabBtn
          active={tab === "markets"}
          onClick={() => setTab("markets")}
          count={markets.length}
        >
          Markets
        </TabBtn>
        <TabBtn
          active={tab === "mybets"}
          onClick={() => setTab("mybets")}
          count={bets.active.length + bets.history.length}
        >
          My Bets
        </TabBtn>
      </div>

      {/* ── Markets / My Bets content ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          minHeight: 0,
        }}
      >
        {tab === "markets" &&
          (markets.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingTop: 32,
              }}
            >
              <span style={{ fontSize: 28, opacity: 0.15 }}>📊</span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.22)",
                  textAlign: "center",
                }}
              >
                Markets open when the game starts
              </span>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.28)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 8,
                    paddingLeft: 1,
                  }}
                >
                  {group}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  {markets
                    .filter((m) => m.group === group)
                    .map((market) => (
                      <MarketCard
                        key={market.id}
                        market={market}
                        onPlace={handlePlace}
                        balance={bets.balance}
                        existingBet={bets.active.find(
                          (ab) => ab.betId === market.id,
                        )}
                      />
                    ))}
                </div>
              </div>
            ))
          ))}

        {tab === "mybets" &&
          (bets.active.length === 0 && bets.history.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingTop: 32,
              }}
            >
              <span style={{ fontSize: 28, opacity: 0.15 }}>🎯</span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.22)",
                  textAlign: "center",
                }}
              >
                No bets placed yet
              </span>
            </div>
          ) : (
            <>
              {bets.active.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.28)",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: 8,
                    }}
                  >
                    Active
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    {bets.active.map((bet) => (
                      <ActiveBetRow key={bet.id} bet={bet} />
                    ))}
                  </div>
                </div>
              )}
              {bets.history.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.28)",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: 8,
                    }}
                  >
                    History
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    {[...bets.history].reverse().map((bet) => (
                      <ResolvedBetRow key={bet.id} bet={bet} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ))}
      </div>

      {/* ── Oracle Log (always visible at bottom) ── */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "12px 18px",
          height: 180,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <OracleLog logs={gameState?.log || []} />
      </div>

      {/* ── Disclaimer ── */}
      <div
        style={{
          padding: "7px 18px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.18)",
            textAlign: "center",
            letterSpacing: "0.04em",
          }}
        >
          Simulated markets · No real funds
        </div>
      </div>
    </div>
  );
}
