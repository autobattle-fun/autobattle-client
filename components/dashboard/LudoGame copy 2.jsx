"use client";

import React, { useState, useEffect, useRef } from "react";

// ── CONSTANTS & GAME DATA ───────────────────────────────────────────────────
const SZ = 40;

const TRACK = (() => {
  const t = [];
  for (let r = 15; r >= 10; r--) t.push([7, r]);
  for (let c = 6; c >= 1; c--) t.push([c, 9]);
  t.push([1, 8]);
  for (let c = 1; c <= 6; c++) t.push([c, 7]);
  for (let r = 6; r >= 1; r--) t.push([7, r]);
  t.push([8, 1]);
  for (let r = 1; r <= 6; r++) t.push([9, r]);
  for (let c = 10; c <= 15; c++) t.push([c, 7]);
  t.push([15, 8]);
  for (let c = 15; c >= 10; c--) t.push([c, 9]);
  for (let r = 10; r <= 15; r++) t.push([9, r]);
  t.push([8, 15]);
  return t;
})();

const HOME_PATHS = {
  red: [
    [8, 14],
    [8, 13],
    [8, 12],
    [8, 11],
    [8, 10],
  ],
  green: [
    [2, 8],
    [3, 8],
    [4, 8],
    [5, 8],
    [6, 8],
  ],
  yellow: [
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 6],
  ],
  blue: [
    [14, 8],
    [13, 8],
    [12, 8],
    [11, 8],
    [10, 8],
  ],
};

const START_IDX = { red: 1, green: 14, yellow: 27, blue: 40 };
const SAFE_SET = new Set([1, 14, 27, 40, 9, 22, 35, 48]);
const COLORS = ["red", "green", "yellow", "blue"];
const CNAME = { red: "Red", green: "Green", yellow: "Yellow", blue: "Blue" };
const CHEX = {
  red: "#e53935",
  green: "#43a047",
  yellow: "#f9a825",
  blue: "#1e88e5",
};
const CDARK = {
  red: "#b71c1c",
  green: "#1b5e20",
  yellow: "#f57f17",
  blue: "#0d47a1",
};

const BASE_POS = {
  red: [
    [2, 11],
    [4, 11],
    [2, 13],
    [4, 13],
  ],
  green: [
    [2, 2],
    [4, 2],
    [2, 4],
    [4, 4],
  ],
  yellow: [
    [11, 2],
    [13, 2],
    [11, 4],
    [13, 4],
  ],
  blue: [
    [11, 11],
    [13, 11],
    [11, 13],
    [13, 13],
  ],
};

const DICE_PAT = {
  1: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 0, 0, 0, 0, 1],
  3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  4: [1, 0, 1, 0, 0, 0, 1, 0, 1],
  5: [1, 0, 1, 0, 1, 0, 1, 0, 1],
  6: [1, 0, 1, 1, 0, 1, 1, 0, 1],
};

const initialPawns = {};
COLORS.forEach((c) => {
  initialPawns[c] = [0, 1, 2, 3].map(() => ({ state: "base", progress: 0 }));
});

// ── UTILITIES ───────────────────────────────────────────────────────────────
function getCellFill(c, r) {
  if (c >= 1 && c <= 6 && r >= 10 && r <= 15) return CDARK.red;
  if (c >= 1 && c <= 6 && r >= 1 && r <= 6) return CDARK.green;
  if (c >= 10 && c <= 15 && r >= 1 && r <= 6) return CDARK.yellow;
  if (c >= 10 && c <= 15 && r >= 10 && r <= 15) return CDARK.blue;

  const inV = c >= 7 && c <= 9;
  const inH = r >= 7 && r <= 9;
  if (!inV && !inH) return null;
  if (c === 8 && r === 8) return "#ffffff";

  if (c === 8 && r >= 10 && r <= 14) return "#ffcdd2";
  if (c === 8 && r >= 2 && r <= 6) return "#fff9c4";
  if (r === 8 && c >= 2 && c <= 6) return "#c8e6c9";
  if (r === 8 && c >= 10 && c <= 14) return "#bbdefb";

  const ti = TRACK.findIndex(([tc, tr]) => tc === c && tr === r);
  if (ti === START_IDX.red) return "#e53935";
  if (ti === START_IDX.green) return "#43a047";
  if (ti === START_IDX.yellow) return "#f9a825";
  if (ti === START_IDX.blue) return "#1e88e5";

  return "#f5f0e8";
}

