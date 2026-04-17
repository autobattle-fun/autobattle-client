// "use client";

// import React, { useState, Suspense, useMemo, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useFBX, OrbitControls, Environment, Html } from "@react-three/drei";
// import * as THREE from "three";

// // --- 1. CONFIGURATION & GRID MATH ---

// // Measurements from the FBX child positions
// const TRACK_OUTER_EXTENT = 2.329;
// const TILE_SIZE = TRACK_OUTER_EXTENT / 7;
// const BASE_CENTER_OFFSET = 1.686;
// const PAWN_SURFACE_Y = 0.145;

// // FIXED: Keep the pawns small
// const PAWN_SCALE = 0.014;

// // FIXED: Tighter spacing so they don't clip outside the base squares
// const PAWN_SPREAD = 0.2;

// // Absolute world coordinates for the center of the 4 colored base squares.
// const BASE_CENTERS = {
//   green: [-BASE_CENTER_OFFSET, PAWN_SURFACE_Y, -BASE_CENTER_OFFSET],
//   yellow: [BASE_CENTER_OFFSET, PAWN_SURFACE_Y, -BASE_CENTER_OFFSET],
//   red: [-BASE_CENTER_OFFSET, PAWN_SURFACE_Y, BASE_CENTER_OFFSET],
//   blue: [BASE_CENTER_OFFSET, PAWN_SURFACE_Y, BASE_CENTER_OFFSET],
// };

// // Micro-offsets so the 4 pawns inside a base form a neat 2x2 square
// const PAWN_OFFSETS = [
//   [-PAWN_SPREAD, -PAWN_SPREAD],
//   [PAWN_SPREAD, -PAWN_SPREAD],
//   [-PAWN_SPREAD, PAWN_SPREAD],
//   [PAWN_SPREAD, PAWN_SPREAD],
// ];

// // The 52-step path of a standard Ludo board on a 15x15 grid centered at 0,0
// const PATH_GRID = [
//   [-1, 6],
//   [-1, 5],
//   [-1, 4],
//   [-1, 3],
//   [-1, 2],
//   [-1, 1], // Up Red arm
//   [-2, 1],
//   [-3, 1],
//   [-4, 1],
//   [-5, 1],
//   [-6, 1],
//   [-7, 1], // Left Green arm
//   [-7, 0], // Turn
//   [-7, -1],
//   [-6, -1],
//   [-5, -1],
//   [-4, -1],
//   [-3, -1],
//   [-2, -1], // Right Green arm
//   [-1, -2],
//   [-1, -3],
//   [-1, -4],
//   [-1, -5],
//   [-1, -6],
//   [-1, -7], // Up Yellow arm
//   [0, -7], // Turn
//   [1, -7],
//   [1, -6],
//   [1, -5],
//   [1, -4],
//   [1, -3],
//   [1, -2], // Down Yellow arm
//   [2, -1],
//   [3, -1],
//   [4, -1],
//   [5, -1],
//   [6, -1],
//   [7, -1], // Right Blue arm
//   [7, 0], // Turn
//   [7, 1],
//   [6, 1],
//   [5, 1],
//   [4, 1],
//   [3, 1],
//   [2, 1], // Left Blue arm
//   [1, 2],
//   [1, 3],
//   [1, 4],
//   [1, 5],
//   [1, 6],
//   [1, 7], // Down Red arm
//   [0, 7], // Turn
// ];

// // RESTORED: Rotate the logical route so it follows the board orientation in the FBX
// const BOARD_PATH_GRID = PATH_GRID.map(([gridX, gridZ]) => [gridZ, -gridX]);

// // Where each color enters the board on the PATH_GRID array
// const START_INDICES = { red: 0, green: 13, yellow: 26, blue: 39 };

// // Helper to convert grid coordinates [x, z] to actual 3D world positions [x, y, z]
// const getWorldPosition = (gridX, gridZ, yOffset = PAWN_SURFACE_Y) => [
//   gridX * TILE_SIZE,
//   yOffset,
//   gridZ * TILE_SIZE,
// ];

// // --- 2. 3D COMPONENTS ---

// function LudoBoard() {
//   const fbx = useFBX("/LudoBattle (2).fbx");
//   const copiedFbx = useMemo(() => fbx.clone(), [fbx]);
//   return <primitive object={copiedFbx} scale={0.01} position={[0, 0, 0]} />;
// }

