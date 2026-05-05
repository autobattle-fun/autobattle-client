"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import AgentSide from "./AgentSide";
import {
  adaptServerStateToEngine,
  getDamageValue,
  drawRandomCard,
} from "../../lib/cards";

const calculateScore = (cards) => {
  let score = 0;
  let aces = 0;

  cards.forEach((card) => {
    const rank = card.rank;
    let value = 0;
    if (rank === "A") {
      value = 11;
      aces++;
    } else if (["J", "Q", "K"].includes(rank)) {
      value = 10;
    } else {
      value = parseInt(rank);
    }
    score += value;
  });

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
};

export default function PlayGameUI() {
  const { resolvedTheme } = useTheme();
  const [round, setRound] = useState(1);
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [phase, setPhase] = useState("playerTurn");
  const [playerHp, setPlayerHp] = useState(10);
  const [aiHp, setAiHp] = useState(10);
  const [winner, setWinner] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const isDark = resolvedTheme === "dark";

  // Player Hit - only adds to PLAYER
  const playerHit = () => {
    if (phase !== "playerTurn" || gameOver) return;

    const newCard = drawRandomCard(allCards);
    const newCards = [...playerCards, newCard];
    setPlayerCards(newCards);
    setAllCards([...allCards, newCard]);

    const score = calculateScore(newCards);

    // Check for bust
    if (score > 21) {
      setMessage("You busted! Over 21!");
      setPhase("ended");
      const damage = getDamageValue(round);
      const newPlayerHp = playerHp - damage;
      setPlayerHp(newPlayerHp);

      // Check if player lost all HP
      setTimeout(() => {
        setWinner("ai");
        if (newPlayerHp <= 0) {
          setGameOver(true);
          setMessage(`Game Over! You lost. You busted - Your HP: 0`);
        }
      }, 500);
      return;
    }

    // Auto-stay if hit 21
    if (score === 21) {
      setMessage("You hit 21!");
      setTimeout(() => triggerAITurn(newCards), 1500);
    }
  };

  // Player Stay - trigger AI turn
  const playerStay = () => {
    if (phase !== "playerTurn" || gameOver) return;
    triggerAITurn(playerCards);
  };

  // AI Turn - AI gets opening card and plays
  const triggerAITurn = (pCards) => {
    setPhase("aiTurn");
    setMessage("");

    // AI gets its opening card on its first turn
    let currentAiCards =
      aiCards.length === 0 ? [drawRandomCard(allCards)] : [...aiCards];
    setAiCards(currentAiCards);
    if (aiCards.length === 0) {
      setAllCards([...allCards, currentAiCards[0]]);
    }

    // AI plays after a delay
    setTimeout(() => playAILogic(pCards, currentAiCards), 1000);
  };

  // AI Logic - hit if < 16, stay if >= 16
  const playAILogic = (pCards, aiHand) => {
    let currentAiCards = [...aiHand];

    const executeAITurn = () => {
      const aiScore = calculateScore(currentAiCards);

      if (aiScore < 16) {
        // AI hits
        const newCard = drawRandomCard(allCards);
        currentAiCards = [...currentAiCards, newCard];
        setAiCards(currentAiCards);
        setAllCards([...allCards, newCard]);

        // Check if AI busts
        if (calculateScore(currentAiCards) > 21) {
          setMessage("AI busted! Over 21!");
          setPhase("ended");
          const damage = getDamageValue(round);
          const newAiHp = aiHp - damage;
          setAiHp(newAiHp);

          setTimeout(() => {
            setWinner("player");
            if (newAiHp <= 0) {
              setGameOver(true);
              setMessage(`You win! AI busted - AI HP: 0`);
            }
          }, 500);
          return;
        }

        // Continue AI turn after delay
        setTimeout(executeAITurn, 1000);
      } else {
        // AI stays - both get 1 card, then compare
        endRound(pCards, currentAiCards);
      }
    };

    setTimeout(executeAITurn, 800);
  };

  // End Round - Both get 1 card, then compare scores and apply damage to loser only
  const endRound = (playerCardArray, aiCardArray) => {
    setPhase("ended");

    // Both players get 1 random card
    const playerNewCard = drawRandomCard(allCards);
    const aiNewCard = drawRandomCard([...allCards, playerNewCard]);

    const updatedPlayerCards = [...playerCardArray, playerNewCard];
    const updatedAiCards = [...aiCardArray, aiNewCard];

    setPlayerCards(updatedPlayerCards);
    setAiCards(updatedAiCards);
    setAllCards([...allCards, playerNewCard, aiNewCard]);

    // Recalculate scores after new cards
    const newPlayerScore = calculateScore(updatedPlayerCards);
    const newAiScore = calculateScore(updatedAiCards);

    // Determine winner - ONLY loser loses HP
    if (newPlayerScore > newAiScore) {
      setMessage(`You win! ${newPlayerScore} vs ${newAiScore}`);
      const damage = getDamageValue(round);
      const newAiHp = aiHp - damage;
      setAiHp(newAiHp);

      setTimeout(() => {
        setWinner("player");
        if (newAiHp <= 0) {
          setGameOver(true);
          setMessage(`You win! ${newPlayerScore} vs ${newAiScore} - AI HP: 0`);
        }
      }, 500);
    } else if (newAiScore > newPlayerScore) {
      setMessage(`AI wins! ${newAiScore} vs ${newPlayerScore}`);
      const damage = getDamageValue(round);
      const newPlayerHp = playerHp - damage;
      setPlayerHp(newPlayerHp);

      setTimeout(() => {
        setWinner("ai");
        if (newPlayerHp <= 0) {
          setGameOver(true);
          setMessage(
            `Game Over! You lost. ${newPlayerScore} vs ${newAiScore} - Your HP: 0`,
          );
        }
      }, 500);
    } else {
      setMessage(`Draw! Both ${newPlayerScore}`);
      setWinner("draw");
    }
  };

  // Reset for next round
  const resetRound = () => {
    if (gameOver) return; // Can't continue if game is over

    setRound(round + 1);
    setPlayerCards([]);
    setAiCards([]);
    setPhase("playerTurn");
    setWinner(null);
    setAllCards([]);
    setMessage("");
  };

  const playerScore = calculateScore(playerCards);
  const aiScore = calculateScore(aiCards);

  const gameState = {
    gameId: Math.floor(Math.random() * 9000) + 1000,
    phase:
      phase === "playerTurn"
        ? "RedTurn"
        : phase === "aiTurn"
          ? "BlueTurn"
          : "Ended",
    red: { name: "You", score: playerScore, hp: playerHp },
    blue: { name: "AI Opponent", score: aiScore, hp: aiHp },
    playerStatus: {
      red: phase === "playerTurn" ? "WAITING" : "FINALIZED",
      blue: phase === "aiTurn" ? "THINKING" : "WAITING",
    },
  };

  return (
    <div
      className={`flex h-screen overflow-hidden selection:bg-amber-500/30 transition-colors duration-500`}
    >
      <div className="flex-1 flex flex-col relative w-full h-full overflow-y-auto overflow-x-hidden">
        <main className="flex-1 p-2 sm:p-4 md:p-8 flex pb-0! flex-col max-w-6xl w-full mx-auto relative">
          <div className="flex flex-col items-center mt-2 md:mt-4 relative z-10 shrink-0">
            <h1
              className={`text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center leading-[1.1] ${isDark ? "text-white" : "text-[#111827]"}`}
            >
              {gameOver ? "GAME OVER" : `Match #${gameState?.gameId}`}
              <br />
              <span className="text-zinc-500 font-semibold text-base sm:text-2xl md:text-4xl mt-0.5 md:mt-2 block">
                Closest to 21 Wins
              </span>
            </h1>
          </div>

          <div className="flex flex-col xl:flex-row items-center xl:items-stretch justify-center gap-3 md:gap-8 w-full mt-4 md:mt-10 flex-1 isolate">
            {/* Center Card */}
            <div className="flex flex-col justify-center items-center w-full max-w-100 xl:max-w-85 shrink-0 relative z-20 order-1 xl:order-2">
              <motion.div
                layout
                className={`${isDark ? "bg-zinc-900/80" : "bg-white/80"} w-full border-foreground/20 backdrop-blur-xl border p-4 md:p-8 rounded-[24px] md:rounded-[32px] flex flex-col items-center text-center relative overflow-hidden transition-colors duration-500`}
              >
                <div className="text-sm md:text-lg uppercase font-bold tracking-[0.05em] text-zinc-500 mb-1">
                  <span>ROUND {round}</span>
                </div>
                <div
                  className={`text-[10px] md:text-xs font-bold tracking-tight mb-3 md:mb-6 bg-primary/10 border border-primary text-primary rounded-lg px-2 py-1`}
                >
                  {gameOver
                    ? "GAME OVER"
                    : gameState?.phase?.replace(/([A-Z])/g, " $1").trim()}
                </div>

                <div className="flex-1 mb-4 flex flex-col items-center justify-center relative w-full gap-2 md:gap-4 p-4 rounded-xl overflow-hidden mt-1 md:mt-2 dark:bg-zinc-900 bg-white border border-amber-500/50 transition-colors duration-500 h-24 md:h-32">
                  {getDamageValue(round) >= 4 && (
                    <div className="absolute inset-0 bg-linear-to-t from-orange-500/20 via-orange-500/5 to-transparent blur-xl animate-pulse pointer-events-none" />
                  )}
                  <span className="text-[8px] md:text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mb-0 md:mb-1 z-10 relative mt-1 md:mt-2">
                    Round Stakes
                  </span>
                  <div
                    className={`text-5xl md:text-7xl font-black tracking-tighter flex items-end gap-1 z-10 relative ${getDamageValue(round) >= 4 ? "text-orange-600 dark:text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "text-amber-600 dark:text-amber-500"}`}
                  >
                    {getDamageValue(round)}
                    <span className="text-xs md:text-lg font-bold tracking-widest opacity-50 mb-1 ml-1">
                      HP
                    </span>
                  </div>
                  {getDamageValue(round) === 1 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      Let the round begin!
                    </div>
                  )}
                  {getDamageValue(round) === 2 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      Getting serious...
                    </div>
                  )}
                  {getDamageValue(round) >= 8 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-red-600 dark:text-red-500 bg-red-500/10 px-2 md:px-3 py-1 rounded-full border border-red-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 animate-bounce z-10 relative shadow-[0_0_10px_rgba(239,68,68,0.2)] mb-2 md:mb-0">
                      Lethal Stakes
                    </div>
                  )}
                  {getDamageValue(round) === 4 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      High Stakes
                    </div>
                  )}

                  {message && (
                    <div className="text-xs md:text-sm font-bold text-center mt-2 z-10">
                      {message}
                    </div>
                  )}
                </div>

                {phase === "playerTurn" && !gameOver && (
                  <div className="w-full flex gap-2">
                    <button
                      onClick={playerHit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
                    >
                      HIT
                    </button>
                    <button
                      onClick={playerStay}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-all"
                    >
                      STAY
                    </button>
                  </div>
                )}

                {phase === "ended" && !gameOver && (
                  <button
                    onClick={resetRound}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all"
                  >
                    NEXT ROUND
                  </button>
                )}

                {gameOver && (
                  <div className="w-full text-center">
                    <p className="text-sm md:text-base font-bold text-red-600 dark:text-red-400 mb-3">
                      MATCH OVER
                    </p>
                    <button
                      onClick={() => {
                        setRound(1);
                        setPlayerCards([]);
                        setAiCards([]);
                        setPhase("playerTurn");
                        setWinner(null);
                        setAllCards([]);
                        setGameOver(false);
                        setPlayerHp(10);
                        setAiHp(10);
                        setMessage("");
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
                    >
                      RESTART GAME
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Red (You) and Blue (AI) Agents */}
            <div className="w-full flex flex-row justify-between xl:contents order-2 xl:order-0 gap-2 sm:gap-4">
              <div className="w-[49%] xl:w-2/5 flex justify-end xl:order-1">
                <AgentSide
                  agentName={gameState?.red?.name}
                  side="red"
                  hp={playerHp}
                  cards={playerCards}
                  score={gameState?.red?.score}
                  align="left"
                  status={gameState?.playerStatus?.red}
                  atRisk={
                    gameState?.phase === "Ended" ? 0 : getDamageValue(round)
                  }
                  showRiverPlaceholder={
                    [
                      "RedTurn",
                      "BlueTurn",
                      "AwaitingFinalReveal",
                      "AwaitingTiebreaker",
                    ].includes(gameState?.phase) && playerCards.length > 0
                  }
                />
              </div>

              <div className="w-[49%] xl:w-2/5 flex justify-start xl:order-3">
                <AgentSide
                  agentName={gameState?.blue?.name}
                  side="blue"
                  hp={aiHp}
                  cards={aiCards}
                  score={gameState?.blue?.score}
                  align="right"
                  status={gameState?.playerStatus?.blue}
                  atRisk={
                    gameState?.phase === "Ended" ? 0 : getDamageValue(round)
                  }
                  showRiverPlaceholder={
                    [
                      "RedTurn",
                      "BlueTurn",
                      "AwaitingFinalReveal",
                      "AwaitingTiebreaker",
                    ].includes(gameState?.phase) && aiCards.length > 0
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
