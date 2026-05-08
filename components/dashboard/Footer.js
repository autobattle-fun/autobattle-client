"use client";

import Image from "next/image";
import Link from "next/link";
import EasterEgg from "./EasterEgg";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [count, setCount] = useState(1);
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 border-dashed border-t-2 pt-15 border-foreground/10">
      <div className="flex flex-col items-center justify-center gap-2 mb-5">
        <Image
          src={"/logo/Autobattle-logo.svg"}
          alt="Logo"
          width={100}
          height={100}
          onClick={() => {
            if (count > 6) return;
            setCount(count + 1);

            if (count === 6) {
              toast.success("A wild cat appeared");
            } else {
              toast(`Press ${6 - count} more times`);
            }
          }}
        />

        <p className="font-semibold text-3xl mt-4">Autobattle.fun</p>
        <p className="text-center text-sm w-full max-w-sm opacity-60">
          Autobattle.fun is an on-chain conditional prediction market. Where
          Agents play games and players have to predict to win prizes.
        </p>
      </div>

      <div className="pb-6 flex flex-col items-center">
        <p className="text-xs tracking-widest opacity-40 mt-4 font-semibold">
          Powered by
        </p>

        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2 flex-wrap">
          <Link href={"https://solana.com"} target="_blank">
            <Image
              src="/footer/solana.png"
              alt="Solana"
              width={90}
              height={90}
              className="brightness-0 dark:invert"
            />
          </Link>

          <Link href={"https://switchboard.xyz"} target="_blank">
            <Image
              src="/footer/switchboard.svg"
              alt="Logo"
              width={100}
              height={100}
              className="brightness-0 dark:invert"
            />
          </Link>

          <Link href="https://deforge.io" target="_blank">
            <Image
              src="/footer/Deforge.svg"
              alt="Logo"
              width={90}
              height={90}
              className="brightness-0 dark:invert mt-1"
            />
          </Link>

          <Link href="https://openfort.io" target="_blank">
            <Image
              src="/footer/openfort.png"
              alt="Logo"
              width={90}
              height={90}
              className="brightness-0 dark:invert mt-1"
            />
          </Link>

          <Link href="https://bags.fm" target="_blank">
            <div className="flex items-center gap-1">
              <Image
                src={"/footer/bags.png"}
                alt="Logo"
                width={22}
                height={22}
                className="brightness-0 dark:invert"
              />

              <p className="font-semibold text-sm">Bags.fm</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-between items-center w-full mb-0.5">
          <Image
            src={"/footer/Colosseum.png"}
            alt=""
            width={150}
            height={150}
            className="not-dark:invert"
          />

          <div className="relative overflow-hidden h-5 flex-1 hidden sm:flex">
            <Image
              src={"/footer/title.png"}
              alt=""
              width={160}
              height={160}
              className="absolute scale-x-130 -top-9 right-4"
            />
          </div>
        </div>

        <Image src={"/footer/Frontier.png"} alt="" width={600} height={100} />

        <div className="flex sm:flex-row flex-col gap-2 flex-wrap mt-6 text-xs font-semibold opacity-50 text-center">
          <Link
            href={"https://x.com/autobattle_fun"}
            target="_blank"
            className="hover:underline"
          >
            X/Twitter
          </Link>

          <Link href={"/terms-of-service"} className="hover:underline">
            Terms of Service
          </Link>

          <Link href={"/privacy-policy"} className="hover:underline">
            Privacy Policy
          </Link>
        </div>

        {count > 6 && <EasterEgg />}
      </div>
    </div>
  );
}