// function Pawn({ modelPath, position, isClickable, onClick, isActive }) {
//   const fbx = useFBX(modelPath);
//   const pawnYOffset = 0.05; // Slight hover padding

//   // RESTORED: Your Box3 manual centering. This completely stops the erratic jumping!
//   const pawnModel = useMemo(() => {
//     const clone = fbx.clone();
//     clone.scale.setScalar(PAWN_SCALE);

//     const box = new THREE.Box3().setFromObject(clone);
//     const center = box.getCenter(new THREE.Vector3());

//     clone.position.x -= center.x;
//     clone.position.y -= box.min.y; // Ground it perfectly
//     clone.position.z -= center.z;

//     return clone;
//   }, [fbx]);

//   const groupRef = useRef(null);

//   useFrame((state) => {
//     if (!groupRef.current) return;

//     // Add hover bounce if it's this color's turn
//     if (isActive) {
//       const time = state.clock.getElapsedTime();
//       groupRef.current.position.y =
//         position[1] + pawnYOffset + Math.sin(time * 6) * 0.05;
//     } else {
//       groupRef.current.position.y = THREE.MathUtils.lerp(
//         groupRef.current.position.y,
//         position[1] + pawnYOffset,
//         0.2,
//       );
//     }

//     // Smoothly animate X and Z movement (the sliding hop effect)
//     groupRef.current.position.x = THREE.MathUtils.lerp(
//       groupRef.current.position.x,
//       position[0],
//       0.15,
//     );
//     groupRef.current.position.z = THREE.MathUtils.lerp(
//       groupRef.current.position.z,
//       position[2],
//       0.15,
//     );
//   });

//   return (
//     <group
//       ref={groupRef}
//       position={position}
//       onClick={(e) => {
//         e.stopPropagation();
//         if (isClickable) onClick();
//       }}
//       onPointerOver={() => {
//         if (isClickable) document.body.style.cursor = "pointer";
//       }}
//       onPointerOut={() => (document.body.style.cursor = "default")}
//     >
//       <primitive object={pawnModel} />
//     </group>
//   );
// }

// // --- 3. MAIN GAME & LOGIC ---

// export default function LudoGame() {
//   const [turnIndex, setTurnIndex] = useState(0);
//   const turns = ["red", "blue", "yellow", "green"];
//   const currentTurn = turns[turnIndex];

//   const [diceRoll, setDiceRoll] = useState(null);
//   const [isRolling, setIsRolling] = useState(false);
//   const [message, setMessage] = useState("Red's Turn. Roll the dice!");

//   const [pawns, setPawns] = useState(() => {
//     const initialState = {};
//     Object.keys(BASE_CENTERS).forEach((color) => {
//       initialState[color] = PAWN_OFFSETS.map((offset, i) => {
//         return {
//           id: `${color}-${i}`,
//           color: color,
//           state: "base",
//           position: [
//             BASE_CENTERS[color][0] + offset[0],
//             BASE_CENTERS[color][1],
//             BASE_CENTERS[color][2] + offset[1],
//           ],
//           pathIndex: -1,
//         };
//       });
//     });
//     return initialState;
//   });

//   const handleRollDice = () => {
//     if (diceRoll !== null || isRolling) return;

//     setIsRolling(true);
//     setMessage("Rolling...");

//     setTimeout(() => {
//       const roll = Math.floor(Math.random() * 6) + 1;
//       setDiceRoll(roll);
//       setIsRolling(false);
//       setMessage(`Rolled a ${roll}! Select a ${currentTurn} pawn.`);

//       const hasActivePawns = pawns[currentTurn].some(
//         (p) => p.state === "active",
//       );
//       const hasBasePawns = pawns[currentTurn].some((p) => p.state === "base");

//       if (!hasActivePawns && (roll !== 6 || !hasBasePawns)) {
//         setMessage(`Rolled a ${roll}, but no valid moves. Next turn!`);
//         setTimeout(() => nextTurn(), 1500);
//       }
//     }, 600);
//   };

//   const nextTurn = () => {
//     setDiceRoll(null);
//     const next = (turnIndex + 1) % 4;
//     setTurnIndex(next);
//     setMessage(
//       `${turns[next].charAt(0).toUpperCase() + turns[next].slice(1)}'s Turn.`,
//     );
//   };

//   const handlePawnClick = (color, pawnIndex) => {
//     if (color !== currentTurn || diceRoll === null) return;

