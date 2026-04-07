"use client";

import { motion } from "motion/react";

function Pip({ isEmerald }) {
  return (
    <div
      className={`w-4 h-4 rounded-full shadow-[0_0_8px_currentColor] ${
        isEmerald ? "bg-emerald text-emerald" : "bg-purple text-purple"
      }`}
    />
  );
}

export function CyberDice({
  delay = 0,
  scale = 1,
  duration = 10,
  color = "emerald",
  rotateX = [0, 360],
  rotateY = [0, 360],
  rotateZ = [0, 180],
}) {
  const isEmerald = color === "emerald";

  const borderColor = isEmerald ? "border-emerald/40" : "border-purple/40";
  const shadow = isEmerald
    ? "shadow-[inset_0_0_20px_rgba(16,185,129,0.15)]"
    : "shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]";

  const faceClasses = `absolute w-24 h-24 ${borderColor} bg-black/90 backdrop-blur-md border 
    grid grid-cols-3 grid-rows-3 gap-1 p-3 ${shadow}`;

  return (
    <motion.div
      className="relative z-0 opacity-50"
      style={{ scale }}
      animate={{ y: [0, -30, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.div
        className="relative w-24 h-24"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateX: 0, rotateY: 0, rotateZ: 0 }}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
          rotateZ: rotateZ,
        }}
        transition={{
          duration: duration * 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div
          className={`${faceClasses} transform:rotateY(0deg)_translateZ(48px)`}
        >
          <div className="col-start-2 row-start-2 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
        </div>

        <div
          className={`${faceClasses} transform:rotateY(180deg)_translateZ(48px)`}
        >
          <div className="col-start-1 row-start-1 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-1 row-start-2 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-1 row-start-3 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-3 row-start-1 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-3 row-start-2 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-3 row-start-3 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
        </div>

        <div
          className={`${faceClasses} transform:rotateY(90deg)_translateZ(48px)`}
        >
          <div className="col-start-3 row-start-1 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-1 row-start-3 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
        </div>

        <div
          className={`${faceClasses} transform:rotateY(-90deg)_translateZ(48px)`}
        >
          <div className="col-start-1 row-start-1 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-3 row-start-1 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-2 row-start-2 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-1 row-start-3 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-3 row-start-3 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
        </div>

        <div
          className={`${faceClasses} transform:rotateX(90deg)_translateZ(48px)`}
        >
          <div className="col-start-3 row-start-1 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-2 row-start-2 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-1 row-start-3 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
        </div>

        <div
          className={`${faceClasses} transform:rotateX(-90deg)_translateZ(48px)`}
        >
          <div className="col-start-1 row-start-1 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-3 row-start-1 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-1 row-start-3 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
          <div className="col-start-3 row-start-3 place-self-center">
            <Pip isEmerald={isEmerald} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective:1000px">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="absolute top-[15%] left-[10%]">
        <CyberDice
          scale={1.2}
          duration={14}
          color="emerald"
          rotateX={[0, 360]}
          rotateY={[0, 360]}
        />
      </div>

      <div className="absolute top-[55%] right-[12%]">
        <CyberDice
          scale={1.8}
          duration={20}
          delay={2}
          color="purple"
          rotateX={[360, 0]}
          rotateY={[0, 360]}
          rotateZ={[180, 0]}
        />
      </div>

      <div className="absolute top-[80%] left-[20%]">
        <CyberDice
          scale={0.8}
          duration={12}
          delay={1}
          color="emerald"
          rotateX={[0, 360]}
          rotateY={[360, 0]}
          rotateZ={[0, -180]}
        />
      </div>
    </div>
  );
}
