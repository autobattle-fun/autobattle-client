"use client";

import { CheckCircle2, Copy, Link2, Globe, ArrowUp, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="max-w-xl mx-auto h-full flex flex-col items-center pt-8 pb-12">
      <div className="w-full h-72 bg-primary rounded-4xl border border-border/50 shadow-none mb-3 flex flex-col justify-between p-10">
      <div className="flex flex-col gap-1">
        <p className="text-white opacity-50 font-semibold text-xl">Balance</p>
        <p className="text-white font-semibold text-4xl">0 $AUTO</p>
        <div className="flex items-center gap-2">
          <p className="text-white opacity-50 font-semibold text-base">0x1234...5678</p>
          <Copy className="w-4 h-4 text-white opacity-50" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white overflow-hidden" /> 
          <p className="text-white opacity-50 font-semibold text-base">autobattle.fun/$username</p>
        </div>

        <Image
              src="/logo/Autobattle-logo.svg"
              width={30}
              height={30}
              alt="Autobattle.fun"
              className="brightness-0 invert"
              loading='eager'
             />
      </div>
      </div>

      <div className="flex gap-3 w-full mb-3">
        
        <Button
          className="flex-1 h-14 items-center gap-2 font-semibold py-1 !rounded-2xl transition-all! hover:scale-105 duration-200 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
          Get $AUTO
        </Button>

         <Card className="flex-1 bg-element gap-2 flex items-center justify-center rounded-2xl p-3 text-center border border-border shadow-inner cursor-pointer hover:scale-105 duration-200">
          <Send className="w-4 h-4" />
          <div className="text-sm font-bold">Send</div>
        </Card>
          
      </div>

      {/* Stats Row 1 */}
      <div className="flex gap-3 w-full mb-3">
        <Card className="flex-1 bg-element rounded-2xl p-3 text-center border border-border shadow-inner">
          <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5 tracking-wider">
            Win Rate
          </div>
          <div className="text-sm font-bold">64.2%</div>
        </Card>
        <Card className="flex-1 bg-element rounded-2xl p-3 text-center border border-border shadow-inner">
          <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5 tracking-wider">
            Predictions
          </div>
          <div className="text-sm font-bold">342</div>
        </Card>
        <Card className="flex-1 bg-element rounded-2xl p-3 text-center border border-border shadow-inner">
          <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5 tracking-wider">
            Earnings
          </div>
          <div className="text-sm font-bold">$1,204.50</div>
        </Card>
      </div>

      {/* History Section */}
      <div className="w-full">
        <div className="text-[10px] text-text-muted uppercase font-bold mb-2 tracking-wider">
          Recent History
        </div>

        <div className="flex flex-col gap-2 w-full">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="w-full bg-element rounded-2xl p-4 flex items-center justify-between border border-border/50 shadow-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center" >
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  Will Green Agent win the match?
                </span>
                <span className="text-xs text-text-muted">Match 123456789 • 0.001 $AUTO</span>
                </div>
              </div>
              <div className="flex gap-1 items-center border border-green-500 rounded-lg px-2 py-1">
                <Check className="w-4 h-4 text-green-500" />
                <p className="text-sm font-bold text-green-500">Yes</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