//     setPawns((prev) => {
//       const newState = { ...prev };
//       const pawnToUpdate = { ...newState[color][pawnIndex] };

//       if (pawnToUpdate.state === "base" && diceRoll === 6) {
//         pawnToUpdate.state = "active";
//         pawnToUpdate.pathIndex = START_INDICES[color];

//         const [gridX, gridZ] = BOARD_PATH_GRID[pawnToUpdate.pathIndex];
//         pawnToUpdate.position = getWorldPosition(gridX, gridZ);

//         newState[color][pawnIndex] = pawnToUpdate;
//         setMessage("Pawn released! Roll again.");
//         setTimeout(() => setDiceRoll(null), 1000);
//         return newState;
//       }

//       if (pawnToUpdate.state === "active") {
//         pawnToUpdate.pathIndex = (pawnToUpdate.pathIndex + diceRoll) % 52;

//         const [gridX, gridZ] = BOARD_PATH_GRID[pawnToUpdate.pathIndex];
//         pawnToUpdate.position = getWorldPosition(gridX, gridZ);

//         newState[color][pawnIndex] = pawnToUpdate;

//         if (diceRoll === 6) {
//           setMessage("Rolled a 6! Roll again.");
//           setTimeout(() => setDiceRoll(null), 1000);
//         } else {
//           setTimeout(() => nextTurn(), 1000);
//         }
//         return newState;
//       }

//       return prev;
//     });
//   };

//   const getModelPath = (color) => {
//     const paths = {
//       red: "/RedPawn.fbx",
//       blue: "/BluePawn.fbx",
//       green: "/GreenPawn.fbx",
//       yellow: "/YellowPawn.fbx",
//     };
//     return paths[color];
//   };

//   return (
//     <div className="w-full h-full relative bg-gray-900 rounded-2xl overflow-hidden">
//       <Canvas camera={{ position: [0, 12, 14], fov: 40 }}>
//         <Suspense
//           fallback={
//             <Html center>
//               <div className="text-white font-bold">Loading...</div>
//             </Html>
//           }
//         >
//           <ambientLight intensity={0.7} />
//           <directionalLight position={[10, 15, 5]} intensity={1.5} castShadow />
//           <Environment preset="city" />

//           <LudoBoard />

//           {Object.entries(pawns).map(([color, colorPawns]) =>
//             colorPawns.map((pawn, idx) => (
//               <Pawn
//                 key={pawn.id}
//                 modelPath={getModelPath(color)}
//                 position={pawn.position}
//                 isActive={color === currentTurn}
//                 isClickable={
//                   color === currentTurn &&
//                   diceRoll !== null &&
//                   (pawn.state === "active" ||
//                     (pawn.state === "base" && diceRoll === 6))
//                 }
//                 onClick={() => handlePawnClick(color, idx)}
//               />
//             )),
//           )}

//           <OrbitControls
//             enablePan={false}
//             maxPolarAngle={Math.PI / 2.2}
//             minDistance={8}
//             maxDistance={25}
//           />
//         </Suspense>
//       </Canvas>

//       {/* UI Overlay */}
//       <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 bg-[#2a2a2a]/90 backdrop-blur-md px-8 py-5 rounded-3xl shadow-2xl border border-white/10">
//         <h3 className="font-semibold text-lg text-white tracking-wide">
//           {message}
//         </h3>
//         <div className="flex items-center gap-4 mt-1">
//           <div className="w-14 h-14 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border-2 border-white/10 text-2xl font-bold text-white shadow-inner">
//             {isRolling ? "🎲" : diceRoll || "-"}
//           </div>
//           <button
//             onClick={handleRollDice}
//             disabled={diceRoll !== null || isRolling}
//             className={`px-8 py-4 rounded-2xl font-bold transition-all duration-200 ${
//               diceRoll !== null || isRolling
//                 ? "bg-gray-700 text-gray-500 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
//             }`}
//           >
//             Roll Dice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";

