"use client";

import { useState } from "react";
import { drawRandomCard, calculateScore, getDamageValue } from "../lib/cards";

export default function useGameEngine() {
  const [phase, setPhase] = useState("AwaitingInitialDeal");
  const [round, setRound] = useState(1);
  const [redHP, setRedHP] = useState(10);
  const [blueHP, setBlueHP] = useState(10);
  const [redCards, setRedCards] = useState([]);
  const [blueCards, setBlueCards] = useState([]);
  const [logs, setLogs] = useState([
    "Smart Contract initialized. Awaiting Phase 1...",
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const crank = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const allCardsInPlay = [...redCards, ...blueCards];

    switch (phase) {
      case "AwaitingInitialDeal": {
        const rc = drawRandomCard([]);
        const bc = drawRandomCard([rc]);
        setRedCards([rc]);
        setBlueCards([bc]);
        setLogs((p) => [
          ...p,
          "Dealt initial cards via VRF.",
          "Red Agent turn.",
        ]);
        setPhase("RedTurn");
        break;
      }

      case "RedTurn": {
        const { score } = calculateScore(redCards);
        if (score < 16) {
          const rc = drawRandomCard(allCardsInPlay);
          setRedCards((prev) => [...prev, rc]);
          const newScore = calculateScore([...redCards, rc]).score;
          setLogs((p) => [
            ...p,
            `Red hits (<16). Drew ${rc.rank}. Score: ${newScore}`,
          ]);

          if (newScore >= 21) {
            setLogs((p) => [
              ...p,
              "Red >= 21. Action locked. Passing turn to Blue.",
            ]);
            setPhase("BlueTurn");
          }
        } else {
          setLogs((p) => [
            ...p,
            `Red stays with ${score}. Executing Blue turn...`,
          ]);
          setPhase("BlueTurn");
        }
        break;
      }

      case "BlueTurn": {
        const { score } = calculateScore(blueCards);
        if (score < 17) {
          const bc = drawRandomCard(allCardsInPlay);
          setBlueCards((prev) => [...prev, bc]);
          const newScore = calculateScore([...blueCards, bc]).score;
          setLogs((p) => [
            ...p,
            `Blue hits (<17). Drew ${bc.rank}. Score: ${newScore}`,
          ]);

          if (newScore >= 21) {
            setLogs((p) => [
              ...p,
              "Blue >= 21. Action locked. Generating Final Reveal VRF...",
            ]);
            setPhase("AwaitingFinalRevealVRF");
          }
        } else {
          setLogs((p) => [
            ...p,
            `Blue stays with ${score}. Generating Final Reveal VRF...`,
          ]);
          setPhase("AwaitingFinalRevealVRF");
        }
        break;
      }

      case "AwaitingFinalRevealVRF": {
        const rc = drawRandomCard(allCardsInPlay);
        const bc = drawRandomCard([...allCardsInPlay, rc]);
        console.log(redCards);
        setRedCards((prev) => [...prev, rc]);
        setBlueCards((prev) => [...prev, bc]);
        setLogs((p) => [
          ...p,
          "River card revealed for both agents! Resolving constraints.",
        ]);
        setPhase("ReadyToResolve");
        break;
      }

      case "ReadyToResolve": {
        const redScore = calculateScore(redCards).score;
        const blueScore = calculateScore(blueCards).score;
        const redDist = Math.abs(redScore - 21);
        const blueDist = Math.abs(blueScore - 21);
        const dmg = getDamageValue(round);

        if (redDist < blueDist) {
          setBlueHP((prev) => prev - dmg);
          setLogs((p) => [
            ...p,
            `Red is closer (${redScore} vs ${blueScore}). Blue takes ${dmg} DMG.`,
          ]);
          if (blueHP - dmg <= 0) {
            setPhase("Ended");
            setLogs((p) => [...p, "Blue Agent offline. Contract terminated."]);
          } else {
            setRound((r) => r + 1);
            setRedCards([]);
            setBlueCards([]);
            setPhase("AwaitingInitialDeal");
          }
        } else if (blueDist < redDist) {
          setRedHP((prev) => prev - dmg);
          setLogs((p) => [
            ...p,
            `Blue is closer (${blueScore} vs ${redScore}). Red takes ${dmg} DMG.`,
          ]);
          if (redHP - dmg <= 0) {
            setPhase("Ended");
            setLogs((p) => [...p, "Red Agent offline. Contract terminated."]);
          } else {
            setRound((r) => r + 1);
            setRedCards([]);
            setBlueCards([]);
            setPhase("AwaitingInitialDeal");
          }
        } else {
          setLogs((p) => [
            ...p,
            `TIE DETECTED. Distance: ${redDist}. Initializing Tiebreaker VRF...`,
          ]);
          setPhase("AwaitingTiebreakerVRF");
        }
        break;
      }

      case "AwaitingTiebreakerVRF": {
        const rc = drawRandomCard(allCardsInPlay);
        const bc = drawRandomCard([...allCardsInPlay, rc]);
        setRedCards((prev) => [...prev, rc]);
        setBlueCards((prev) => [...prev, bc]);
        const redScore = calculateScore([...redCards, rc]).score;
        const blueScore = calculateScore([...blueCards, bc]).score;
        setLogs((p) => [
          ...p,
          `Tiebreaker drawn: Red=${redScore}, Blue=${blueScore}.`,
        ]);
        setPhase("ReadyToResolve");
        break;
      }

      case "Ended": {
        setPhase("AwaitingInitialDeal");
        setRound(1);
        setRedHP(10);
        setBlueHP(10);
        setRedCards([]);
        setBlueCards([]);
        setLogs(["Environment reset. Contract re-initialized."]);
        break;
      }
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 150);
  };

  return {
    phase,
    round,
    redHP,
    blueHP,
    redCards,
    blueCards,
    crank,
    logs,
    isProcessing,
  };
}
