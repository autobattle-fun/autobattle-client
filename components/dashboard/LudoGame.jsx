"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// ─────────────────────────────────────────────────────────────────────────────
// GAME CONSTANTS & CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = ["red", "green", "yellow", "blue"];

const COLOR_HEX = {
  red: "#e53935",
  green: "#43a047",
  yellow: "#f9a825",
  blue: "#1e88e5",
};

const COLOR_INT = {
  red: 0xe53935,
  green: 0x43a047,
  yellow: 0xf9a825,
  blue: 0x1e88e5,
};

// Controls pawn hover height
const PAWN_ELEVATION = 0.3;

const CELL_SIZE = 0.88;
const GRID_OFFSET_X = -7.5 * CELL_SIZE;
const GRID_OFFSET_Z = -7.5 * CELL_SIZE;

const MODEL_CALIBRATION = {
  board: { targetSize: 15.0, xOffset: 0, zOffset: 0, yOffset: 0 },
  pawn: { targetSize: 0.55, xOffset: 0, zOffset: 0, yOffset: 0 },
};

// ─────────────────────────────────────────────────────────────────────────────
// TRACK COORDINATES (Mapped to your visual board without rotating!)
// ─────────────────────────────────────────────────────────────────────────────

const TRACK = [
  [7, 14.55],
  [7, 13.45],
  [7, 12.35],
  [7, 11.25],
  [7, 10.15],
  [5.95, 9],
  [4.85, 9],
  [3.75, 9],
  [2.65, 9],
  [1.55, 9],
  [0.45, 9],
  [0.45, 8],
  [0.45, 7],
  [1.5, 7],
  [2.6, 7],
  [3.7, 7],
  [4.8, 7],
  [5.9, 7],
  [7, 5.95],
  [7, 4.85],
  [7, 3.75],
  [7, 2.65],
  [7, 1.55],
  [7, 0.45],
  [8, 0.35],
  [9, 0.35],
  [9, 1.45],
  [9, 2.55],
  [9, 3.65],
  [9, 4.75],
  [9, 6],
  [10.05, 7],
  [11.15, 7],
  [12.25, 7],
  [13.35, 7],
  [14.45, 7],
  [15.55, 7],
  [15.55, 8],
  [15.55, 9],
  [14.45, 9],
  [13.35, 9],
  [12.25, 9],
  [11.15, 9],
  [10.05, 9],
  [9, 10],
  [9, 11.15],
  [9, 12.25],
  [9, 13.35],
  [9, 14.45],
  [9, 15.6],
  [8, 15.6],
  [7, 15.6],
];

// Start squares mathematically aligned to your physical board colors
const START_IDX = {
  red: 13, // Top-Left arm
  green: 26, // Top-Right arm
  yellow: 39, // Bottom-Right arm
  blue: 0, // Bottom-Left arm
};

// Home stretches mathematically aligned to your physical board colors
const HOME_PATH = {
  red: [
    [1.5, 8],
    [2.6, 8],
    [3.7, 8],
    [4.8, 8],
    [5.9, 8],
  ], // Left arm moving Right
  green: [
    [8, 1.5],
    [8, 2.6],
    [8, 3.7],
    [8, 4.8],
    [8, 5.9],
  ], // Top arm moving Down
  yellow: [
    [14.5, 8],
    [13.4, 8],
    [12.3, 8],
    [11.2, 8],
    [10.1, 8],
  ], // Right arm moving Left
  blue: [
    [8, 14.5],
    [8, 13.4],
    [8, 12.3],
    [8, 11.2],
    [8, 10.1],
  ], // Bottom arm moving Up
};

// Centered symmetrical coordinates for bases
const BO = 4.8; // Base offset from center
const SP = 1.1; // Spread between pawns
const MANUAL_BASE_POSITIONS = {
  red: [
    // Top-Left Base
    { x: -BO, z: -BO },
    { x: -BO + SP, z: -BO },
    { x: -BO, z: -BO + SP },
    { x: -BO + SP, z: -BO + SP },
  ],
  green: [
    // Top-Right Base
    { x: BO, z: -BO },
    { x: BO - SP, z: -BO },
    { x: BO, z: -BO + SP },
    { x: BO - SP, z: -BO + SP },
  ],
  yellow: [
    // Bottom-Right Base
    { x: BO, z: BO },
    { x: BO - SP, z: BO },
    { x: BO, z: BO - SP },
    { x: BO - SP, z: BO - SP },
  ],
  blue: [
    // Bottom-Left Base
    { x: -BO, z: BO },
    { x: -BO + SP, z: BO },
    { x: -BO, z: BO - SP },
    { x: -BO + SP, z: BO - SP },
  ],
};