// --- 1. THE RAW MATH GRID ---
// The 52 steps of the shared track (X, Z) centered at 0,0
const PATH_GRID = [
  [-1, 6],
  [-1, 5],
  [-1, 4],
  [-1, 3],
  [-1, 2],
  [-1, 1], // Up Red arm
  [-2, 1],
  [-3, 1],
  [-4, 1],
  [-5, 1],
  [-6, 1],
  [-7, 1], // Left Green arm
  [-7, 0], // Turn
  [-7, -1],
  [-6, -1],
  [-5, -1],
  [-4, -1],
  [-3, -1],
  [-2, -1], // Right Green arm
  [-1, -2],
  [-1, -3],
  [-1, -4],
  [-1, -5],
  [-1, -6],
  [-1, -7], // Up Yellow arm
  [0, -7], // Turn
  [1, -7],
  [1, -6],
  [1, -5],
  [1, -4],
  [1, -3],
  [1, -2], // Down Yellow arm
  [2, -1],
  [3, -1],
  [4, -1],
  [5, -1],
  [6, -1],
  [7, -1], // Right Blue arm
  [7, 0], // Turn
  [7, 1],
  [6, 1],
  [5, 1],
  [4, 1],
  [3, 1],
  [2, 1], // Left Blue arm
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7], // Down Red arm
  [0, 7], // Turn
];

// Starting indices on the path for each color
const START_INDICES = { red: 0, green: 13, yellow: 26, blue: 39 };

// Translates Math coordinates [-7 to 7] into CSS Grid columns/rows [1 to 15]
const getGridStyles = (x, z) => ({
  gridColumn: Math.round(x) + 8,
  gridRow: Math.round(z) + 8, // +Z is down in 3D, matching CSS grid row behavior
});

