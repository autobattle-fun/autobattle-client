"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  ArrowRight,
  ShieldAlert,
  Smile,
  Image as ImageIcon,
  ChevronDown,
  Shield,
  MoreHorizontal,
  Heart,
  ArrowUp,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

// Draws a unique card based on cards already in play
function drawRandomCard(existingCards = []) {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  let card;
  let isDuplicate = true;

  while (isDuplicate) {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];

    isDuplicate = existingCards.some((c) => c.suit === suit && c.rank === rank);

    if (!isDuplicate) {
      card = {
        id: Math.random().toString(36).substring(7),
        suit,
        rank,
        isFaceUp: true,
      };
    }
  }

  return card;
}

// "Smart Aces" -> Ace=11 unless over 21, then Ace=1
function calculateScore(cards) {
  let score = 0;
  let aces = 0;

  for (const c of cards) {
    if (!c.isFaceUp) continue;
    if (c.rank === "A") {
      score += 11;
      aces += 1;
    } else if (["J", "Q", "K"].includes(c.rank)) {
      score += 10;
    } else {
      score += parseInt(c.rank);
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return { score, isBust: score > 21 };
}

function getDamageValue(round) {
  return Math.pow(2, round - 1); // Round 1=1, 2=2, 3=4, 4=8
}

function useGameEngine() {
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

const SUIT_SYMBOLS = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" };
const SUIT_COLORS = {
  hearts: "text-red-600 dark:text-red-500",
  diamonds: "text-red-600 dark:text-red-500",
  clubs: "text-zinc-900 dark:text-zinc-100",
  spades: "text-zinc-900 dark:text-zinc-100",
};

function PlayingCard({ card, delay = 0, align = "right", zIndex = 1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [interactionReady, setInteractionReady] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    const readyTimer = setTimeout(
      () => setInteractionReady(true),
      delay * 1000 + 500,
    );
    return () => {
      clearTimeout(showTimer);
      clearTimeout(readyTimer);
    };
  }, [delay]);

  const isLeft = align === "left";
  // Compact sizes on mobile to allow side-by-side
  const spacingClass = isLeft
    ? "mr-[-1rem] sm:mr-[-1.5rem] md:mr-[-2rem] first:mr-0"
    : "ml-[-1rem] sm:ml-[-1.5rem] md:ml-[-2rem] first:ml-0";

  const textAlignClass = isLeft ? "text-right" : "text-left";

  const transitionEase = interactionReady
    ? "ease-out duration-300"
    : "ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-500";

  if (!card.isFaceUp) {
    return (
      <div
        style={{
          zIndex,
          transitionDelay: interactionReady ? "0s" : `${delay}s`,
        }}
        className={`w-[44px] h-[64px] sm:w-[64px] sm:h-[96px] md:w-[88px] md:h-[128px] dark:bg-[#111] bg-white rounded-lg border dark:border-white/10 border-black/10 shadow-xl flex flex-col items-center justify-center overflow-hidden relative group shrink-0 transition-all ${transitionEase} ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-white from-black to-transparent" />
        <div className="w-4 h-4 md:w-8 md:h-8 rounded-full border dark:border-white/10 border-black/10 flex items-center justify-center dark:bg-zinc-900 bg-gray-50">
          <Cpu className="w-2.5 h-2.5 md:w-4 md:h-4 text-zinc-500" />
        </div>
      </div>
    );
  }

  const initialTransform = isLeft
    ? "translate-y-6 rotate-6 opacity-0"
    : "translate-y-6 -rotate-6 opacity-0";
  const finalTransform = "translate-y-0 rotate-0 opacity-100";

  return (
    <div
      style={{
        zIndex,
        transitionDelay: interactionReady ? "0s" : `${delay}s`,
      }}
      className={`w-[44px] h-[64px] sm:w-[64px] sm:h-[96px] md:w-[88px] md:h-[128px] dark:bg-[#1a1a1a] bg-white rounded-[6px] md:rounded-lg border border-foreground/40 flex flex-col justify-between p-1 md:p-3 ${spacingClass} shrink-0 select-none relative transition-all ${transitionEase} ${isVisible ? finalTransform : initialTransform} hover:-translate-y-1 hover:!z-50 cursor-pointer`}
    >
      <div
        className={`text-[9px] sm:text-xs md:text-base font-bold ${SUIT_COLORS[card.suit]} leading-none w-full ${textAlignClass}`}
      >
        {card.rank}
      </div>
      <div
        className={`text-lg sm:text-2xl md:text-5xl flex justify-center ${SUIT_COLORS[card.suit]}`}
      >
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div
        className={`text-[9px] sm:text-xs md:text-base font-bold ${SUIT_COLORS[card.suit]} leading-none w-full rotate-180 ${textAlignClass}`}
      >
        {card.rank}
      </div>
    </div>
  );
}

function AgentSide({
  agentName,
  side,
  hp,
  cards,
  score,
  align,
  atRisk = 0,
  showRiverPlaceholder = false,
}) {
  const isRed = side === "red";
  const isLeft = align === "left";
  const accentColor = isRed ? "bg-red-600" : "bg-blue-600";
  const avatarRing = isRed
    ? "border-red-600 bg-red-600/10 text-red-600"
    : "border-blue-600 bg-blue-600/10 text-blue-600";

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (cards.length <= 1 && scrollRef.current) {
      scrollRef.current.scrollTo({
        left: isLeft ? scrollRef.current.scrollWidth : 0,
        behavior: "smooth",
      });
    }
  }, [cards.length, isLeft]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handlePointerUp = () => setIsDragging(false);

  return (
    <div
      className={`flex flex-col ${isLeft ? "items-end" : "items-start"} flex-1 w-full relative z-0`}
    >
      <div
        className={`flex items-center gap-1.5 sm:gap-2 md:gap-4 mb-2 md:mb-4 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
      >
        <div
          className={`flex flex-col ${isLeft ? "items-end" : "items-start"}`}
        >
          <h3 className="font-semibold text-[11px] sm:text-sm md:text-lg tracking-tight whitespace-nowrap">
            {agentName}
          </h3>
          <div className="flex items-center gap-1 opacity-60 dark:text-zinc-400 text-zinc-600">
            <ShieldAlert className="w-2.5 h-2.5 md:w-4 md:h-4" />
            <span className="text-[9px] md:text-sm font-bold font-mono tracking-tighter tabular-nums">
              {Math.max(0, hp)} / 10
            </span>
          </div>
        </div>
        <div
          className={`w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full border md:border-2 flex items-center justify-center shadow-sm ${avatarRing} dark:bg-transparent bg-white`}
        >
          <Cpu className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
        </div>
      </div>

      <div
        className={`w-full max-w-[240px] mb-3 md:mb-6 flex flex-col ${isLeft ? "items-end" : "items-start"}`}
      >
        <div
          className={`flex gap-[2px] sm:gap-1 ${isLeft ? "flex-row-reverse" : "flex-row"}`}
        >
          {[...Array(10)].map((_, i) => {
            const isActive = i < Math.max(0, hp);
            const isRisk = isActive && i >= hp - atRisk;
            return (
              <div
                key={i}
                className={`w-1.5 h-3 sm:w-2 sm:h-4 md:w-4 rounded-[1px] md:rounded-sm md:h-6 transition-colors duration-300 ${
                  isActive ? accentColor : "dark:bg-zinc-800 bg-zinc-200"
                } ${isRisk ? "animate-pulse opacity-40 brightness-120" : ""}`}
              />
            );
          })}
        </div>
      </div>

      <div
        className={`p-2.5 sm:p-5 md:p-6 h-full rounded-[16px] md:rounded-[24px] bg-white dark:bg-zinc-900 border border-foreground/20 w-full md:max-w-[340px] flex flex-col ${isLeft ? "items-end text-right" : "items-start text-left"}`}
      >
        <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-2 sm:mb-6 md:mb-8 tabular-nums flex items-baseline dark:text-white text-zinc-900">
          {score}
          {showRiverPlaceholder && (
            <span
              className={`text-xl sm:text-3xl md:text-4xl ml-1 md:ml-2 animate-pulse ${isRed ? "text-red-500" : "text-blue-500"}`}
            >
              +?
            </span>
          )}
          <span className="text-[10px] sm:text-lg md:text-xl text-zinc-600 ml-1 font-bold tracking-normal opacity-50">
            /21
          </span>
        </div>

        <div className="w-full relative h-[72px] sm:h-[110px] md:h-[140px] mt-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div
            ref={scrollRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className={`flex items-center w-full h-full overflow-x-auto [&::-webkit-scrollbar]:hidden px-1 md:px-4 cursor-grab active:cursor-grabbing ${
              isLeft ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {cards.map((card, i) => (
                <PlayingCard
                  key={card.id + "_" + i}
                  card={card}
                  delay={i * 0.1}
                  align={align}
                  zIndex={i + 1}
                />
              ))}
              {showRiverPlaceholder && (
                <motion.div
                  key="river-placeholder"
                  initial={{ opacity: 0, scale: 0.9, x: isLeft ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: isLeft ? 20 : -20 }}
                  style={{ zIndex: 0 }}
                  className={`w-[44px] h-[64px] sm:w-[64px] sm:h-[96px] md:w-[88px] md:h-[128px] border-[1.5px] md:border-2 border-dashed ${
                    isRed
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-blue-500/50 bg-blue-500/5"
                  } rounded-[6px] md:rounded-lg flex flex-col items-center justify-center ${
                    isLeft
                      ? "mr-[-0.75rem] sm:mr-[-1rem] md:mr-[-2rem]"
                      : "ml-[-0.75rem] sm:ml-[-1rem] md:ml-[-2rem]"
                  } overflow-hidden relative shrink-0`}
                >
                  <div
                    className={`animate-pulse text-[7px] sm:text-[8px] md:text-[10px] uppercase ${
                      isRed ? "text-red-500" : "text-blue-500"
                    } font-bold tracking-tighter`}
                  >
                    River
                  </div>
                  <div
                    className={`w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 rounded-full border ${
                      isRed ? "border-red-500" : "border-blue-500"
                    } flex items-center justify-center mt-1 sm:mt-2`}
                  >
                    <div
                      className={`w-1 h-1 md:w-2 md:h-2 ${
                        isRed ? "bg-red-500" : "bg-blue-500"
                      } rounded-full animate-ping`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictionMarkets() {
  return (
    <div className="w-full mt-6 md:mt-8 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 relative z-10 shrink-0">
      <div className="dark:bg-zinc-900 bg-white backdrop-blur-md border border-foreground/20 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden">
        <div className="text-xl sm:text-3xl flex flex-col font-bold mb-5 whitespace-nowrap">
          <span className="truncate">Who will win the match?</span>
          <span className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400 opacity-50">
            Match #24
          </span>
        </div>

        <div className="flex justify-between items-end gap-2">
          <div className="bg-red-500/70 border-b-4 md:border-b-7 border-red-500 rounded-xl md:rounded-2xl p-3 md:p-5 flex-1 flex flex-col items-center cursor-pointer transition-all duration-300">
            <div className="text-[10px] md:text-sm text-white font-bold tracking-widest mb-1 md:mb-2 text-center">
              Donald Trump
            </div>
            <div className="text-xl md:text-3xl text-white font-bold tracking-tighter">
              54 $AUTO
            </div>
          </div>
          <div className="w-px h-10 md:h-16 dark:bg-white/5 bg-black/5 mx-0.5 md:mx-0"></div>
          <div className="bg-blue-500/70 border-b-4 md:border-b-7 border-blue-500 rounded-xl md:rounded-2xl p-3 md:p-5 flex-1 flex flex-col items-center cursor-pointer transition-all duration-300">
            <span className="text-[10px] md:text-sm text-white font-bold tracking-widest mb-1 md:mb-2 text-center">
              Joe Biden
            </span>
            <span className="text-xl md:text-3xl text-white font-bold tracking-tighter">
              46 $AUTO
            </span>
          </div>
        </div>
      </div>

      <div className="dark:bg-zinc-900 bg-zinc-50 backdrop-blur-md border border-foreground/20 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden">
        <div className="text-xl sm:text-3xl flex flex-col font-bold mb-5 whitespace-nowrap">
          <span className="truncate">Who will win this round?</span>
          <span className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400 opacity-50">
            Match #24 - Round 3
          </span>
        </div>

        <div className="flex justify-between items-end gap-2">
          <div className="bg-red-500/70 border-b-4 md:border-b-7 border-red-500 rounded-xl md:rounded-2xl p-3 md:p-5 flex-1 flex flex-col items-center cursor-pointer transition-all duration-300">
            <div className="text-[10px] md:text-sm text-white font-bold tracking-widest mb-1 md:mb-2 text-center">
              Donald Trump
            </div>
            <div className="text-xl md:text-3xl text-white font-bold tracking-tighter">
              54 $AUTO
            </div>
          </div>
          <div className="w-px h-10 md:h-16 dark:bg-white/5 bg-black/5 mx-0.5 md:mx-0"></div>
          <div className="bg-blue-500/70 border-b-4 md:border-b-7 border-blue-500 rounded-xl md:rounded-2xl p-3 md:p-5 flex-1 flex flex-col items-center cursor-pointer transition-all duration-300">
            <span className="text-[10px] md:text-sm text-white font-bold tracking-widest mb-1 md:mb-2 text-center">
              Joe Biden
            </span>
            <span className="text-xl md:text-3xl text-white font-bold tracking-tighter">
              46 $AUTO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveComments({ logs = [] }) {
  const [activeTab, setActiveTab] = useState("comments");

  const MOCK_COMMENTS = [
    {
      id: 1,
      user: "formulaleon",
      time: "2m ago",
      text: "someone please help me with just 2-3$ i always give the tips back please check my pfp",
      likes: 0,
      avatar: "bg-[#4a3424]",
    },
    {
      id: 2,
      user: "kutik",
      time: "5m ago",
      text: "Hey, hardworking guys! How are you?",
      likes: 0,
      avatar: "bg-gradient-to-br from-green-400 to-emerald-600",
    },
    {
      id: 3,
      user: "Blue31",
      time: "9m ago",
      text: "Please help just one",
      likes: 0,
      avatar: "bg-blue-900 border border-red-500",
    },
    {
      id: 4,
      user: "Pizzard",
      time: "11m ago",
      text: "Никто не играет рынком, просто трейдеры сами не знают куда и что пойдёт и прыгают из стороны в сторону, а дяди с деньгами выцепляют неуверенных людей. Но факт остаётся фактом - перекаты в другую сторону это норма, но когда идёт задержка polymarket это уже не нормально, они судят по заполнения скана да/нет куда пойдёт цена, хотя эти данные часто приходят с задержкой так как если вливают много в нет, транзакции долго обрабатываются, что мы и получаем на выхо...",
      likes: 0,
      hasReadMore: true,
      avatar: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="w-full mt-6 md:mt-10 backdrop-blur-md rounded-3xl flex flex-col relative shrink-0">
      {/* Header Tabs */}
      <div className="flex gap-4 md:gap-6 text-base md:text-xl font-semibold mb-4 md:mb-5 overflow-x-auto scrollbar-none whitespace-nowrap">
        <span
          onClick={() => setActiveTab("comments")}
          className={`cursor-pointer transition-colors ${
            activeTab === "comments"
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Comments (66,266)
        </span>
        <span
          onClick={() => setActiveTab("logs")}
          className={`cursor-pointer transition-colors ${
            activeTab === "logs"
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Logs
        </span>
      </div>

      {activeTab === "comments" ? (
        <>
          {/* Input Box */}
          <div className="relative w-full flex items-center bg-zinc-50 dark:bg-[#18181b] border border-foreground/10 rounded-xl p-1 md:p-2 mb-4 md:mb-5 transition-colors">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent px-3 text-xs md:text-sm outline-none dark:text-zinc-200 text-zinc-900 placeholder:text-zinc-500"
            />
            <div className="flex items-center gap-2 md:gap-3 pr-1 text-zinc-400">
              <Smile className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
              <button className="bg-primary hover:bg-primary/90 cursor-pointer transition-colors text-white px-3 md:px-5 py-1.5 rounded-lg text-[10px] md:text-sm font-semibold ml-1 md:ml-2">
                Post
              </button>
            </div>
          </div>

          {/* Filters & Warning */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 md:mb-6 text-sm">
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-3 py-1.5 rounded-full border dark:border-white/5 border-black/5">
              <Shield className="w-3.5 h-3.5" /> Beware of external links.
            </div>
          </div>

          {/* Comments List */}
          <div className="flex flex-col gap-4 md:gap-6 overflow-y-auto pr-2 max-h-[300px] md:max-h-[400px] scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {MOCK_COMMENTS.map((c) => (
              <div key={c.id} className="flex gap-2 md:gap-3">
                <div
                  className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex-shrink-0 shadow-sm ${c.avatar}`}
                />
                <div className="flex-1 flex flex-col group pt-0.5">
                  <div className="flex justify-between items-start md:items-center mb-0.5 md:mb-1 relative">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-200">
                        {c.user}
                      </span>
                      <span className="text-[10px] md:text-xs text-zinc-500">
                        {c.time}
                      </span>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-zinc-400 dark:text-zinc-500 md:opacity-0 md:group-hover:opacity-100 cursor-pointer transition-opacity absolute right-0" />
                  </div>
                  <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pr-4 md:pr-6">
                    {c.text}
                  </p>
                  {c.hasReadMore && (
                    <span className="text-[10px] md:text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer mt-1 transition-colors">
                      Read more
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 md:mt-2.5 text-zinc-500 hover:text-red-500 cursor-pointer transition-colors w-fit">
                    <Heart className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-[10px] md:text-xs">{c.likes}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Back to top button */}
            <div className="flex justify-center mt-2 mb-2">
              <button className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-zinc-600 dark:text-zinc-300 transition-colors">
                Back to top <ArrowUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6 overflow-y-auto max-h-[300px] md:max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {logs.length === 0 ? (
            <div className="text-zinc-500 italic p-4 text-center text-sm">
              No logs recorded yet.
            </div>
          ) : (
            [...logs].reverse().map((log, index) => (
              <div key={index} className="flex gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full flex-shrink-0 bg-primary flex items-center justify-center text-white">
                  <Image
                    src="logo/AutoBattle-logo.svg"
                    alt="Logo"
                    width={15}
                    height={15}
                    className="brightness-0 invert w-3 md:w-4"
                  />
                </div>
                <div className="flex-1 flex flex-col group pt-0.5">
                  <div className="flex justify-between items-start md:items-center mb-0.5 md:mb-1 relative">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-200">
                        System
                      </span>
                      <span className="text-[10px] md:text-xs text-zinc-500">
                        just now
                      </span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pr-4 md:pr-6">
                    {log}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function GameUI() {
  const engine = useGameEngine();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`flex h-screen overflow-hidden selection:bg-amber-500/30 transition-colors duration-500`}
    >
      <div className="flex-1 flex flex-col relative w-full h-full overflow-y-auto overflow-x-hidden">
        <main className="flex-1 p-2 sm:p-4 md:p-8 flex !pb-0 flex-col max-w-6xl w-full mx-auto relative">
          <div className="flex flex-col items-center mt-2 md:mt-4 relative z-10 shrink-0">
            <h1
              className={`text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center leading-[1.1] ${isDark ? "text-white" : "text-[#111827]"}`}
            >
              Match #24
              <br />
              <span className="text-zinc-500 font-semibold text-base sm:text-2xl md:text-4xl mt-0.5 md:mt-2 block">
                Blackjack
              </span>
            </h1>
          </div>

          <div className="flex flex-col xl:flex-row items-center xl:items-stretch justify-center gap-3 md:gap-8 w-full mt-4 md:mt-10 flex-1 isolate">
            {/* Center Card - Ordered first on Mobile, centered on Desktop */}
            <div className="flex flex-col justify-center items-center w-full max-w-[400px] xl:max-w-[340px] shrink-0 relative z-20 order-1 xl:order-2">
              <motion.div
                layout
                className={`${isDark ? "bg-zinc-900/80" : "bg-white/80"} w-full border-foreground/20 backdrop-blur-xl border p-4 md:p-8 rounded-[24px] md:rounded-[32px] flex flex-col items-center text-center relative overflow-hidden transition-colors duration-500`}
              >
                <div className="text-sm md:text-lg uppercase font-bold tracking-[0.05em] text-zinc-500 mb-1">
                  <span>ROUND {engine.round}</span>
                </div>
                <div
                  className={`text-[10px] md:text-xs font-bold tracking-tight mb-3 md:mb-6 bg-primary/10 border border-primary text-primary rounded-lg px-2 py-1`}
                >
                  {engine.phase.replace(/([A-Z])/g, " $1").trim()}
                </div>

                <div className="flex-1 mb-4 flex flex-col items-center justify-center relative w-full gap-2 md:gap-4 p-4 rounded-xl overflow-hidden mt-1 md:mt-2 dark:bg-zinc-900 bg-white border border-amber-500/50 transition-colors duration-500 h-24 md:h-32">
                  {getDamageValue(engine.round) >= 4 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent blur-xl animate-pulse pointer-events-none" />
                  )}
                  <span className="text-[8px] md:text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mb-0 md:mb-1 z-10 relative mt-1 md:mt-2">
                    Round Stakes
                  </span>
                  <div
                    className={`text-5xl md:text-7xl font-black tracking-tighter flex items-end gap-1 z-10 relative ${getDamageValue(engine.round) >= 4 ? "text-orange-600 dark:text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "text-amber-600 dark:text-amber-500"}`}
                  >
                    {getDamageValue(engine.round)}
                    <span className="text-xs md:text-lg font-bold tracking-widest opacity-50 mb-1 ml-1">
                      HP
                    </span>
                  </div>
                  {getDamageValue(engine.round) === 1 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      Let the round begin!
                    </div>
                  )}
                  {getDamageValue(engine.round) === 2 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      Getting serious...
                    </div>
                  )}
                  {getDamageValue(engine.round) >= 8 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-red-600 dark:text-red-500 bg-red-500/10 px-2 md:px-3 py-1 rounded-full border border-red-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 animate-bounce z-10 relative shadow-[0_0_10px_rgba(239,68,68,0.2)] mb-2 md:mb-0">
                      Lethal Stakes
                    </div>
                  )}
                  {getDamageValue(engine.round) === 4 && (
                    <div className="text-[8px] md:text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 md:px-3 py-1 rounded-full border border-orange-500/20 tracking-[0.2em] uppercase mt-1 md:mt-3 z-10 relative mb-2 md:mb-0">
                      High Stakes
                    </div>
                  )}
                </div>

                <motion.button
                  disabled={engine.isProcessing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={engine.crank}
                  className={`w-full py-2 bg-primary/10 border cursor-pointer border-primary text-primary rounded-lg text-sm md:text-base font-bold tracking-wide transition-all flex justify-center items-center gap-2`}
                >
                  How to Play
                  {engine.phase !== "Ended" && (
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 -mr-1" />
                  )}
                </motion.button>
              </motion.div>
            </div>

            {/* Red and Blue Agents side-by-side on mobile */}
            <div className="w-full flex flex-row justify-between xl:contents order-2 xl:order-none gap-2 sm:gap-4">
              <div className="w-[49%] xl:w-2/5 flex justify-end xl:order-1">
                <AgentSide
                  agentName="Donald Trump"
                  side="red"
                  hp={engine.redHP}
                  cards={engine.redCards}
                  score={calculateScore(engine.redCards).score}
                  align="left"
                  atRisk={
                    engine.phase === "Ended" ? 0 : getDamageValue(engine.round)
                  }
                  showRiverPlaceholder={
                    ["RedTurn", "BlueTurn", "AwaitingFinalRevealVRF"].includes(
                      engine.phase,
                    ) && engine.redCards.length > 0
                  }
                />
              </div>

              <div className="w-[49%] xl:w-2/5 flex justify-start xl:order-3">
                <AgentSide
                  agentName="Joe Biden"
                  side="blue"
                  hp={engine.blueHP}
                  cards={engine.blueCards}
                  score={calculateScore(engine.blueCards).score}
                  align="right"
                  atRisk={
                    engine.phase === "Ended" ? 0 : getDamageValue(engine.round)
                  }
                  showRiverPlaceholder={
                    ["RedTurn", "BlueTurn", "AwaitingFinalRevealVRF"].includes(
                      engine.phase,
                    ) && engine.blueCards.length > 0
                  }
                />
              </div>
            </div>
          </div>

          <PredictionMarkets />
          <LiveComments logs={engine.logs} />
        </main>
      </div>
    </div>
  );
}
