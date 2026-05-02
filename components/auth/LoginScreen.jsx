"use client";

import { Wallet, Globe } from "lucide-react";
import { LoginShell } from "@/components/auth/login/LoginShell";
import { LoginMethodCard } from "@/components/auth/login/LoginMethodCard";
import Image from "next/image";
import { OAuthProvider, useOAuth } from "@openfort/react";

export function LoginScreen() {
  const { initOAuth, isLoading } = useOAuth();

  const handleGoogleLogin = () => {
    initOAuth({
      provider: OAuthProvider.GOOGLE,
      redirectTo: "/verify-login",
    });
  };

  const handleXLogin = () => {
    initOAuth({
      provider: OAuthProvider.TWITTER,
      redirectTo: "/verify-login",
    });
  };

  const handleDiscordLogin = () => {
    initOAuth({
      provider: OAuthProvider.DISCORD,
      redirectTo: "/verify-login",
    });
  };

  const methods = [
    {
      id: "Google",
      label: "Google",
      icon: (
        <Image src="/provider/google.svg" width={24} height={24} alt="Google" />
      ),
      action: () => {
        handleGoogleLogin();
      },
    },
    {
      id: "X",
      label: "X/Twitter",
      icon: (
        <Image src="/provider/x.png" width={24} height={24} alt="X/Twitter" />
      ),
      action: () => {
        handleXLogin();
      },
    },
    {
      id: "Discord",
      label: "Discord",
      icon: (
        <Image
          src="/provider/discord.svg"
          width={24}
          height={24}
          alt="Discord"
        />
      ),
      action: () => {
        handleDiscordLogin();
      },
    },
  ];

  return (
    <LoginShell title="Login" description="Access your Autobattle.fun account">
      <div className="space-y-4">
        <div className="space-y-3">
          {methods.map((method) => (
            <LoginMethodCard
              key={method.id}
              method={method}
              busy={isLoading}
              onSelect={method.action}
            />
          ))}
        </div>

        <div className="text-center text-sm mt-5 font-semibold opacity-50 -mb-2 flex justify-center items-center gap-2">
          Powered by{" "}
          <Image
            src="/provider/openfort.svg"
            width={20}
            height={20}
            alt="Openfort"
            className="-mx-1"
          />{" "}
          Openfort
        </div>
      </div>
    </LoginShell>
  );
}
