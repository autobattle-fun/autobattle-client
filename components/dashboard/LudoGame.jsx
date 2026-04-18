"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                      LUDO GAME 3D                               ║
 * ║           Three.js + FBX + Next.js 15 + Tailwind                ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  SETUP                                                           ║
 * ║  1. npm install three @types/three                               ║
 * ║  2. Place FBX files in /public//:                          ║
 * ║       LudoBattle.fbx  RedPawn.fbx  GreenPawn.fbx                ║
 * ║       YellowPawn.fbx  BluePawn.fbx                               ║
 * ║  3. import LudoGame3D from "@/components/LudoGame3D"             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * GAME RULES IMPLEMENTED:
 *  • Roll 6 → release one pawn from base and place it on START square.
 *    The roll of 6 is consumed for the release (pawn does NOT move
 *    6 extra squares). Player gets a bonus roll immediately.
 *  • Roll 6 while moving a pawn → bonus roll after the move.
 *  • Capture an opponent's pawn → sends them to base + bonus roll.
 *  • Safe squares (★): start squares + 1 mid-arm square per side.
 *    Pawns on safe squares cannot be captured.
 *  • Home stretch: 5 colored squares → center = won (exact roll needed).
 *  • All 4 pawns in center = that player wins.
 *  • If no valid move exists after rolling → turn passes automatically.
 *  • Full 3D board rendered via FBX with graceful procedural fallback.
 *  • Drag/scroll/pinch orbit camera. Click glowing pawns to move.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
/**
 * progress = 0..51 → index into shared track (from own start square)
 * progress = 52..56 → home stretch index 0..4
 * progress = 57     → won (center)
 */

// ─────────────────────────────────────────────────────────────────────────────
// GAME CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = ["red", "green", "yellow", "blue"];

const COLOR_LABEL = {
  red: "Red",
  green: "Green",
  yellow: "Yellow",
  blue: "Blue",
};

const COLOR_HEX = {
  red: "#e53935",
  green: "#43a047",
  yellow: "#f9a825",
  blue: "#1e88e5",
};

const COLOR_DARK = {
  red: "#b71c1c",
  green: "#1b5e20",
  yellow: "#e65100",
  blue: "#0d47a1",
};

const COLOR_INT = {
  red: 0xe53935,
  green: 0x43a047,
  yellow: 0xf9a825,
  blue: 0x1e88e5,
};

// ─────────────────────────────────────────────────────────────────────────────
// THE 52-SQUARE SHARED TRACK
// [col, row] on a 15×15 grid (1-indexed), clockwise.
//
// Board layout:
//   Red base    = cols 1-6,  rows 10-15  (bottom-left)
//   Green base  = cols 1-6,  rows 1-6   (top-left)
//   Yellow base = cols 10-15,rows 1-6   (top-right)
//   Blue base   = cols 10-15,rows 10-15 (bottom-right)
//   Center      = [8,8]
//   col 8       = Red HS (rows 9-13 ↑) and Yellow HS (rows 7-3 ↑)
//   row 8       = Green HS (cols 2-6 →) and Blue HS (cols 14-10 ←)
//
// Start squares:
//   Red   = index  0 → [7,13]
//   Green = index 13 → [2,7]
//   Yellow= index 26 → [9,2]
//   Blue  = index 39 → [14,9]
// ─────────────────────────────────────────────────────────────────────────────

const TRACK = [
  // ── Red's upward run: col7, bottom arm, rows 13→9 ──── 5 cells
  [7, 13],
  [7, 12],
  [7, 11],
  [7, 10],
  [7, 9],
  // ── Row9 going left: cols 6→1 ────────────────────────── 6 cells
  [6, 9],
  [5, 9],
  [4, 9],
  [3, 9],
  [2, 9],
  [1, 9],
  // ── Col1 corner going up: rows 8→7 ───────────────────── 2 cells
  [1, 8],
  [1, 7],
  // ── Row7 going right (left arm): cols 2→6 ─── ─────────── 5 cells
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 7],
  [6, 7],
  // ── Green's upward run: col7, top arm, rows 6→1 ──────── 6 cells
  [7, 6],
  [7, 5],
  [7, 4],
  [7, 3],
  [7, 2],
  [7, 1],
  // ── Top corner: row1, cols 8→9 ───────────────────────── 2 cells
  [8, 1],
  [9, 1],
  // ── Yellow's downward run: col9, top arm, rows 2→7 ────── 6 cells
  [9, 2],
  [9, 3],
  [9, 4],
  [9, 5],
  [9, 6],
  [9, 7],
  // ── Row7 going right (right arm): cols 10→14 ─────────── 5 cells
  [10, 7],
  [11, 7],
  [12, 7],
  [13, 7],
  [14, 7],
  // ── Col15 corner going down: rows 7,9 ────────────────── 2 cells
  [15, 7],
  [15, 9],
  // ── Row9 going left (right arm): cols 14→9 ───────────── 6 cells
  [14, 9],
  [13, 9],
  [12, 9],
  [11, 9],
  [10, 9],
  [9, 9],
  // ── Blue's downward run: col9, bottom arm, rows 10→13 ── 4 cells
  [9, 10],
  [9, 11],
  [9, 12],
  [9, 13],
  // ── Bottom corner: back toward Red's starting area ────── 3 cells
  [8, 14],
  [8, 15],
  [7, 15],
  // Total: 5+6+2+5+6+2+6+5+2+6+4+3 = 52 ✓
];

