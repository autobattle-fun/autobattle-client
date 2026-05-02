"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LoginShell } from "./login/LoginShell";
import { useOAuth, useOpenfort, useUser, useSignOut } from "@openfort/react";
import { Card } from "../ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { LoginStatusCard } from "./login/LoginStatusCard";
import { LoginUsernameCard } from "./login/LoginUsernameCard";
import { useSolanaEmbeddedWallet } from "@openfort/react/solana";

export default function VerifyScreen() {
  const searchParams = useSearchParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Initializing Account");
  const [loadingSubText, setLoadingSubText] = useState(
    "Please wait while we initialize your account.",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const openfortAuthProvider = searchParams.get("openfortAuthProvider");
  const accessToken = searchParams.get("access_token");
  const userId = searchParams.get("user_id");

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isSubmittingUsername, setIsSubmittingUsername] = useState(false);

  const { storeCredentials } = useOAuth();
  const { embeddedAccounts, isLoadingAccounts } = useOpenfort();
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, getAccessToken } = useUser();
  const { signOut } = useSignOut();
  const router = useRouter();
  const { create } = useSolanaEmbeddedWallet();

  const initUser = async (openfortAuthProvider, accessToken, userId) => {
    setLoadingText("Initializing Account");
    setLoadingSubText("Please wait while we initialize your account.");

    if (!openfortAuthProvider || !accessToken || !userId) {
      setError(true);
      setErrorMessage("Missing authentication information");
      return;
    }
    try {
      setLoading(true);
      setError(false);
      setErrorMessage("");

      const response = await storeCredentials({
        token: accessToken,
        userId,
        recoverWalletAutomatically: false,
      });

      if (response.error) {
        setError(true);
        setErrorMessage("Something Went Wrong");
        setLoading(false);
      }
    } catch (error) {
      setError(true);
      setErrorMessage("Missing authentication information");
      setLoading(false);
    }
  };

  useEffect(() => {
    initUser(openfortAuthProvider, accessToken, userId);
  }, [openfortAuthProvider, accessToken, userId]);

  const checkForSVMWallet = (embeddedAccounts) => {
    for (let i = 0; i < embeddedAccounts.length; i++) {
      if (embeddedAccounts[i]?.chainType === "SVM") {
        return true;
      }
    }

    return false;
  };

  const checkForUser = async (userData) => {
    setLoadingText("Checking");
    setLoadingSubText("Checking for existing account or Wallets");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/get/${userId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        setError(true);
        setErrorMessage("Something Went Wrong");
        return;
      }

      const payload = await response.json();

      if (!payload.success) {
        setError(true);
        setErrorMessage("Something Went Wrong");
        return;
      }

      const user = payload.data;

      if (user) {
        setIsInitialized(true);
        window.dispatchEvent(
          new CustomEvent("autobattle-auth-changed", {
            detail: { isAuthenticated: true },
          }),
        );
        router.push("/");
      } else {
        setIsInitialized(false);
      }
    } catch (error) {
      setError(true);
      setErrorMessage("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !isLoadingAccounts) {
      checkForUser(user);
    }
  }, [user, embeddedAccounts, isLoadingAccounts]);

  const createUser = async () => {
    try {
      setIsSubmittingUsername(true);

      if (username.length < 3 || username.length > 20) {
        setUsernameError("Username must be between 3 and 20 characters");
        return;
      }

      if (!/^[a-z0-9_]+$/.test(username)) {
        setUsernameError(
          "Username can only contain lowercase letters, numbers, and underscores",
        );
        return;
      }

      const isSVMWalletPresent = checkForSVMWallet(embeddedAccounts);

      let SVMWallet = null;

      if (isSVMWalletPresent) {
        SVMWallet = embeddedAccounts.find(
          (account) => account.chainType === "SVM",
        );
      } else {
        SVMWallet = await create();
      }

      const access_token = await getAccessToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/create`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            username,
            walletAddress: SVMWallet?.address,
          }),
        },
      );

      const payload = await response.json();

      if (!payload.success) {
        setError(true);
        setErrorMessage("Something Went Wrong");
        return;
      }

      window.dispatchEvent(
        new CustomEvent("autobattle-auth-changed", {
          detail: { isAuthenticated: true },
        }),
      );
      router.push("/");

      setIsInitialized(true);
    } catch (error) {
      setUsernameError("Something Went Wrong");
    } finally {
      setIsSubmittingUsername(false);
    }
  };

  return (
    <LoginShell
      title={error ? "Error" : "Verifying"}
      description="Access your Autobattle.fun account"
    >
      {error && (
        <>
          <Card className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 shadow-none">
            <div className="flex items-start gap-2 text-sm text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          </Card>
          <Button
            className="flex-1 h-12 rounded-2xl font-semibold w-full cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            <ArrowLeft className="size-4 mr-3" /> Back to Home
          </Button>
        </>
      )}

      {loading && !error && (
        <LoginStatusCard title={loadingText} description={loadingSubText} />
      )}

      {!loading && !error && !isInitialized && (
        <LoginUsernameCard
          username={username}
          onUsernameChange={setUsername}
          usernameError={usernameError}
          isSubmittingUsername={isSubmittingUsername}
          onSignOut={() => {
            signOut();
            router.push("/");
          }}
          onSubmit={createUser}
        />
      )}

      {!loading && !error && isInitialized && (
        <LoginStatusCard
          title="Success"
          description="Welcome to Autobattle.fun"
        />
      )}
    </LoginShell>
  );
}
