"use client";

import { ThemeProvider } from "./ThemeProvider";
import { OpenfortProvider } from "@openfort/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function ClientProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <OpenfortProvider
        publishableKey={process.env.NEXT_PUBLIC_OPENFORT_PUBLISHABLE_KEY}
        walletConfig={{
          shieldPublishableKey:
            process.env.NEXT_PUBLIC_OPENFORT_SHIELD_PUBLISHABLE_KEY,
          solana: { cluster: "mainnet-beta" },
          createEncryptedSessionEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openfort/create-session`,
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </OpenfortProvider>
    </QueryClientProvider>
  );
}