const STACK_OFFSETS = [
  [0, 0],
  [-0.35, -0.35], // Pushed further into Top-Left
  [0.35, -0.35], // Pushed further into Top-Right
  [-0.35, 0.35], // Pushed further into Bottom-Left
  [0.35, 0.35], // Pushed further into Bottom-Right
];

// ─────────────────────────────────────────────────────────────────────────────
// COORDINATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function gridToWorld(col, row, y = 0) {
  return new THREE.Vector3(
    GRID_OFFSET_X + (col - 0.5) * CELL_SIZE,
    y,
    GRID_OFFSET_Z + (row - 0.5) * CELL_SIZE,
  );
}

function getPawnGridPos(color, progress) {
  if (progress < 0) return null;

  // 0 to 50: The 51 squares on the main outer track
  if (progress <= 50) return TRACK[(START_IDX[color] + progress) % 52];

  // 51 to 55: The 5 squares on the inner colored home stretch
  if (progress <= 55) return HOME_PATH[color][progress - 51];

  // 56+: Won (Center)
  return [8, 8];
}

function getPawnWorldPos(color, progress, idx, occupancy) {
  // ── 1. Base location short-circuit ──
  if (progress === -1) {
    const manualPos = MANUAL_BASE_POSITIONS[color][idx];
    return new THREE.Vector3(
      manualPos.x + MODEL_CALIBRATION.pawn.xOffset,
      0,
      manualPos.z + MODEL_CALIBRATION.pawn.zOffset,
    );
  }

  // ── 2. NEW: Home/Center short-circuit ──
  if (progress === 56) {
    const baseCenter = gridToWorld(8, 8); // The exact middle of the board

    // Assign each color to a specific corner of the center logo
    const cornerOffsets = {
      red: { x: -0.65, z: -0.65 }, // Top-Left
      green: { x: 0.65, z: -0.65 }, // Top-Right
      yellow: { x: 0.65, z: 0.65 }, // Bottom-Right
      blue: { x: -0.65, z: 0.65 }, // Bottom-Left
    };
    const cOff = cornerOffsets[color];

    // Add a tiny micro-offset just in case multiple pawns of the SAME color reach the center
    const centerKey = `center-${color}`;
    const cn = occupancy.get(centerKey) ?? 0;
    occupancy.set(centerKey, cn + 1);
    const microOffsets = [
      [0, 0],
      [-0.15, -0.15],
      [0.15, -0.15],
      [-0.15, 0.15],
      [0.15, 0.15],
    ];
    const [mx, mz] = microOffsets[cn] ?? [0, 0];

    return new THREE.Vector3(
      baseCenter.x + cOff.x + mx + MODEL_CALIBRATION.pawn.xOffset,
      0,
      baseCenter.z + cOff.z + mz + MODEL_CALIBRATION.pawn.zOffset,
    );
  }

  // ── 3. Normal Track Logic ──
  const [col, row] = getPawnGridPos(color, progress);
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
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LudoGame3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const rafRef = useRef(0);
  const meshesRef = useRef(new Map());
  const clickTargetsRef = useRef(new Map());
  const templatesRef = useRef(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // ── State: Absolute positions (-1 = base, 0-51 = track, 52-56 = home, 57 = won)
  const [positions, setPositions] = useState({
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1],
  });
  const positionsRef = useRef(positions);

  const [selectedPawn, setSelectedPawn] = useState("red-0");
  const [loading, setLoading] = useState({ pct: 0, done: false });

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  // ────────────────────────────────────────────────────────────────
  // THREE.JS SCENE SETUP
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc8965a);
    sceneRef.current = scene;

    // ── 1. Calculate the exact visual center of your specific board
    const BOARD_CENTER_X = -9;
    const BOARD_CENTER_Z = -14;

    const cam = new THREE.PerspectiveCamera(
      44,
      mount.clientWidth / mount.clientHeight,
      0.1,
      120,
    );

    // ── 2. Shift the starting camera position to look at that center
    cam.position.set(BOARD_CENTER_X, 21, 16 + BOARD_CENTER_Z);
    cameraRef.current = cam;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(cam, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2.1;

    // ── 3. Force the axis of rotation to be the center of the board
    controls.target.set(BOARD_CENTER_X, 0, BOARD_CENTER_Z);
    controls.update();

    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.48));
    const sun = new THREE.DirectionalLight(0xfff8e8, 2.1);
    sun.position.set(10, 24, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    scene.add(sun);
    scene
      .add(new THREE.DirectionalLight(0x7799dd, 0.5))
      .position.set(-9, 7, -11);

    const gnd = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0xa0724a, roughness: 0.9 }),
    );
    gnd.rotation.x = -Math.PI / 2;
    gnd.position.y = -0.6;
    gnd.receiveShadow = true;
    scene.add(gnd);

    loadAllModels(scene);

    function animate(t) {
      rafRef.current = requestAnimationFrame(animate);
      controls.update();

      meshesRef.current.forEach((mesh, key) => {
        const baseY = mesh.userData.baseY || 0;

        if (
          mesh.userData.targetX !== undefined &&
          mesh.userData.targetZ !== undefined
        ) {
          // 1. Smoothly glide X and Z towards the target
          mesh.position.x += (mesh.userData.targetX - mesh.position.x) * 0.12;
          mesh.position.z += (mesh.userData.targetZ - mesh.position.z) * 0.12;

          // 2. Calculate distance remaining to create a dynamic "hopping" arc
          const dx = mesh.userData.targetX - mesh.position.x;
          const dz = mesh.userData.targetZ - mesh.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          // 3. Hover high while moving, settle down softly when close
          const hopHeight = Math.min(dist * 0.4, 2.0); // Max jump height of 2.0 units
          mesh.position.y +=
            (baseY + PAWN_ELEVATION + hopHeight - mesh.position.y) * 0.2;
        } else {
          // Fallback if no target is set
          mesh.position.y += (baseY + PAWN_ELEVATION - mesh.position.y) * 0.2;
        }

        mesh.rotation.y += (0 - mesh.rotation.y) * 0.2;
      });

      renderer.render(scene, cam);
    }
    rafRef.current = requestAnimationFrame(animate);

    // ── FIXED: Stops the camera from rendering in the top-left corner ──
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Beat Tailwind CSS's delayed render
    setTimeout(onResize, 50);
    setTimeout(onResize, 200);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ────────────────────────────────────────────────────────────────
  // MODEL LOADING & SCALING
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

    // ── FIXED: Loads the board EXACTLY as you wanted, NO rotations ──
    loader.load("/models/LudoBattle.fbx", (fbx) => {
      autoScaleFBX(fbx, MODEL_CALIBRATION.board.targetSize);

      fbx.rotation.y = -Math.PI / 2;

      fbx.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(fbx);
      tick();
      setTimeout(() => repositionPawns(positionsRef.current), 150);
    });

    const pawnDefs = [
      ["red", "/models/RedPawn.fbx"],
      ["green", "/models/GreenPawn.fbx"],
      ["yellow", "/models/YellowPawn.fbx"],
      ["blue", "/models/BluePawn.fbx"],
    ];

    pawnDefs.forEach(([color, path]) => {
      loader.load(path, (fbx) => {
        autoScaleFBX(fbx, MODEL_CALIBRATION.pawn.targetSize, true);
        fbx.traverse((c) => {
          if (c instanceof THREE.Mesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });
        templatesRef.current.set(color, fbx);
        spawnInstances(color, scene);
        tick();
      });
    });
  }

  function autoScaleFBX(fbx, targetSize, liftOff = false) {
    const box = new THREE.Box3().setFromObject(fbx);
    const size = box.getSize(new THREE.Vector3());
    const s = targetSize / Math.max(size.x, size.y, size.z, 0.001);
    fbx.scale.setScalar(s);

    const box2 = new THREE.Box3().setFromObject(fbx);
    const center = box2.getCenter(new THREE.Vector3());
    fbx.position.x -= center.x;
    fbx.position.z -= center.z;
    fbx.position.y = liftOff ? -box2.min.y : 0;
    fbx.userData.baseY = fbx.position.y;
  }

  function spawnInstances(color, scene) {
    const template = templatesRef.current.get(color);
    if (!template) return;

    for (let i = 0; i < 4; i++) {
      const key = `${color}-${i}`;
      if (meshesRef.current.has(key)) scene.remove(meshesRef.current.get(key));

      const wrapper = new THREE.Group();
      wrapper.userData = { color, idx: i, isPawn: true };

      const inst = template.clone(true);
      wrapper.add(inst);

      inst.traverse((child) => {
        child.userData = { ...child.userData, color, idx: i, isPawn: true };
      });

      scene.add(wrapper);
      meshesRef.current.set(key, wrapper);

      const hitbox = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 14, 14),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      hitbox.userData = { color, idx: i };
      scene.add(hitbox);
      clickTargetsRef.current.set(key, hitbox);
    }
    repositionPawns(positionsRef.current);
  }

  // ────────────────────────────────────────────────────────────────
  // PAWN REPOSITIONING
  // ────────────────────────────────────────────────────────────────
  const repositionPawns = useCallback(
    (posData) => {
      const occ = new Map();

      COLORS.forEach((color) => {
        posData[color].forEach((progress, idx) => {
          const key = `${color}-${idx}`;
          const mesh = meshesRef.current.get(key);
          if (!mesh) return;

          const pos = getPawnWorldPos(color, progress, idx, occ);
          mesh.userData.targetX = pos.x;
          mesh.userData.targetZ = pos.z;

          // Snap to position on the very first load so they don't fly from 0,0
          if (mesh.position.x === 0 && mesh.position.z === 0) {
            mesh.position.x = pos.x;
            mesh.position.z = pos.z;
          }

          const hitbox = clickTargetsRef.current.get(key);
          if (hitbox) {
            // The invisible hitbox should still teleport instantly so you can click the destination!
            hitbox.position.x = pos.x;
            hitbox.position.y = 0.55;
            hitbox.position.z = pos.z;
          }
          mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const mats = Array.isArray(child.material)
                ? child.material
                : [child.material];
              mats.forEach((mat) => {
                if (mat && "emissive" in mat) {
                  mat.emissive =
                    selectedPawn === key
                      ? new THREE.Color(COLOR_INT[color]).multiplyScalar(0.5)
                      : new THREE.Color(0x000000);
                  mat.needsUpdate = true;
                }
              });
            }
          });
        });
      });
    },
    [selectedPawn],
  );

  useEffect(() => {
    repositionPawns(positions);
  }, [positions, repositionPawns]);

  // ────────────────────────────────────────────────────────────────
  // RAYCASTING (Click a pawn to select it in the UI)
  // ────────────────────────────────────────────────────────────────
  const pickPawn = useCallback((clientX, clientY) => {
    const mount = mountRef.current;
    if (!mount || !cameraRef.current) return;
    const rect = mount.getBoundingClientRect();
    mouseRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const targets = Array.from(clickTargetsRef.current.values());
    const hits = raycasterRef.current.intersectObjects(targets, false);

    if (hits.length > 0) {
      const { color, idx } = hits[0].object.userData;
      setSelectedPawn(`${color}-${idx}`);
    }
  }, []);

  // ────────────────────────────────────────────────────────────────
  // UI HANDLERS
  // ────────────────────────────────────────────────────────────────
  const handlePositionChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = -1;
    if (val < -1) val = -1;
    if (val > 57) val = 57;

    const [col, idxStr] = selectedPawn.split("-");
    setPositions((prev) => {
      const newColorArr = [...prev[col]];
      newColorArr[parseInt(idxStr)] = val;
      return { ...prev, [col]: newColorArr };
    });
  };

  const [activeColor, activeIdx] = selectedPawn.split("-");
  const currentPos = positions[activeColor][parseInt(activeIdx)];

  return (
    <div className="relative w-full h-screen bg-[#c8965a] text-white overflow-hidden">
      {/* ── 3D CANVAS ── */}
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerUpCapture={(e) => pickPawn(e.clientX, e.clientY)}
      />

      {/* ── CUSTOM UI CONTROL PANEL ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex flex-col gap-4 pointer-events-auto">
          <div className="flex justify-between items-center text-sm font-bold tracking-widest text-white/50 uppercase">
            <span>Pawn Visualizer</span>
            <span style={{ color: COLOR_HEX[activeColor] }}>
              Pos: {currentPos === -1 ? "Base" : currentPos}
            </span>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedPawn}
              onChange={(e) => setSelectedPawn(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-white/40 transition-colors"
            >
              {COLORS.map((c) => (
                <optgroup key={c} label={c.toUpperCase()}>
                  {[0, 1, 2, 3].map((i) => (
                    <option key={`${c}-${i}`} value={`${c}-${i}`}>
                      {c.charAt(0).toUpperCase() + c.slice(1)} {i + 1}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <input
              type="number"
              min="-1"
              max="56"
              value={currentPos}
              onChange={handlePositionChange}
              className="w-24 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-center outline-none focus:border-white/40 transition-colors"
              placeholder="-1"
            />
          </div>

          <div className="text-[11px] text-white/40 text-center uppercase tracking-wider">
            -1 = Base | 0-50 = Track | 51-55 = Home | 56 = Won
          </div>
        </div>
      </div>
    </div>
  );
}