// --- 2. GAME LOGIC ---
export default function LudoGame() {
  const [turnIndex, setTurnIndex] = useState(0);
  // FIXED: Proper Clockwise Turn Order
  const turns = ["red", "green", "yellow", "blue"];
  const currentTurn = turns[turnIndex];

  const [diceRoll, setDiceRoll] = useState(null);
  const [message, setMessage] = useState("Red starts! Roll the dice.");

  // FIXED: All 16 pawns restored, properly spaced in 2x2 grids in the correct corners
  const [pawns, setPawns] = useState({
    red: [
      { id: "r0", state: "base", pathIndex: -1, basePos: [-5, 5] },
      { id: "r1", state: "base", pathIndex: -1, basePos: [-4, 5] },
      { id: "r2", state: "base", pathIndex: -1, basePos: [-5, 4] },
      { id: "r3", state: "base", pathIndex: -1, basePos: [-4, 4] },
    ],
    green: [
      { id: "g0", state: "base", pathIndex: -1, basePos: [-5, -5] },
      { id: "g1", state: "base", pathIndex: -1, basePos: [-4, -5] },
      { id: "g2", state: "base", pathIndex: -1, basePos: [-5, -4] },
      { id: "g3", state: "base", pathIndex: -1, basePos: [-4, -4] },
    ],
    yellow: [
      { id: "y0", state: "base", pathIndex: -1, basePos: [4, -5] },
      { id: "y1", state: "base", pathIndex: -1, basePos: [5, -5] },
      { id: "y2", state: "base", pathIndex: -1, basePos: [4, -4] },
      { id: "y3", state: "base", pathIndex: -1, basePos: [5, -4] },
    ],
    blue: [
      { id: "b0", state: "base", pathIndex: -1, basePos: [4, 5] },
      { id: "b1", state: "base", pathIndex: -1, basePos: [5, 5] },
      { id: "b2", state: "base", pathIndex: -1, basePos: [4, 4] },
      { id: "b3", state: "base", pathIndex: -1, basePos: [5, 4] },
    ],
  });

  const handleRollDice = () => {
    if (diceRoll !== null) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    setMessage(`Rolled a ${roll}! Move a ${currentTurn} pawn.`);

    const activePawns = pawns[currentTurn].some((p) => p.state === "active");
    const basePawns = pawns[currentTurn].some((p) => p.state === "base");

    // Auto-skip if they rolled something other than 6 and have no pawns on the board
    if (!activePawns && roll !== 6) {
      setMessage(`Rolled a ${roll}, but need a 6 to leave base. Next turn!`);
      setTimeout(() => nextTurn(), 1000);
    }
  };

  const nextTurn = () => {
    setDiceRoll(null);
    const next = (turnIndex + 1) % 4;
    setTurnIndex(next);
    setMessage(
      `${turns[next].charAt(0).toUpperCase() + turns[next].slice(1)}'s Turn.`,
    );
  };

  const handlePawnClick = (color, pawnIndex) => {
    if (color !== currentTurn || diceRoll === null) return;

    // FIXED: Capture the roll and clear it immediately to prevent React double-jump bugs
    const currentRoll = diceRoll;
    setDiceRoll(null);

    setPawns((prev) => {
      const newState = { ...prev };
      const pawnToUpdate = { ...newState[color][pawnIndex] };

      // Move out of base
      if (pawnToUpdate.state === "base" && currentRoll === 6) {
        pawnToUpdate.state = "active";
        pawnToUpdate.pathIndex = START_INDICES[color];
        newState[color][pawnIndex] = pawnToUpdate;

        setMessage("Pawn released! Roll again.");
        // Did not call nextTurn() because 6 gives another roll
        return newState;
      }

      // Move along the board
      if (pawnToUpdate.state === "active") {
        // Safe math update
        pawnToUpdate.pathIndex = (pawnToUpdate.pathIndex + currentRoll) % 52;
        newState[color][pawnIndex] = pawnToUpdate;

        if (currentRoll === 6) {
          setMessage("Rolled a 6! Roll again.");
        } else {
          nextTurn();
        }
        return newState;
      }

      // If clicked an invalid pawn, restore the dice roll state so they can pick another
      setDiceRoll(currentRoll);
      return prev;
    });
  };

  // --- 3. RENDER PURE HTML/CSS ---
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 rounded-2xl p-4">
      {/* THE 15x15 CSS GRID */}
      <div
        className="bg-gray-800 p-2 rounded-xl relative"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(15, minmax(0, 1fr))",
          gridTemplateRows: "repeat(15, minmax(0, 1fr))",
          gap: "2px",
          width: "min(100%, 550px)",
          aspectRatio: "1/1",
        }}
      >
        {/* Render the 52 path tiles */}
        {PATH_GRID.map(([x, z], i) => {
          let bg = "bg-gray-600";
          if (i === START_INDICES.red) bg = "bg-red-900";
          if (i === START_INDICES.green) bg = "bg-green-900";
          if (i === START_INDICES.yellow) bg = "bg-yellow-700";
          if (i === START_INDICES.blue) bg = "bg-blue-900";

          return (
            <div
              key={`tile-${i}`}
              className={`${bg} rounded-sm flex items-center justify-center text-[10px] text-white/50 font-bold`}
              style={getGridStyles(x, z)}
            >
              {i}
            </div>
          );
        })}

        {/* Render all 16 Pawns */}
        {Object.entries(pawns).map(([color, colorPawns]) => {
          const colorClasses = {
            red: "bg-red-500",
            green: "bg-green-500",
            yellow: "bg-yellow-400",
            blue: "bg-blue-500",
          };

          return colorPawns.map((pawn, idx) => {
            const isBase = pawn.state === "base";
            const x = isBase ? pawn.basePos[0] : PATH_GRID[pawn.pathIndex][0];
            const z = isBase ? pawn.basePos[1] : PATH_GRID[pawn.pathIndex][1];

            return (
              <div
                key={pawn.id}
                onClick={() => handlePawnClick(color, idx)}
                className={`w-full h-full rounded-full border-[3px] border-white/80 shadow-lg cursor-pointer transition-all duration-300 z-10 ${colorClasses[color]} ${
                  color === currentTurn &&
                  diceRoll !== null &&
                  (pawn.state === "active" ||
                    (pawn.state === "base" && diceRoll === 6))
                    ? "animate-pulse scale-125 ring-4 ring-white"
                    : ""
                }`}
                style={{
                  ...getGridStyles(x, z),
                  // If multiple pawns share a tile, offset them slightly so you can see them all
                  transform: !isBase
                    ? `translate(${idx * 4}px, ${idx * -4}px)`
                    : "none",
                }}
              />
            );
          });
        })}
      </div>

      {/* DOM UI */}
      <div className="mt-8 flex flex-col items-center gap-3 bg-[#2a2a2a] px-8 py-5 rounded-3xl shadow-xl border border-white/10 w-full max-w-[400px]">
        <h3 className="font-semibold text-lg text-white text-center">
          {message}
        </h3>

        <div className="flex items-center gap-4 mt-2">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border-2 border-white/20 text-3xl font-bold text-white shadow-inner">
            {diceRoll || "-"}
          </div>

          <button
            onClick={handleRollDice}
            disabled={diceRoll !== null}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              diceRoll !== null
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 cursor-pointer"
            }`}
          >
            Roll Dice
          </button>
        </div>
      </div>
    </div>
  );
}
