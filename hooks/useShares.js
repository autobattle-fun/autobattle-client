"use client";

import { useUser } from "@openfort/react";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { useSolanaEmbeddedWallet } from "@openfort/react/solana";
import { Transaction, PublicKey, Connection } from "@solana/web3.js"; // <-- Added Connection
import useUserUtil from "./useUserUtil";

// Configure your RPC. Make sure this matches your backend's network (devnet)
const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

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

      // 🔥 FIX: Manually broadcast the transaction to the network
      console.log("Broadcasting transaction to Solana network...");
      const connection = new Connection(RPC_URL, "confirmed");
      const rawTx = transaction.serialize();

      const signature = await connection.sendRawTransaction(rawTx, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      console.log("Transaction broadcasted! Signature:", signature);

      // STEP 3: Send back to backend for Database Sync
      console.log("Sending signature to backend for syncing...");
      const executeResponse = await fetch(`${API_BASE_URL}/api/trades/verify`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          signature, // Valid base58 string passed to backend
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
      console.error("Buy Error:", error);
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

      // 🔥 FIX: Manually broadcast the transaction to the network
      console.log("Broadcasting transaction to Solana network...");
      const connection = new Connection(RPC_URL, "confirmed");
      const rawTx = transaction.serialize();

      const signature = await connection.sendRawTransaction(rawTx, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      console.log("Transaction broadcasted! Signature:", signature);

      // STEP 3: Send back to backend for Database Sync
      console.log("Sending signature to backend for syncing...");
      const executeResponse = await fetch(
        `${API_BASE_URL}/api/trades/sell/verify`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            signature, // Valid base58 string passed to backend
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
      console.error("Sell Error:", error);
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

      // 🔥 FIX: Manually broadcast the transaction to the network
      console.log("Broadcasting transaction to Solana network...");
      const connection = new Connection(RPC_URL, "confirmed");
      const rawTx = transaction.serialize();

      const signature = await connection.sendRawTransaction(rawTx, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      console.log("Transaction broadcasted! Signature:", signature);

      // STEP 3: Send back to backend for Database Sync
      console.log("Sending signature to backend for syncing...");
      const executeResponse = await fetch(
        `${API_BASE_URL}/api/trades/transfer/verify`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            signature, // Valid base58 string passed to backend
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
      console.error("Transfer Error:", error);
      toast.error(error.message || "An error occurred while transferring");
    } finally {
      setIsLoading(false);
    }
  };

  const transferSol = async (recipientAddress, amountSol, setIsLoading) => {
    try {
      setIsLoading(true);

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

      // STEP 1: Ask backend to build the SOL TRANSFER transaction
      console.log("Building SOL transfer transaction...");
      const buildResponse = await fetch(
        `${API_BASE_URL}/api/trades/transfer-sol/build`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ recipientAddress, amountSol }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const buildData = await buildResponse.json();
      if (!buildData.success)
        throw new Error(buildData.error || "Failed to prepare SOL transfer");

      // STEP 2: Decode the transaction and get user signature
      console.log("Requesting signature...");
      const txBuffer = Buffer.from(buildData.transaction, "base64");
      const transaction = Transaction.from(txBuffer);

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

      // 🔥 FIX: Manually broadcast the transaction to the network
      console.log("Broadcasting transaction to Solana network...");
      const connection = new Connection(RPC_URL, "confirmed");
      const rawTx = transaction.serialize();

      const signature = await connection.sendRawTransaction(rawTx, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      console.log("Transaction broadcasted! Signature:", signature);

      // STEP 3: Send back to backend for verification
      console.log("Sending signature to backend for syncing...");
      const executeResponse = await fetch(
        `${API_BASE_URL}/api/trades/transfer-sol/verify`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ signature }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const executeData = await executeResponse.json();
      if (!executeData.success)
        throw new Error(executeData.error || "Failed to verify SOL transfer");

      await loadMetadata();
      toast.success("SOL transferred successfully!");
      return executeData;
    } catch (error) {
      console.error("SOL Transfer Error:", error);
      toast.error(error.message || "An error occurred while transferring SOL");
    } finally {
      setIsLoading(false);
    }
  };

  const claimTokens = async (marketId, setIsLoading) => {
    try {
      setIsLoading(true);
      if (!solana.activeWallet) {
        await solana.setActive({ address: walletAddress });
        return;
      }

      const accessToken = await getAccessToken();
      const buildResponse = await fetch(
        `${API_BASE_URL}/api/trades/claim/build`,
        {
          method: "POST",
          body: JSON.stringify({ marketId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const buildData = await buildResponse.json();
      if (!buildData.success) throw new Error(buildData.error);

      // GASLESS FLOW: Decode -> Sign -> verify (sponsored by Openfort)
      const transaction = Transaction.from(
        Buffer.from(buildData.transaction, "base64"),
      );

      // Critical for Claim: Lock in the Paymaster as the fee payer
      transaction.feePayer = new PublicKey(buildData.feePayer);

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

      const executeResponse = await fetch(
        `${API_BASE_URL}/api/trades/claim/verify`,
        {
          method: "POST",
          body: JSON.stringify({
            partiallySignedBase64,
            feePayer: buildData.feePayer,
            marketId,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const executeData = await executeResponse.json();
      if (!executeData.success) throw new Error(executeData.error);

      toast.success("Winnings claimed successfully (gasless)!");
      return executeData;
    } catch (error) {
      console.error("Claim Error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { buyShares, sellShares, transferTokens, transferSol, claimTokens };
}
