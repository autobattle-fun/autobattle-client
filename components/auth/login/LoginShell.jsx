"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

import Link from "next/link";

export function LoginShell({ title, description, children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center flex-col gap-10 justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Image
        src="/logo/Autobattle-logo.svg"
        alt="Logo"
        width={50}
        height={50}
      />

      <Card className="w-full max-w-md rounded-4xl border-border/70 bg-surface/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-text-main sm:text-[2.15rem]">
              {title}
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-6 font-semibold text-text-muted sm:text-[0.95rem]">
              {description}
            </p>
          </div>

          <div className="space-y-4">{children}</div>
        </div>
      </Card>

      <div className="max-w-sm text-center -mt-6 text-[13px] font-semibold text-text-main">
        <span className="opacity-50">By Continuing, you agree to our</span>{" "}
        <Link
          href="/terms-of-service"
          className="underline opacity-50 hover:opacity-70 transition-opacity whitespace-nowrap"
        >
          Terms of Service
        </Link>{" "}
        <span className="opacity-50">and</span>{" "}
        <Link
          href="/privacy-policy"
          className="underline opacity-50 hover:opacity-70 transition-opacity whitespace-nowrap"
        >
          Privacy Policy
        </Link>{" "}
        <span className="opacity-50">of Autobattle.fun</span>
      </div>
    </div>
  );
}
