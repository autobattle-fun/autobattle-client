"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

const privyConfig = {
  appearance: {
    theme: "dark",
    landingHeader: "Autobattle access",
    loginMessage: "Sign in with social or wallet.",
    showWalletLoginFirst: true,
    walletChainType: "solana-only",
  },
  solana: {
    rpcs: {
      "solana:mainnet": {
        rpc: createSolanaRpc("https://api.mainnet-beta.solana.com"),
        rpcSubscriptions: createSolanaRpcSubscriptions(
          "wss://api.mainnet-beta.solana.com",
        ),
      },
    },
  },
  loginMethods: ["wallet", "email"],
  externalWallets: {
    solana: {
      connectors: toSolanaWalletConnectors(),
    },
  },
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
  },
};

export function PrivyProviderClient({ children }) {
  if (!appId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={privyConfig}
      clientId={clientId || undefined}
    >
      {children}
    </PrivyProvider>
  );
}
