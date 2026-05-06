"use client";

import {
  Trophy,
  Shuffle,
  Sparkles,
  ArrowLeft,
  ShieldHalf,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  Dialog,
  DialogPopup,
  DialogTitle,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

export default function HowToPlayModal({ render }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      title: "Core Setup",
      intro: "Match basics and win condition.",
      bullets: [
        "1v1 — Red Agent vs Blue Agent; both start at 10 HP.",
        "Objective: be closer to 21 than your opponent.",
        "Aces count as 11 or 1 and auto-adjust to avoid busting.",
      ],
      icon: ShieldHalf,
    },
    {
      title: "Deal & Turns",
      intro: "How cards are dealt and turn order.",
      bullets: [
        "Initial deal: one card each (face-up).",
        "Red acts first; choose Hit or Stay on your turn.",
        "If a Hit reaches 21, that agent is forced to stay.",
      ],
      icon: Shuffle,
    },
    {
      title: "Reveal & Damage",
      intro: "Resolution and how damage scales.",
      bullets: [
        "Both players reveal final hands together.",
        "Closer hand to 21 deals damage to opponent.",
        "Damage doubles each round: 1, 2, 4, 8, ...",
      ],
      icon: Sparkles,
    },
    {
      title: "Finish & Markets",
      intro: "Match end and prediction outcomes.",
      bullets: [
        "A player hitting 0 HP loses immediately.",
        "Prediction markets resolve and payouts unlock after match.",
        "Matches repeat until a winner emerges.",
      ],
      icon: Trophy,
    },
  ];

  const isLast = stepIndex === steps.length - 1;

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) setStepIndex(0);
  };

  const handleNext = () => {
    if (isLast) {
      setStepIndex(0);
      return setIsOpen(false);
    }

    setStepIndex((v) => Math.min(v + 1, steps.length - 1));
  };

  const current = steps[stepIndex];
  const StepIcon = current.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          render ? (
            render
          ) : (
            <button className="w-full py-2 bg-primary/10 border cursor-pointer border-primary text-primary rounded-lg text-sm md:text-base font-bold tracking-wide transition-all flex justify-center items-center gap-2">
              How to Play
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 -mr-1" />
            </button>
          )
        }
      />

      <DialogPopup
        className="bg-background rounded-4xl! p-3! border-text-muted/30 border max-w-md w-full"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-4xl font-semibold">
            {current.title}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground -mt-1 mb-2 font-semibold opacity-50">
            {current.intro}
          </DialogDescription>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={
                    i === stepIndex
                      ? "w-8 h-2 rounded-full bg-primary"
                      : "w-2.5 h-2 rounded-full bg-foreground/20"
                  }
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <DialogPanel className="pt-0!">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="relative rounded-[20px] bg-background"
            >
              <div className="mt-4 grid gap-3">
                {current.bullets.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-element border border-text-muted/20 rounded-2xl p-3 text-sm text-foreground/80"
                  >
                    <div className="w-2.5 h-2.5 rounded-full mt-1 bg-primary/80" />
                    <div className="leading-5">{b}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogPanel>

        <DialogFooter variant="bare" className="gap-4 sm:space-x-0 p-6!">
          <div className="w-full">
            <div className="flex w-full items-center justify-between gap-3">
              <button
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((v) => Math.max(v - 1, 0))}
                className="flex-1 rounded-xl md:rounded-2xl pb-1 group cursor-pointer bg-foreground/30"
              >
                <div
                  className={cn(
                    "h-full rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 border border-foreground/30 ease-out bg-background",
                    "group-hover:-translate-y-1 group-active:translate-y-1 md:group-active:translate-y-[7px]",
                  )}
                >
                  <div className="text-xl text-foreground font-bold tracking-tighter flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </div>
                </div>
              </button>

              <button
                onClick={handleNext}
                className="flex-1 rounded-xl md:rounded-2xl pb-1 group bg-primary/70 cursor-pointer"
              >
                <div
                  className={cn(
                    "h-full rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 ease-out bg-primary",

                    "group-hover:-translate-y-1 group-active:translate-y-1 md:group-active:translate-y-[7px]",
                  )}
                >
                  <div className="text-xl text-white font-bold tracking-tighter flex items-center gap-2">
                    {isLast ? (
                      "Start playing"
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 inline-block ml-2" />
                      </>
                    )}
                  </div>
                </div>
              </button>
            </div>

            <div className="text-xs mt-2">
              Play against the AI?{" "}
              <Link href="/play" className="text-primary hover:underline">
                Try Now
              </Link>
            </div>
          </div>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