function getNextTurn(currentTurn, currentPawns) {
  let next = (currentTurn + 1) % 4;
  let safety = 0;
  while (
    currentPawns[COLORS[next]].every((p) => p.state === "won") &&
    safety < 4
  ) {
    next = (next + 1) % 4;
    safety++;
  }
  return next;
}

// ── COMPONENT ───────────────────────────────────────────────────────────────
export default function Ludo() {
  const [gameState, setGameState] = useState({
    turn: 0,
    dice: null,
    rolled: false,
    winner: null,
    msg: "Roll the dice to start.",
    pawns: initialPawns,
  });

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getPawnPos = (color, idx, pawnsState) => {
    const p = pawnsState[color][idx];
    if (p.state === "base") return BASE_POS[color][idx];
    if (p.state === "track") {
      const ti = (START_IDX[color] + p.progress) % 52;
      return TRACK[ti];
    }
    if (p.state === "home") {
      const hi = p.progress - 52;
      return HOME_PATHS[color][hi];
    }
    if (p.state === "won") return [8, 8];
    return null;
  };

  const checkIsMovable = (p, d) => {
    if (p.state === "won") return false;
    if (p.state === "base") return d === 6;
    return p.progress + d <= 57;
  };

  const handleRoll = () => {
    if (gameState.rolled || gameState.winner) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const d = Math.floor(Math.random() * 6) + 1;
    const color = COLORS[gameState.turn];
    const canMoveAny = gameState.pawns[color].some((p) => checkIsMovable(p, d));

    if (!canMoveAny) {
      setGameState({
        ...gameState,
        dice: d,
        rolled: true,
        msg: `Rolled ${d} — no valid moves. Next turn.`,
      });

      timerRef.current = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          turn: getNextTurn(prev.turn, prev.pawns),
          dice: null,
          rolled: false,
          msg: "Roll the dice.",
        }));
      }, 1300);
    } else {
      setGameState({
        ...gameState,
        dice: d,
        rolled: true,
        msg: `Rolled ${d}! Tap a glowing pawn.`,
      });
    }
  };

  const handlePawnClick = (color, idx) => {
    if (gameState.winner || color !== COLORS[gameState.turn]) return;

    const p = gameState.pawns[color][idx];
    const d = gameState.dice;

    if (!d || !checkIsMovable(p, d)) return;

    setGameState((prev) => {
      const newPawns = JSON.parse(JSON.stringify(prev.pawns));
      const np = newPawns[color][idx];

      let actionMsg = "";
      let bonusRoll = false;

      if (np.state === "base") {
        np.state = "track";
        np.progress = 0;
        actionMsg = `Pawn released to start! Roll again (bonus for 6).`;
        bonusRoll = true;
      } else {
        const nextProg = np.progress + d;
        if (nextProg >= 52) {
          np.progress = Math.min(nextProg, 57);
          np.state = np.progress === 57 ? "won" : "home";
        } else {
          np.progress = nextProg;
          np.state = "track";
        }
      }

      let captured = false;
      if (np.state === "track") {
        const ti = (START_IDX[color] + np.progress) % 52;
        if (!SAFE_SET.has(ti)) {
          const [c, r] = TRACK[ti];
          COLORS.forEach((other) => {
            if (other === color) return;
            newPawns[other].forEach((op) => {
              if (op.state === "track") {
                const oTi = (START_IDX[other] + op.progress) % 52;
                const [oc, or] = TRACK[oTi];
                if (oc === c && or === r) {
                  op.state = "base";
                  op.progress = 0;
                  captured = true;
                }
              }
            });
          });
        }
      }

      const isWinner = newPawns[color].every((pw) => pw.state === "won");
      if (isWinner) {
        return {
          ...prev,
          pawns: newPawns,
          winner: color,
          dice: null,
          msg: "Game over!",
        };
      }

      if (np.state === "won") {
        actionMsg = `Pawn reached center!${d === 6 ? " Roll again (bonus)." : ""}`;
        if (d !== 6) {
          return {
            ...prev,
            pawns: newPawns,
            turn: getNextTurn(prev.turn, newPawns),
            dice: null,
            rolled: false,
            msg: "Roll the dice.",
          };
        } else {
          bonusRoll = true;
        }
      }

      if (captured) {
        actionMsg = `Captured a pawn! Roll again.`;
        bonusRoll = true;
      }

      if (d === 6 && !bonusRoll && np.state !== "won") {
        actionMsg = "Rolled a 6 — roll again!";
        bonusRoll = true;
      }

      if (bonusRoll) {
        return {
          ...prev,
          pawns: newPawns,
          dice: null,
          rolled: false,
          msg: actionMsg,
        };
      }

      return {
        ...prev,
        pawns: newPawns,
        turn: getNextTurn(prev.turn, newPawns),
        dice: null,
        rolled: false,
        msg: "Roll the dice.",
      };
    });
  };

  // ── RENDER HELPERS ────────────────────────────────────────────────────────
  const renderGrid = () => {
    const cells = [];
    for (let r = 1; r <= 15; r++) {
      for (let c = 1; c <= 15; c++) {
        const fill = getCellFill(c, r);
        if (!fill) continue;
        cells.push(
          <rect
            key={`cell-${c}-${r}`}
            x={(c - 1) * 40 + 1}
            y={(r - 1) * 40 + 1}
            width={38}
            height={38}
            fill={fill}
            rx={2}
          />,
        );
      }
    }
    return cells;
  };

  const renderStarsAndDots = () => {
    const elements = [];
    TRACK.forEach(([c, r], i) => {
      if (SAFE_SET.has(i)) {
        elements.push(
          <text
            key={`star-${i}`}
            x={(c - 1) * 40 + 20}
            y={(r - 1) * 40 + 20}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(0,0,0,0.3)"
            fontSize={12}
          >
            ★
          </text>,
        );
      }
    });
    Object.entries(START_IDX).forEach(([color, idx]) => {
      const [c, r] = TRACK[idx];
      elements.push(
        <text
          key={`start-${color}`}
          x={(c - 1) * 40 + 20}
          y={(r - 1) * 40 + 20}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.6)"
          fontSize={10}
        >
          ●
        </text>,
      );
    });
    return elements;
  };

  const renderCenter = () => {
    const x = 240,
      y = 240,
      s = 120,
      m = 300,
      n = 300;
    return (
      <g>
        <polygon
          points={`${x},${y + s} ${x + s},${y + s} ${m},${n}`}
          fill="#b71c1c"
        />
        <polygon points={`${x},${y} ${x},${y + s} ${m},${n}`} fill="#1b5e20" />
        <polygon points={`${x},${y} ${x + s},${y} ${m},${n}`} fill="#f57f17" />
        <polygon
          points={`${x + s},${y} ${x + s},${y + s} ${m},${n}`}
          fill="#0d47a1"
        />
        <circle cx={m} cy={n} r={33.6} fill="white" />
      </g>
    );
  };

  const renderBaseCircles = () => {
    return Object.entries(BASE_POS).flatMap(([color, positions]) =>
      positions.map(([c, r], i) => (
        <circle
          key={`bc-${color}-${i}`}
          cx={(c - 1) * 40 + 20}
          cy={(r - 1) * 40 + 20}
          r={15.2}
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1.5}
        />
      )),
    );
  };

  const renderPawns = () => {
    const pawnElements = [];
    const occ = {};

    COLORS.forEach((color) => {
      gameState.pawns[color].forEach((pawn, idx) => {
        const pos = getPawnPos(color, idx, gameState.pawns);
        if (!pos) return;
        const [gc, gr] = pos;
        const key = `${gc},${gr}`;
        const cnt = occ[key] || 0;
        occ[key] = cnt + 1;

        const cx = (gc - 0.5) * (100 / 15);
        const cy = (gr - 0.5) * (100 / 15);
        const pawnR = 2;
        const offsets = [
          [0, 0],
          [-pawnR * 0.75, -pawnR * 0.75],
          [pawnR * 0.75, -pawnR * 0.75],
          [-pawnR * 0.75, pawnR * 0.75],
          [pawnR * 0.75, pawnR * 0.75],
        ];
        const [ox, oy] = offsets[cnt] || [0, 0];

        const isMovable =
          gameState.dice !== null &&
          color === COLORS[gameState.turn] &&
          checkIsMovable(pawn, gameState.dice);

        pawnElements.push(
          <div
            key={`pawn-${color}-${idx}`}
            onClick={() => handlePawnClick(color, idx)}
            // 👇 ADDED pointer-events-auto HERE 👇
            className={`pointer-events-auto absolute flex items-center justify-center rounded-full font-bold text-white/95 border-[2.5px] border-white/90 shadow-[0_2px_6px_rgba(0,0,0,0.5)] select-none transition-transform duration-100 ${
              isMovable
                ? "animate-pawn-pulse z-20 cursor-pointer"
                : "hover:scale-110 z-10"
            }`}
            style={{
              width: `${pawnR * 2}%`,
              height: `${pawnR * 2}%`,
              left: `calc(${cx}% - ${pawnR}% + ${ox}%)`,
              top: `calc(${cy}% - ${pawnR}% + ${oy}%)`,
              backgroundColor: CHEX[color],
              fontSize: "clamp(8px, 1.5vw, 10px)",
            }}
          >
            {idx + 1}
          </div>,
        );
      });
    });
    return pawnElements;
  };

  const currentColor = COLORS[gameState.turn];
  const dicePattern = gameState.dice
    ? DICE_PAT[gameState.dice]
    : Array(9).fill(0);

  return (
    <div className="min-h-screen bg-[#0f0f13] font-sans flex flex-col items-center justify-start py-4 px-2 pb-8 gap-4 text-[#eee]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pawn-pulse {
          from { box-shadow: 0 0 0 2px white, 0 2px 6px rgba(0,0,0,0.5); transform: scale(1); }
          to   { box-shadow: 0 0 0 5px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.5); transform: scale(1.18); }
        }
        .animate-pawn-pulse { animation: pawn-pulse 0.6s ease-in-out infinite alternate; }
      `,
        }}
      />

      <h1 className="text-[22px] font-semibold tracking-[0.08em] text-white">
        LUDO
      </h1>

      {gameState.winner && (
        <div
          className="text-lg font-semibold px-5 py-2 rounded-lg text-center"
          style={{
            color: CHEX[gameState.winner],
            background: `${CHEX[gameState.winner]}22`,
            border: `1px solid ${CHEX[gameState.winner]}55`,
          }}
        >
          🎉 {CNAME[gameState.winner]} wins! Congratulations!
        </div>
      )}

      <div className="flex gap-2.5">
        {COLORS.map((c) => (
          <div
            key={c}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
              c === currentColor
                ? "opacity-100 shadow-[0_0_0_3px_rgba(255,255,255,0.5)]"
                : "opacity-25"
            }`}
            style={{ backgroundColor: CHEX[c] }}
          />
        ))}
      </div>

      <div className="relative w-[min(96vw,540px)] aspect-square">
        <svg
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full rounded-xl overflow-visible"
        >
          <rect x="0" y="0" width="600" height="600" fill="#1a1a1a" rx="10" />
          {renderGrid()}
          {renderStarsAndDots()}
          {renderCenter()}
          {renderBaseCircles()}
        </svg>
        <div className="absolute inset-0 pointer-events-none">
          {renderPawns()}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 w-[min(96vw,400px)] bg-white/5 border border-white/10 rounded-[14px] px-5 py-4">
        <div
          className="text-base font-semibold"
          style={{ color: CHEX[currentColor] }}
        >
          {CNAME[currentColor]}'s Turn
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-[10px] grid grid-cols-3 grid-rows-3 p-2 gap-1">
            {dicePattern.map((on, i) => (
              <div
                key={i}
                className={`rounded-full ${on ? "bg-[#1a1a1a]" : "bg-transparent"}`}
              />
            ))}
          </div>
          <button
            onClick={handleRoll}
            disabled={gameState.rolled || !!gameState.winner}
            className="px-6 py-2.5 rounded-lg border-none bg-[#4f46e5] hover:bg-[#6366f1] active:scale-95 text-white text-[15px] font-semibold cursor-pointer transition-all disabled:opacity-35 disabled:cursor-default"
          >
            Roll Dice
          </button>
        </div>

        <div className="text-[13px] text-[#aaa] text-center min-h-[18px]">
          {gameState.msg}
        </div>
      </div>
    </div>
  );
}
