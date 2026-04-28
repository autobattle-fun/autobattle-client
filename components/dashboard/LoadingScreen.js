"use client";

import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full px-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src="/logo/Autobattle-animated.svg"
            alt="Autobattle"
            width={200}
            height={200}
            className=""
          />
        </div>
      </div>
    </div>
  );
}