const START_IDX = { red: 0, green: 13, yellow: 26, blue: 39 };

/**
 * Home stretch paths — 5 squares per color.
 * progress 52→56 = HOME_PATH[color][0..4], progress 57 = won (center [8,8]).
 */
const HOME_PATH = {
  red: [
    [8, 13],
    [8, 12],
    [8, 11],
    [8, 10],
    [8, 9],
  ],
  green: [
    [2, 8],
    [3, 8],
    [4, 8],
    [5, 8],
    [6, 8],
  ],
  yellow: [
    [8, 7],
    [8, 6],
    [8, 5],
    [8, 4],
    [8, 3],
  ],
  blue: [
    [14, 8],
    [13, 8],
    [12, 8],
    [11, 8],
    [10, 8],
  ],
};

// Safe track indices (captures forbidden)
const SAFE_SET = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// Grid positions of the 4 spawn circles per base
const BASE_SPAWN = {
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
    [12, 2],
    [14, 2],
    [12, 4],
    [14, 4],
  ],
  blue: [
    [12, 11],
    [14, 11],
    [12, 13],
    [14, 13],
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// COORDINATE HELPERS
// Board centered at origin; each cell = 1 Three.js unit; 15×15 grid.
// col 1 → x=-14.5, col 15 → x=14.5
// row 1 → z=-7.5, row 15 → z=7.5
// ─────────────────────────────────────────────────────────────────────────────

const CELL_SIZE = 1.0;
const GRID_OFFSET_X = -14.5; // Independent X alignment for the logical grid.
const GRID_OFFSET_Z = -7.5; // Independent Z alignment for the logical grid.

const MODEL_CALIBRATION = {
  board: { targetSize: 15.0, xOffset: 0, zOffset: 0, yOffset: 0 },
  pawn: { targetSize: 0.55, xOffset: 0, zOffset: 0, yOffset: 0 },
};

function measureObject(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  return { box, size, maxDim: Math.max(size.x, size.y, size.z, 0.001) };
}

function reportModelFit(name, obj, expectedMaxDim) {
  const { box, size, maxDim } = measureObject(obj);
  const delta = Math.abs(maxDim - expectedMaxDim);
  const withinTolerance = delta <= expectedMaxDim * 0.08;
  console.info(`[Ludo3D] ${name} fit`, {
    size: {
      x: Number(size.x.toFixed(3)),
      y: Number(size.y.toFixed(3)),
      z: Number(size.z.toFixed(3)),
    },
    maxDim: Number(maxDim.toFixed(3)),
    expectedMaxDim,
    bottomY: Number(box.min.y.toFixed(3)),
    topY: Number(box.max.y.toFixed(3)),
    withinTolerance,
  });
}

function gridToWorld(col, row, y = 0) {
  return new THREE.Vector3(
    GRID_OFFSET_X + (col - 0.5) * CELL_SIZE,
    y,
    GRID_OFFSET_Z + (row - 0.5) * CELL_SIZE,
  );
}

function getPawnGridPos(color, pawn, idx) {
  if (pawn.state === "base") return BASE_SPAWN[color][idx];
  if (pawn.state === "track")
    return TRACK[(START_IDX[color] + pawn.progress) % 52];
  if (pawn.state === "home")
    return HOME_PATH[color][Math.min(pawn.progress - 52, 4)];
  return [8, 8]; // won → center
}

// Stacking offsets when multiple pawns share the same cell
const STACK_OFFSETS = [
  [0, 0],
  [-0.2, -0.2],
  [0.2, -0.2],
  [-0.2, 0.2],
  [0.2, 0.2],
];

function getPawnWorldPos(color, pawn, idx, occupancy) {
  const [col, row] = getPawnGridPos(color, pawn, idx);
  const key = `${col},${row}`;
  const n = occupancy.get(key) ?? 0;
  occupancy.set(key, n + 1);
  const [ox, oz] = STACK_OFFSETS[n] ?? [0, 0];
  const base = gridToWorld(col, row);
  return new THREE.Vector3(
    base.x + ox + MODEL_CALIBRATION.pawn.xOffset,
    0,
    base.z + oz + MODEL_CALIBRATION.pawn.zOffset,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PURE GAME LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function clonePawns(p) {
  return Object.fromEntries(
    COLORS.map((c) => [c, p[c].map((pw) => ({ ...pw }))]),
  );
}

function isMovable(g, color, idx) {
  if (!g.dice || color !== COLORS[g.turn]) return false;
  const p = g.pawns[color][idx];
  if (p.state === "won") return false;
  if (p.state === "base") return g.dice === 6;
  return p.progress + g.dice <= 57;
}

function anyMovable(g, color) {
  // Rolling 6 must always allow releasing at least one base pawn.
  if (g.dice === 6 && g.pawns[color].some((p) => p.state === "base"))
    return true;
  return g.pawns[color].some((_, i) => isMovable(g, color, i));
}

/** Attempt captures at the current pawn's position. Returns true if any captured. */
function doCaptures(pawns, color, idx) {
  const p = pawns[color][idx];
  if (p.state !== "track") return false;
  const ti = (START_IDX[color] + p.progress) % 52;
  if (SAFE_SET.has(ti)) return false;
  const [c, r] = TRACK[ti];
  let hit = false;
  COLORS.forEach((other) => {
    if (other === color) return;
    pawns[other].forEach((op) => {
      if (op.state !== "track") return;
      const oti = (START_IDX[other] + op.progress) % 52;
      const [oc, or] = TRACK[oti];
      if (oc === c && or === r) {
        op.state = "base";
        op.progress = 0;
        hit = true;
      }
    });
  });
  return hit;
}

function advanceTurn(g) {
  let next = (g.turn + 1) % 4;
  for (let i = 0; i < 4; i++) {
    if (!g.pawns[COLORS[next]].every((p) => p.state === "won")) break;
    next = (next + 1) % 4;
  }
  return {
    ...g,
    turn: next,
    dice: null,
    rolled: false,
    message: `${COLOR_LABEL[COLORS[next]]}'s turn — roll the dice!`,
  };
}

function makeInitialState() {
  return {
    turn: 0,
    dice: null,
    rolled: false,
    winner: null,
    message: "Red's turn — roll the dice!",
    pawns: Object.fromEntries(
      COLORS.map((c) => [
        c,
        [0, 1, 2, 3].map(() => ({ state: "base", progress: 0 })),
      ]),
    ),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DICE DOT PATTERNS (9-cell grid, 3×3)
// ─────────────────────────────────────────────────────────────────────────────

const DICE_PAT = {
  1: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 0, 0, 0, 0, 1],
  3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  4: [1, 0, 1, 0, 0, 0, 1, 0, 1],
  5: [1, 0, 1, 0, 1, 0, 1, 0, 1],
  6: [1, 0, 1, 1, 0, 1, 1, 0, 1],
};

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL BOARD (fallback when FBX fails to load)
// ─────────────────────────────────────────────────────────────────────────────

function buildProceduralBoard(scene) {
  // ── Base plate ──
  scene.add(
    (() => {
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(15.8, 0.22, 15.8),
        new THREE.MeshStandardMaterial({ color: 0x0d0d20, roughness: 0.88 }),
      );
      base.position.set(0, -0.11, 0);
      base.receiveShadow = true;
      return base;
    })(),
  );

  // ── Cell materials ──
  const M = {
    path: new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.85 }),
    safe: new THREE.MeshStandardMaterial({
      color: 0xffe082,
      roughness: 0.65,
      metalness: 0.05,
    }),
    center: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.3,
    }),
    "hs-red": new THREE.MeshStandardMaterial({
      color: 0xffcdd2,
      roughness: 0.82,
    }),
    "hs-green": new THREE.MeshStandardMaterial({
      color: 0xc8e6c9,
      roughness: 0.82,
    }),
    "hs-yellow": new THREE.MeshStandardMaterial({
      color: 0xfff9c4,
      roughness: 0.82,
    }),
    "hs-blue": new THREE.MeshStandardMaterial({
      color: 0xbbdefb,
      roughness: 0.82,
    }),
    "base-red": new THREE.MeshStandardMaterial({
      color: 0x8b1212,
      roughness: 0.92,
    }),
    "base-green": new THREE.MeshStandardMaterial({
      color: 0x113d14,
      roughness: 0.92,
    }),
    "base-yellow": new THREE.MeshStandardMaterial({
      color: 0xa33600,
      roughness: 0.92,
    }),
    "base-blue": new THREE.MeshStandardMaterial({
      color: 0x092c68,
      roughness: 0.92,
    }),
    "start-red": new THREE.MeshStandardMaterial({
      color: 0xe53935,
      roughness: 0.55,
      metalness: 0.25,
    }),
    "start-green": new THREE.MeshStandardMaterial({
      color: 0x43a047,
      roughness: 0.55,
      metalness: 0.25,
    }),
    "start-yellow": new THREE.MeshStandardMaterial({
      color: 0xf9a825,
      roughness: 0.55,
      metalness: 0.25,
    }),
    "start-blue": new THREE.MeshStandardMaterial({
      color: 0x1e88e5,
      roughness: 0.55,
      metalness: 0.25,
    }),
  };

  function cellType(c, r) {
    if (r >= 10 && r <= 15 && c >= 1 && c <= 6) return "base-red";
    if (r >= 1 && r <= 6 && c >= 1 && c <= 6) return "base-green";
    if (r >= 1 && r <= 6 && c >= 10 && c <= 15) return "base-yellow";
    if (r >= 10 && r <= 15 && c >= 10 && c <= 15) return "base-blue";
    const inV = c >= 7 && c <= 9,
      inH = r >= 7 && r <= 9;
    if (!inV && !inH) return null;
    if (c === 8 && r === 8) return "center";
    if (c === 8 && r >= 9 && r <= 13) return "hs-red";
    if (r === 8 && c >= 2 && c <= 6) return "hs-green";
    if (c === 8 && r >= 3 && r <= 7) return "hs-yellow";
    if (r === 8 && c >= 10 && c <= 14) return "hs-blue";
    const ti = TRACK.findIndex(([tc, tr]) => tc === c && tr === r);
    if (ti === START_IDX.red) return "start-red";
    if (ti === START_IDX.green) return "start-green";
    if (ti === START_IDX.yellow) return "start-yellow";
    if (ti === START_IDX.blue) return "start-blue";
    if (ti >= 0 && SAFE_SET.has(ti)) return "safe";
    return ti >= 0 ? "path" : null;
  }

  const cellGeo = new THREE.BoxGeometry(0.91, 0.07, 0.91);

  for (let r = 1; r <= 15; r++) {
    for (let c = 1; c <= 15; c++) {
      const t = cellType(c, r);
      if (!t) continue;
      const mesh = new THREE.Mesh(cellGeo, M[t] ?? M.path);
      mesh.position.copy(gridToWorld(c, r, 0.035));
      mesh.receiveShadow = true;
      scene.add(mesh);
    }
  }

  // ── Center star triangles ──
  const S = 1.5;
  const triDefs = [
    {
      col: 0x8b1212,
      v: [
        [-S, 0, S],
        [S, 0, S],
        [0, 0, 0],
      ],
    },
    {
      col: 0x113d14,
      v: [
        [-S, 0, -S],
        [-S, 0, S],
        [0, 0, 0],
      ],
    },
    {
      col: 0xa33600,
      v: [
        [-S, 0, -S],
        [S, 0, -S],
        [0, 0, 0],
      ],
    },
    {
      col: 0x092c68,
      v: [
        [S, 0, -S],
        [S, 0, S],
        [0, 0, 0],
      ],
    },
  ];
  triDefs.forEach(({ col, v }) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([
          v[0][0],
          0.078,
          v[0][2],
          v[1][0],
          0.078,
          v[1][2],
          v[2][0],
          0.078,
          v[2][2],
        ]),
        3,
      ),
    );
    geo.computeVertexNormals();
    scene.add(
      new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          color: col,
          roughness: 0.45,
          side: THREE.DoubleSide,
        }),
      ),
    );
  });

  // ── Spawn circles ──
  const circGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.012, 22);
  COLORS.forEach((color) => {
    const mat = new THREE.MeshStandardMaterial({
      color: COLOR_INT[color],
      roughness: 0.5,
      metalness: 0.1,
    });
    BASE_SPAWN[color].forEach(([c, r]) => {
      const m = new THREE.Mesh(circGeo, mat);
      m.position.copy(gridToWorld(c, r, 0.086));
      scene.add(m);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL PAWN (fallback)
// ─────────────────────────────────────────────────────────────────────────────

function makeProceduralPawn(color) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: COLOR_INT[color],
    roughness: 0.22,
    metalness: 0.65,
  });

  // Base disc
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.22, 0.07, 22),
    mat,
  );
  disc.position.y = 0.035;
  g.add(disc);

  // Stem
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.13, 0.3, 16),
    mat,
  );
  stem.position.y = 0.22;
  g.add(stem);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 22, 22), mat);
  head.position.y = 0.45;
  g.add(head);

  // Accent ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.19, 0.014, 8, 26),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLOR_INT[color]).multiplyScalar(0.45),
      roughness: 0.4,
      metalness: 0.5,
    }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.07;
  g.add(ring);

  g.traverse((c) => {
    if (c instanceof THREE.Mesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LudoGame3D() {
  // ── Refs ──
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const rafRef = useRef(0);
  const meshesRef = useRef(new Map()); // "color-idx" → mesh
  const clickTargetsRef = useRef(new Map()); // "color-idx" → invisible hitbox mesh
  const templatesRef = useRef(new Map()); // color → FBX template
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const gameRef = useRef(makeInitialState());
  const autoPassTimeoutRef = useRef(null);

  // ── State ──
  const [game, setGame] = useState(gameRef.current);
  const [loading, setLoading] = useState({ pct: 0, done: false });

  // Keep gameRef in sync for the animation loop
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  // ────────────────────────────────────────────────────────────────
  // THREE.JS SCENE SETUP — runs once on mount
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c18);
    scene.fog = new THREE.FogExp2(0x0c0c18, 0.022);
    sceneRef.current = scene;

    // Camera
    const cam = new THREE.PerspectiveCamera(
      44,
      mount.clientWidth / mount.clientHeight,
      0.1,
      120,
    );
    cam.position.set(0, 21, 16);
    cam.lookAt(0, 0, 0);
    cameraRef.current = cam;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit controls
    const controls = new OrbitControls(cam, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 6;
    controls.maxDistance = 35;
    controls.maxPolarAngle = Math.PI / 2.1;
    controlsRef.current = controls;

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.48));

    const sun = new THREE.DirectionalLight(0xfff8e8, 2.1);
    sun.position.set(10, 24, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 70;
    const sh = 15;
    sun.shadow.camera.left = -sh;
    sun.shadow.camera.right = sh;
    sun.shadow.camera.top = sh;
    sun.shadow.camera.bottom = -sh;
    sun.shadow.bias = -0.0006;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x7799dd, 0.5);
    fill.position.set(-9, 7, -11);
    scene.add(fill);

    const glow = new THREE.PointLight(0xffeedd, 0.9, 45);
    glow.position.set(0, 15, 0);
    scene.add(glow);

    // Ground
    const gnd = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x07070f, roughness: 0.96 }),
    );
    gnd.rotation.x = -Math.PI / 2;
    gnd.position.y = -0.6;
    gnd.receiveShadow = true;
    scene.add(gnd);

    // ── Load models ──
    loadAllModels(scene);

    // ── Animate ──
    function animate(t) {
      rafRef.current = requestAnimationFrame(animate);
      controls.update();

      const g = gameRef.current;

      meshesRef.current.forEach((mesh, key) => {
        const [colorStr, idxStr] = key.split("-");
        const color = colorStr;
        const idx = parseInt(idxStr);
        const pawn = g.pawns[color]?.[idx];

        if (!pawn || pawn.state === "won") {
          mesh.visible = false;
          return;
        }
        mesh.visible = true;

        // Keep pawns stable for reliable clicking with custom FBX assets.
        mesh.position.y += (0.02 - mesh.position.y) * 0.2;
        mesh.rotation.y += (0 - mesh.rotation.y) * 0.2;
      });

      renderer.render(scene, cam);
    }
    rafRef.current = requestAnimationFrame(animate);

    // ── Resize ──
    const onResize = () => {
      const w = mount.clientWidth,
        h = mount.clientHeight;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (autoPassTimeoutRef.current) {
        clearTimeout(autoPassTimeoutRef.current);
        autoPassTimeoutRef.current = null;
      }
      clickTargetsRef.current.forEach((hitbox) => scene.remove(hitbox));
      clickTargetsRef.current.clear();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ────────────────────────────────────────────────────────────────
  // FBX LOADING
  // ────────────────────────────────────────────────────────────────

  function loadAllModels(scene) {
    const loader = new FBXLoader();
    let loaded = 0;
    const total = 5;

    const tick = () => {
      loaded++;
      setLoading({
        pct: Math.round((loaded / total) * 100),
        done: loaded === total,
      });
    };

    // ── Board ──
    loader.load(
      "/models/LudoBattle.fbx",
      (fbx) => {
        autoScaleFBX(fbx, MODEL_CALIBRATION.board.targetSize);
        fbx.position.x += MODEL_CALIBRATION.board.xOffset;
        fbx.position.z += MODEL_CALIBRATION.board.zOffset;
        fbx.position.y += MODEL_CALIBRATION.board.yOffset;

        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const mats = Array.isArray(child.material)
              ? child.material
              : [child.material];
            mats.forEach((m) => {
              m.needsUpdate = true;
            });
          }
        });

        scene.add(fbx);
        reportModelFit("board", fbx, MODEL_CALIBRATION.board.targetSize);
        tick();
        setTimeout(() => repositionPawns(gameRef.current), 150);
      },
      undefined,
      () => {
        console.warn("Board FBX not found — using procedural board");
        buildProceduralBoard(scene);
        tick();
        setTimeout(() => repositionPawns(gameRef.current), 150);
      },
    );

    // ── Pawns ──
    const pawnDefs = [
      ["red", "/models/RedPawn.fbx"],
      ["green", "/models/GreenPawn.fbx"],
      ["yellow", "/models/YellowPawn.fbx"],
      ["blue", "/models/BluePawn.fbx"],
    ];

    pawnDefs.forEach(([color, path]) => {
      loader.load(
        path,
        (fbx) => {
          autoScaleFBX(fbx, MODEL_CALIBRATION.pawn.targetSize, true);
          fbx.position.y += MODEL_CALIBRATION.pawn.yOffset;
          fbx.traverse((c) => {
            if (c instanceof THREE.Mesh) {
              c.castShadow = true;
              c.receiveShadow = true;
            }
          });
          reportModelFit(
            `${color} pawn`,
            fbx,
            MODEL_CALIBRATION.pawn.targetSize,
          );
          templatesRef.current.set(color, fbx);
          spawnInstances(color, scene);
          tick();
        },
        undefined,
        () => {
          console.warn(`${color} pawn FBX not found — using procedural pawn`);
          const fb = makeProceduralPawn(color);
          templatesRef.current.set(color, fb);
          spawnInstances(color, scene);
          tick();
        },
      );
    });
  }

  /**
   * Scale an FBX model to fit within `targetSize` units (largest axis).
   * If `liftOff` is true, also translate so the bottom sits at y=0.
   */
  function autoScaleFBX(fbx, targetSize, liftOff = false) {
    const box = new THREE.Box3().setFromObject(fbx);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const s = targetSize / maxDim;
    fbx.scale.setScalar(s);

    // Re-compute after scale
    const box2 = new THREE.Box3().setFromObject(fbx);
    const center = box2.getCenter(new THREE.Vector3());
    fbx.position.x -= center.x;
    fbx.position.z -= center.z;
    if (liftOff) {
      // box2 already reflects the scaled model; translating by min.y places its bottom at y=0.
      fbx.position.y -= box2.min.y;
    } else {
      fbx.position.y = 0;
    }
  }

  function spawnInstances(color, scene) {
    const template = templatesRef.current.get(color);
    if (!template) return;

    for (let i = 0; i < 4; i++) {
      const key = `${color}-${i}`;
      const old = meshesRef.current.get(key);
      if (old) scene.remove(old);

      const inst = template.clone(true);
      inst.userData = { color, idx: i, isPawn: true };

      // Ensure raycasts can resolve pawn identity from any clicked child node.
      inst.traverse((child) => {
        child.userData = {
          ...child.userData,
          color,
          idx: i,
          isPawn: true,
        };

        // Initialise emissive to black
        if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((mat) => {
            if (mat && "emissive" in mat)
              mat.emissive = new THREE.Color(0x000000);
          });
        }
      });

      scene.add(inst);
      meshesRef.current.set(key, inst);

      // Dedicated click proxy: stable picking regardless of FBX hierarchy.
      const oldHitbox = clickTargetsRef.current.get(key);
      if (oldHitbox) scene.remove(oldHitbox);

      const hitbox = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 14, 14),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      hitbox.userData = { color, idx: i, isPawn: true, isPawnHitbox: true };
      scene.add(hitbox);
      clickTargetsRef.current.set(key, hitbox);
    }

    repositionPawns(gameRef.current);
  }

  // ────────────────────────────────────────────────────────────────
  // REPOSITION ALL PAWNS  (called after every state update)
  // ────────────────────────────────────────────────────────────────

  const repositionPawns = useCallback((g) => {
    const occ = new Map();

    COLORS.forEach((color) => {
      g.pawns[color].forEach((pawn, idx) => {
        const key = `${color}-${idx}`;
        const mesh = meshesRef.current.get(key);
        if (!mesh) return;

        if (pawn.state === "won") {
          mesh.visible = false;
          const wonHitbox = clickTargetsRef.current.get(key);
          if (wonHitbox) wonHitbox.visible = false;
          return;
        }
        mesh.visible = true;

        const pos = getPawnWorldPos(color, pawn, idx, occ);
        mesh.position.x = pos.x;
        mesh.position.z = pos.z;

        const hitbox = clickTargetsRef.current.get(key);
        if (hitbox) {
          hitbox.visible = true;
          hitbox.position.x = pos.x;
          hitbox.position.y = 0.55;
          hitbox.position.z = pos.z;
        }

        // Emissive glow for movable pawns
        const movable = isMovable(g, color, idx);
        mesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mats = Array.isArray(child.material)
              ? child.material
              : [child.material];
            mats.forEach((mat) => {
              if (mat && "emissive" in mat) {
                mat.emissive = movable
                  ? new THREE.Color(COLOR_INT[color]).multiplyScalar(0.6)
                  : new THREE.Color(0x000000);
                mat.needsUpdate = true;
              }
            });
          }
        });
      });
    });
  }, []);

  useEffect(() => {
    repositionPawns(game);
  }, [game, repositionPawns]);

  // ────────────────────────────────────────────────────────────────
  // RAYCASTING (click → select pawn)
  // ────────────────────────────────────────────────────────────────

  const pickPawnAtClientPos = useCallback((clientX, clientY) => {
    const mount = mountRef.current;
    const renderer = rendererRef.current;
    const cam = cameraRef.current;
    if (!mount || !renderer || !cam) return;

    const rect = mount.getBoundingClientRect();
    mouseRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cam);

    const targets = [];
    clickTargetsRef.current.forEach((hitbox) => {
      if (hitbox.visible) targets.push(hitbox);
    });

    const hits = raycasterRef.current.intersectObjects(targets, false);
    if (!hits.length) return;

    const obj = hits[0].object;
    if (!obj || typeof obj.userData.idx !== "number" || !obj.userData.color)
      return;

    const { color, idx } = obj.userData;
    handlePawnSelect(color, idx);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onCanvasPointerUp = useCallback(
    (e) => {
      pickPawnAtClientPos(e.clientX, e.clientY);
    },
    [pickPawnAtClientPos],
  );

  const onCanvasClick = useCallback(
    (e) => {
      pickPawnAtClientPos(e.clientX, e.clientY);
    },
    [pickPawnAtClientPos],
  );

  // ────────────────────────────────────────────────────────────────
  // GAME ACTIONS
  // ────────────────────────────────────────────────────────────────

  const handleRoll = useCallback(() => {
    setGame((g) => {
      if (g.rolled || g.winner) return g;

      if (autoPassTimeoutRef.current) {
        clearTimeout(autoPassTimeoutRef.current);
        autoPassTimeoutRef.current = null;
      }

      const d = Math.floor(Math.random() * 6) + 1;
      const color = COLORS[g.turn];
      const next = { ...g, dice: d, rolled: true };

      if (!anyMovable(next, color)) {
        const fromTurn = g.turn;
        const fromDice = d;
        autoPassTimeoutRef.current = setTimeout(() => {
          setGame((prev) => {
            // Ignore stale timers if game state already changed.
            if (
              prev.turn !== fromTurn ||
              !prev.rolled ||
              prev.dice !== fromDice ||
              prev.winner
            ) {
              return prev;
            }
            return advanceTurn(prev);
          });
          autoPassTimeoutRef.current = null;
        }, 1400);
        return {
          ...next,
          message: `Rolled ${d} — no valid moves. Passing turn…`,
        };
      }

      return { ...next, message: `Rolled ${d}! Click a glowing pawn to move.` };
    });
  }, []);

  const handlePawnSelect = useCallback((color, idx) => {
    setGame((g) => {
      if (!isMovable(g, color, idx)) return g;

      if (autoPassTimeoutRef.current) {
        clearTimeout(autoPassTimeoutRef.current);
        autoPassTimeoutRef.current = null;
      }

      const d = g.dice;
      const pawns = clonePawns(g.pawns);
      const p = pawns[color][idx];

      // ── RELEASE FROM BASE ─────────────────────────────────────
      // Rolled a 6: place pawn on start square (progress=0).
      // The 6 is FULLY consumed for release — pawn does NOT also
      // move 6 squares. Player gets a bonus roll as a reward.
      if (p.state === "base") {
        p.state = "track";
        p.progress = 0;
        const captured = doCaptures(pawns, color, idx);
        return {
          ...g,
          pawns,
          dice: null,
          rolled: false,
          message: captured
            ? "Pawn released & captured an opponent! Roll again."
            : "Pawn is on the start square! Roll again (bonus for 6).",
        };
      }

      // ── NORMAL MOVE ───────────────────────────────────────────
      const np = p.progress + d;
      p.progress = Math.min(np, 57);

      if (p.progress === 57) p.state = "won";
      else if (p.progress >= 52) p.state = "home";
      else p.state = "track";

      const wonNow = p.state === "won";
      const captured = p.state === "track" && doCaptures(pawns, color, idx);

      // Full game win?
      if (pawns[color].every((pw) => pw.state === "won")) {
        return {
          ...g,
          pawns,
          dice: null,
          rolled: false,
          winner: color,
          message: `🎉 ${COLOR_LABEL[color]} wins the game!`,
        };
      }

      // Bonus roll for 6 or capture
      if (d === 6 || captured) {
        const why = captured ? "captured a pawn" : "rolled a 6";
        return {
          ...g,
          pawns,
          dice: null,
          rolled: false,
          message: wonNow
            ? `Pawn reached the center! Bonus roll (${why}).`
            : `Bonus roll — ${why}! Roll again.`,
        };
      }

      // Regular advance
      return advanceTurn({ ...g, pawns, dice: null, rolled: false });
    });
  }, []);

  const handleRestart = useCallback(() => {
    if (autoPassTimeoutRef.current) {
      clearTimeout(autoPassTimeoutRef.current);
      autoPassTimeoutRef.current = null;
    }
    const fresh = makeInitialState();
    gameRef.current = fresh;
    setGame(fresh);
  }, []);

  // ────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────

  const cur = COLORS[game.turn];
  const dicePat = game.dice ? DICE_PAT[game.dice] : Array(9).fill(0);

  return (
    <div className="relative w-full h-screen bg-[#0c0c18] text-white overflow-hidden select-none">
      {/* ── LOADING OVERLAY ───────────────────────────────────── */}
      {!loading.done && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0c18] gap-5">
          <h1 className="text-4xl font-black tracking-[0.4em] text-white/75">
            LUDO
          </h1>
          <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${loading.pct}%`,
                background: `linear-gradient(90deg, ${COLOR_HEX.red}, ${COLOR_HEX.yellow}, ${COLOR_HEX.green}, ${COLOR_HEX.blue})`,
              }}
            />
          </div>
          <p className="text-sm text-white/30 tracking-widest">
            LOADING 3D ASSETS — {loading.pct}%
          </p>
        </div>
      )}

      {/* ── 3D CANVAS ─────────────────────────────────────────── */}
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerUpCapture={onCanvasPointerUp}
        onClick={onCanvasClick}
      />

      {/* ── TOP HUD ───────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="flex flex-col items-center pt-5 gap-2">
          {/* Turn indicator dots */}
          <div className="flex items-center gap-3">
            {COLORS.map((c) => (
              <div
                key={c}
                className="w-3.5 h-3.5 rounded-full transition-all duration-300"
                style={{
                  background: COLOR_HEX[c],
                  opacity: c === cur ? 1 : 0.18,
                  transform: c === cur ? "scale(1.55)" : "scale(1)",
                  boxShadow:
                    c === cur
                      ? `0 0 12px ${COLOR_HEX[c]}, 0 0 24px ${COLOR_HEX[c]}66`
                      : "none",
                }}
              />
            ))}
          </div>

          {/* Turn label */}
          <p
            className="text-sm font-semibold tracking-widest uppercase transition-colors duration-300"
            style={{
              color: game.winner ? COLOR_HEX[game.winner] : COLOR_HEX[cur],
            }}
          >
            {game.winner
              ? `🏆 ${COLOR_LABEL[game.winner]} Wins!`
              : `${COLOR_LABEL[cur]}'s Turn`}
          </p>
        </div>
      </div>

      {/* ── WIN BANNER ────────────────────────────────────────── */}
      {game.winner && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div
            className="px-12 py-8 rounded-3xl text-center backdrop-blur-xl border"
            style={{
              background: `${COLOR_HEX[game.winner]}14`,
              borderColor: `${COLOR_HEX[game.winner]}44`,
            }}
          >
            <div
              className="text-6xl font-black mb-2"
              style={{ color: COLOR_HEX[game.winner] }}
            >
              {COLOR_LABEL[game.winner]} Wins!
            </div>
            <p className="text-white/40 text-sm tracking-wider">
              All 4 pawns reached the center
            </p>
          </div>
        </div>
      )}

      {/* ── BOTTOM PANEL ──────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/75 backdrop-blur-lg border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Dice */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 bg-white rounded-xl grid grid-cols-3 grid-rows-3 p-[7px] gap-[3.5px] shadow-xl transition-shadow duration-300"
                style={{
                  boxShadow: game.dice
                    ? `0 0 18px ${COLOR_HEX[cur]}99, 0 0 6px ${COLOR_HEX[cur]}`
                    : "none",
                }}
              >
                {dicePat.map((on, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-colors duration-100"
                    style={{ background: on ? "#111" : "transparent" }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-white/25 tracking-widest">
                {game.dice ? `ROLLED ${game.dice}` : "─"}
              </span>
            </div>

            {/* Message + Buttons */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] leading-snug text-white/55 mb-2 truncate">
                {game.message}
              </p>
              <div className="flex gap-2">
                {!game.winner ? (
                  <button
                    onClick={handleRoll}
                    disabled={game.rolled}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.97]"
                    style={{
                      background: game.rolled
                        ? "rgba(255,255,255,0.05)"
                        : `linear-gradient(135deg, ${COLOR_HEX[cur]} 0%, ${COLOR_DARK[cur]} 100%)`,
                      color: game.rolled ? "rgba(255,255,255,0.22)" : "#fff",
                      cursor: game.rolled ? "not-allowed" : "pointer",
                      boxShadow: game.rolled
                        ? "none"
                        : `0 4px 22px ${COLOR_HEX[cur]}66`,
                    }}
                  >
                    {game.rolled ? "Move a glowing pawn ↑" : "🎲  Roll Dice"}
                  </button>
                ) : (
                  <button
                    onClick={handleRestart}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/16 transition-all active:scale-[0.97] cursor-pointer"
                  >
                    🔄 Play Again
                  </button>
                )}
                {!game.winner && (
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2.5 rounded-xl text-sm text-white/35 hover:text-white/55 bg-white/[0.04] hover:bg-white/[0.08] transition-all active:scale-[0.97] cursor-pointer"
                  >
                    Restart
                  </button>
                )}
              </div>
            </div>

            {/* Pawn tracker */}
            <div className="flex-shrink-0 flex flex-col gap-1.5">
              {COLORS.map((c) => {
                const wonCt = game.pawns[c].filter(
                  (p) => p.state === "won",
                ).length;
                return (
                  <div key={c} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: COLOR_HEX[c] }}
                    />
                    <div className="flex gap-[3px]">
                      {game.pawns[c].map((pawn, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full border transition-all duration-200"
                          style={{
                            borderColor: `${COLOR_HEX[c]}44`,
                            background:
                              pawn.state === "won"
                                ? COLOR_HEX[c]
                                : pawn.state === "home"
                                  ? `${COLOR_HEX[c]}88`
                                  : pawn.state === "track"
                                    ? `${COLOR_HEX[c]}44`
                                    : "transparent",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-[9px] font-bold min-w-[16px]"
                      style={{
                        color: wonCt > 0 ? COLOR_HEX[c] : "transparent",
                      }}
                    >
                      {wonCt > 0 ? `${wonCt}/4` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-center pb-2 text-[10px] text-white/13 tracking-widest">
          DRAG TO ORBIT · SCROLL TO ZOOM · CLICK GLOWING PAWNS
        </p>
      </div>
    </div>
  );
}
