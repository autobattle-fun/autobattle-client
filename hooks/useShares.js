"use client";

import { useUser } from "@openfort/react";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { useSolanaEmbeddedWallet } from "@openfort/react/solana";
import { Transaction, PublicKey } from "@solana/web3.js"; // <-- Make sure PublicKey is here!
import useUserUtil from "./useUserUtil";

export default function useShares() {
  const { getAccessToken } = useUser();
  const walletAddress = useUserStore((state) => state.user?.walletAddress);
  const { loadMetadata, loadShares } = useUserUtil();

  const solana = useSolanaEmbeddedWallet();

  const buyShares = async (
    marketId,
    side,
    amountTokens,
    isRound,
    setIsLoading,
  ) => {
    try {
      setIsLoading(true);

      // 1. Ensure the embedded wallet is active and handle React stale state
      if (!solana.activeWallet) {
        await solana.setActive({ address: walletAddress });
        toast.info("Wallet connecting... Please click Confirm one more time.");
        setIsLoading(false);
        return; // 🛑 Stop here to let React re-render with the provider!
      }

      if (!solana.provider) {
        throw new Error(
          "Wallet provider is still waking up. Please try again.",
        );
      }

      console.log("Wallet set! Proceeding with address:", walletAddress);

      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("No access token found");

      // STEP 1: Ask backend to build the transaction
      console.log("Building transaction...");
      const buildResponse = await fetch(`${API_BASE_URL}/api/trades/build`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ marketId, side, amountTokens }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const buildData = await buildResponse.json();
      if (!buildData.success)
        throw new Error(buildData.error || "Failed to prepare trade");

      // STEP 2: Decode the transaction and get user signature
      console.log("Requesting signature...");
      const txBuffer = Buffer.from(buildData.transaction, "base64");
      const transaction = Transaction.from(txBuffer);

      // 🔥 FIX 1: Aggressively lock in the Paymaster as the fee payer
      transaction.feePayer = new PublicKey(buildData.feePayer);

      // Ask the Openfort embedded wallet to sign it
      const userSignedTx = await solana.provider.signTransaction(transaction);

      const bs58 = (await import("bs58")).default;
      let sigBuffer;
      try {
        sigBuffer = bs58.decode(userSignedTx.signature);
      } catch {
        sigBuffer = Buffer.from(userSignedTx.signature, "base64");
      }
      transaction.addSignature(
        new PublicKey(userSignedTx.publicKey),
        sigBuffer,
      );

      const partiallySignedBase64 = Buffer.from(
        transaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        }),
      ).toString("base64");

      // STEP 3: Send back to backend for Gas Sponsorship & Execution
      console.log("Sending to backend for gasless execution...");
      const executeResponse = await fetch(`${API_BASE_URL}/api/trades/verify`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          partiallySignedBase64,
          feePayer: buildData.feePayer,
          marketId,
          side,
          amountTokens,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const executeData = await executeResponse.json();
      if (!executeData.success)
        throw new Error(executeData.error || "Failed to execute trade");

      await loadMetadata();
      await loadShares(marketId, isRound);

      toast.success("Trade executed and verified successfully!");
      return executeData;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const sellShares = async (
    marketId,
    side,
    amountShares,
    isRound,
    setIsLoading,
  ) => {
    try {
      setIsLoading(true);

      // 1. Ensure the embedded wallet is active and handle React stale state
      if (!solana.activeWallet) {
        await solana.setActive({ address: walletAddress });
        toast.info("Wallet connecting... Please click Confirm one more time.");
        setIsLoading(false);
        return;
      }

      if (!solana.provider) {
        throw new Error(
          "Wallet provider is still waking up. Please try again.",
        );
      }

      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("No access token found");

      // STEP 1: Ask backend to build the SELL transaction
      console.log("Building sell transaction...");
      const buildResponse = await fetch(
        `${API_BASE_URL}/api/trades/sell/build`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ marketId, side, amountShares }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const buildData = await buildResponse.json();
      if (!buildData.success)
        throw new Error(buildData.error || "Failed to prepare sell order");

      // STEP 2: Decode the transaction and get user signature
      console.log("Requesting signature...");
      const txBuffer = Buffer.from(buildData.transaction, "base64");
      const transaction = Transaction.from(txBuffer);

      // 🔥 FIX 1: Aggressively lock in the Paymaster as the fee payer
      transaction.feePayer = new PublicKey(buildData.feePayer);

      const userSignedTx = await solana.provider.signTransaction(transaction);

      // 🛡️ Defensive Serialization
      const bs58 = (await import("bs58")).default;
      let sigBuffer;
      try {
        sigBuffer = bs58.decode(userSignedTx.signature);
      } catch {
        sigBuffer = Buffer.from(userSignedTx.signature, "base64");
      }
      transaction.addSignature(
        new PublicKey(userSignedTx.publicKey),
        sigBuffer,
      );

      const partiallySignedBase64 = Buffer.from(
        transaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        }),
      ).toString("base64");

      // STEP 3: Send back to backend for Gas Sponsorship & Execution
      console.log("Sending to backend for gasless execution...");
      const executeResponse = await fetch(
        `${API_BASE_URL}/api/trades/sell/verify`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            partiallySignedBase64,
            feePayer: buildData.feePayer,
            marketId,
            side,
            amountShares,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const executeData = await executeResponse.json();
      if (!executeData.success)
        throw new Error(executeData.error || "Failed to execute sell order");

      await loadMetadata();
      await loadShares(marketId, isRound);

      toast.success("Shares sold successfully!");
      return executeData;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred while selling");
    } finally {
      setIsLoading(false);
    }
  };

  const transferTokens = async (
    recipientAddress,
    amountTokens,
    setIsLoading,
  ) => {
    try {
      setIsLoading(true);

      // 1. Ensure the embedded wallet is active and handle React stale state
      if (!solana.activeWallet) {
        await solana.setActive({ address: walletAddress });
        toast.info("Wallet connecting... Please click Confirm one more time.");
        setIsLoading(false);
        return;
      }

      if (!solana.provider) {
        throw new Error(
          "Wallet provider is still waking up. Please try again.",
        );
      }

      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("No access token found");

      // STEP 1: Ask backend to build the TRANSFER transaction
      console.log("Building transfer transaction...");
      const buildResponse = await fetch(
        `${API_BASE_URL}/api/trades/transfer/build`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ recipientAddress, amountTokens }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const buildData = await buildResponse.json();
      if (!buildData.success)
        throw new Error(buildData.error || "Failed to prepare transfer");

      // STEP 2: Decode the transaction and get user signature
      console.log("Requesting signature...");
      const txBuffer = Buffer.from(buildData.transaction, "base64");
      const transaction = Transaction.from(txBuffer);

      // 🔥 FIX 1: Aggressively lock in the Paymaster as the fee payer
      transaction.feePayer = new PublicKey(buildData.feePayer);

      const userSignedTx = await solana.provider.signTransaction(transaction);

      let partiallySignedBase64;

      if (userSignedTx?.signature && userSignedTx?.publicKey) {
        // Openfort returns { signature, publicKey } — manually add sig to transaction
        const { PublicKey } = await import("@solana/web3.js");

        const signerPubkey = new PublicKey(userSignedTx.publicKey);
        const signatureBytes = Buffer.from(userSignedTx.signature, "base64");

        // Try base58 decode first, then base64
        let sigBuffer;
        try {
          const bs58 = (await import("bs58")).default;
          sigBuffer = bs58.decode(userSignedTx.signature);
        } catch {
          sigBuffer = Buffer.from(userSignedTx.signature, "base64");
        }

        // Add the signature to the transaction
        transaction.addSignature(signerPubkey, sigBuffer);

        partiallySignedBase64 = Buffer.from(
          transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          }),
        ).toString("base64");
      } else if (typeof userSignedTx === "string") {
        partiallySignedBase64 = userSignedTx;
      } else if (userSignedTx?.serialize) {
        partiallySignedBase64 = Buffer.from(
          userSignedTx.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          }),
        ).toString("base64");
      }

      // STEP 3: Send back to backend for Gas Sponsorship & Execution
      console.log("Sending to backend for gasless execution...");
      const executeResponse = await fetch(
        `${API_BASE_URL}/api/trades/transfer/verify`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            partiallySignedBase64,
            feePayer: buildData.feePayer,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const executeData = await executeResponse.json();
      if (!executeData.success)
        throw new Error(executeData.error || "Failed to execute transfer");

      await loadMetadata();
      toast.success("Tokens transferred successfully!");
      return executeData;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred while transferring");
    } finally {
      setIsLoading(false);
    }
  };

  return { buyShares, sellShares, transferTokens };
}
