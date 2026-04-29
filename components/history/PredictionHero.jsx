"use client";

import Image from "next/image";
import { ArrowLeft, Calendar, Wallet, Trophy, Target } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Avatar from "boring-avatars";

export function PredictionHero({ prediction }) {
  const market = prediction?.market;
  const match = market?.match;
  const user = prediction?.user;

  return (
    <div className="relative mb-6 w-full rounded-4xl border border-border/50 bg-primary p-8 md:p-10 shadow-2xl shadow-primary/20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div className="flex items-start justify-between">
          <Link 
            href="/profile" 
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white text-sm font-bold backdrop-blur-md border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          
          <div className="flex flex-col items-end">
            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white border-2 border-white/20 ${
              prediction.side === 'GREEN' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {prediction.side} SIDE
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
            <Trophy className="w-4 h-4" />
            Market Prediction
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {market?.title || "Match Prediction"}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-white/80 font-medium bg-white/5 px-3 py-1 rounded-lg">
              <Calendar className="w-4 h-4" />
              {prediction.createdAt ? format(new Date(prediction.createdAt), "PPP") : "Unknown Date"}
            </div>
            <div className="flex items-center gap-2 text-white/80 font-medium bg-white/5 px-3 py-1 rounded-lg">
              <Wallet className="w-4 h-4" />
              {prediction.amount} $AUTO
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <Avatar name={user?.username || "user"} size={40} variant="beam" />
            <div className="flex flex-col">
              <p className="text-xs font-bold text-white/50 uppercase">Predicted By</p>
              <p className="text-base font-bold text-white">
                @{user?.username || "anonymous"}
              </p>
            </div>
          </div>

          <div className="hidden sm:block">
            <Image
              src="/logo/Autobattle-logo.svg"
              width={40}
              height={40}
              alt="Autobattle.fun"
              className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
