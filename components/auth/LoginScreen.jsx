"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Globe, User, LogOut } from "lucide-react";
import {
  useLogin,
  usePrivy,
  useWallets,
  useLogout,
  useUser,
} from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { normalizeUsername } from "@/lib/username";
import { LoginShell } from "@/components/auth/login/LoginShell";
import { LoginStatusCard } from "@/components/auth/login/LoginStatusCard";
import { LoginMethodCard } from "@/components/auth/login/LoginMethodCard";
import { LoginUsernameCard } from "@/components/auth/login/LoginUsernameCard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

function normalizeAuthProvider(value) {
  if (!value) {
    return "privy";
  }

  const lowerValue = String(value).toLowerCase();

  if (lowerValue.includes("twitter")) {
    return "x";
  }

  if (lowerValue.includes("google")) {
    return "google";
  }

  if (lowerValue.includes("wallet")) {
    return "wallet";
  }

  if (lowerValue.includes("email")) {
    return "email";
  }

  return lowerValue;
}

export function LoginScreen() {
  const router = useRouter();
  const { ready, authenticated, getAccessToken } = usePrivy();
  const { logout } = useLogout();
  const { user: privyUser } = useUser();
  const { ready: walletsReady, wallets } = useWallets();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [flowError, setFlowError] = useState("");
  const [isSubmittingUsername, setIsSubmittingUsername] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [needsUsername, setNeedsUsername] = useState(false);
  const [pendingAccessToken, setPendingAccessToken] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [authProfile, setAuthProfile] = useState({
    authProvider: "privy",
    walletAddress: null,
    email: null,
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isExistingPrivySession = ready && authenticated;
  const authProfileKey = `${authProfile.authProvider}|${authProfile.walletAddress || ""}|${authProfile.email || ""}`;

  const isBusy = isLoggingIn || isBootstrapping;

  const statusText = !ready
    ? "Preparing sign-in"
    : isExistingPrivySession && !needsUsername
      ? "Checking your app account"
      : needsUsername
        ? "Finish account setup"
        : "Choose a sign-in method";

  const statusDescription = !ready
    ? "Connecting to authentication and loading your session."
    : isExistingPrivySession && !needsUsername
      ? "We found an active Privy session and are syncing it with your app account."
      : needsUsername
        ? "Create the public username that will show in your app profile."
        : "Use a social account or Solana wallet to continue.";

  const { login } = useLogin({
    onComplete: ({ user, loginMethod, loginAccount }) => {
      const walletAddress =
        loginAccount?.address || user?.wallet?.address || null;
      const email =
        user?.email?.address ||
        user?.google?.email ||
        loginAccount?.email ||
        null;

      setAuthProfile({
        authProvider: normalizeAuthProvider(
          loginMethod ||
            (user?.google
              ? "google"
              : user?.twitter
                ? "twitter"
                : user?.wallet
                  ? "wallet"
                  : user?.email
                    ? "email"
                    : "privy"),
        ),
        walletAddress,
        email,
      });
    },
  });

  useEffect(() => {
    if (!privyUser) {
      return;
    }

    setAuthProfile({
      authProvider: normalizeAuthProvider(
        privyUser.twitter
          ? "twitter"
          : privyUser.google
            ? "google"
            : privyUser.wallet
              ? "wallet"
              : privyUser.email
                ? "email"
                : "privy",
      ),
      walletAddress: privyUser.wallet?.address || null,
      email: privyUser.email?.address || privyUser.google?.email || null,
    });
  }, [privyUser]);

  async function runLogin(options) {
    setFlowError("");
    setIsLoggingIn(true);

    try {
      await login(options);
    } catch (error) {
      setFlowError(
        error instanceof Error ? error.message : "Login cancelled or failed.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  const methods = [
    {
      id: "social",
      label: "Continue with Social",
      description: "Use Google or X.",
      icon: <Globe className="h-4 w-4" />,
      action: () =>
        runLogin({
          loginMethods: ["google", "twitter"],
        }),
    },
    {
      id: "wallet",
      label: "Continue with Wallet",
      description: "Sign in with your Solana wallet.",
      icon: <Wallet className="h-4 w-4" />,
      action: () =>
        runLogin({
          loginMethods: ["wallet"],
          walletChainType: "solana-only",
        }),
    },
  ];

  async function syncWithServer() {
    if (!ready || !authenticated) {
      return;
    }

    setIsBootstrapping(true);
    setFlowError("");

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("No access token returned.");
      }

      setPendingAccessToken(accessToken);

      const response = await fetch(`${API_BASE_URL}/auth/session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(authProfile),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to verify your account.");
      }

      if (payload.status === "needs_username") {
        setAppUser(payload.user);
        setNeedsUsername(true);
        setUsername(payload.user?.suggestedUsername || "");
        return;
      }

      window.dispatchEvent(
        new CustomEvent("autobattle-auth-changed", {
          detail: { isAuthenticated: true },
        }),
      );

      router.push("/");
    } catch (error) {
      setFlowError(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    } finally {
      setIsBootstrapping(false);
    }
  }

  useEffect(() => {
    if (!ready || !authenticated || needsUsername) {
      return;
    }

    syncWithServer();
  }, [authenticated, needsUsername, ready, authProfileKey]);

  async function handleUsernameSubmit(event) {
    event.preventDefault();

    const normalized = normalizeUsername(username);

    if (normalized.length < 3 || normalized.length > 20) {
      setUsernameError("Usernames must be 3-20 characters.");
      return;
    }

    if (!/^[a-z0-9_]+$/.test(normalized)) {
      setUsernameError("Use only lowercase letters, numbers, and underscores.");
      return;
    }

    setIsSubmittingUsername(true);
    setUsernameError("");

    try {
      const accessToken = pendingAccessToken || (await getAccessToken());

      if (!accessToken) {
        throw new Error("Your session expired before onboarding completed.");
      }

      const response = await fetch(`${API_BASE_URL}/auth/username`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: normalized, ...authProfile }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create your account.");
      }

      setAppUser(payload.user);
      window.dispatchEvent(
        new CustomEvent("autobattle-auth-changed", {
          detail: { isAuthenticated: true },
        }),
      );
      router.push("/");
    } catch (error) {
      setUsernameError(
        error instanceof Error ? error.message : "Username setup failed.",
      );
    } finally {
      setIsSubmittingUsername(false);
    }
  }

  async function handleSignOut() {
    try {
      if (walletsReady && wallets.length > 0) {
        await Promise.allSettled(
          wallets.map((wallet) => Promise.resolve(wallet.disconnect())),
        );
      }

      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      await logout();
    } finally {
      setNeedsUsername(false);
      setUsername("");
      setPendingAccessToken(null);
      setAppUser(null);
      setAuthProfile({
        authProvider: "privy",
        walletAddress: null,
        email: null,
      });

      window.dispatchEvent(
        new CustomEvent("autobattle-auth-changed", {
          detail: { isAuthenticated: false },
        }),
      );

      router.push("/login");
    }
  }

  if (!ready) {
    return (
      <LoginShell
        eyebrow="AutoBattle access"
        title="Welcome"
        description="Connecting authentication and loading your session."
      >
        <LoginStatusCard
          title="Preparing sign-in"
          description="Connecting to authentication and loading your session."
        />
      </LoginShell>
    );
  }

  if (isExistingPrivySession && !needsUsername) {
    return (
      <LoginShell
        eyebrow="AutoBattle access"
        title="Welcome back"
        description="You are already signed in. Finishing account setup..."
      >
        {flowError ? (
          <Card className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 shadow-none">
            <div className="flex items-start gap-2 text-red-400 text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <span>{flowError}</span>
            </div>
          </Card>
        ) : null}
        <LoginStatusCard
          title="Checking your app account"
          description="Syncing your login with the app session."
        />
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            className="rounded-2xl"
            onClick={syncWithServer}
            disabled={isBootstrapping}
          >
            Retry
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-2xl"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </LoginShell>
    );
  }

  return (
    <LoginShell
      eyebrow="AutoBattle access"
      title="Login"
      description="Sign in with social or wallet, then complete your username if this is your first time."
    >
      <div className="space-y-4">
        {isBusy ? (
          <LoginStatusCard title={statusText} description={statusDescription} />
        ) : null}

        {flowError ? (
          <Card className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 shadow-none">
            <div className="flex items-start gap-2 text-red-400 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <span>{flowError}</span>
            </div>
          </Card>
        ) : null}

        {needsUsername ? (
          <LoginUsernameCard
            username={username}
            onUsernameChange={setUsername}
            usernameError={usernameError}
            onSubmit={handleUsernameSubmit}
            onSignOut={handleSignOut}
            isSubmittingUsername={isSubmittingUsername}
            appUser={appUser}
            walletAddress={authProfile.walletAddress}
          />
        ) : (
          <div className="space-y-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-text-muted">
              Step 1 of 2
            </div>

            {methods.map((method) => (
              <LoginMethodCard
                key={method.id}
                method={method}
                busy={isBusy}
                onSelect={method.action}
              />
            ))}

            <Card className="rounded-3xl border border-border bg-element/70 p-4 shadow-none">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-text-main">
                <User className="h-4 w-4 text-primary" />
                Account flow
              </div>
              <p className="text-xs leading-6 text-text-muted">
                After authentication, the backend checks your app account. If no
                account exists, you will be prompted for a username.
              </p>
            </Card>
          </div>
        )}
      </div>
    </LoginShell>
  );
}
