import { Card } from "@/components/ui/card";
import { Coins, HandCoins, ShieldCheck, ShieldAlert } from "lucide-react";

export function PredictionStats({ prediction }) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full mb-8">
      <Card className="flex flex-col gap-2 rounded-3xl border border-border/50 bg-element p-5 shadow-none">
        <div className="flex items-center gap-2 text-text-muted">
          <Coins className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Invested</span>
        </div>
        <p className="text-2xl font-black text-primary">{prediction.amount} $AUTO</p>
      </Card>

      <Card className="flex flex-col gap-2 rounded-3xl border border-border/50 bg-element p-5 shadow-none">
        <div className="flex items-center gap-2 text-text-muted">
          <HandCoins className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Share Amount</span>
        </div>
        <p className="text-2xl font-black text-primary">{prediction.shareAmount || 0}</p>
      </Card>

      <Card className={`col-span-2 flex items-center justify-between rounded-3xl border border-border/50 p-5 shadow-none ${
        prediction.hasClaimed ? 'bg-green-500/5' : 'bg-orange-500/5'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            prediction.hasClaimed ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
          }`}>
            {prediction.hasClaimed ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-sm font-bold">{prediction.hasClaimed ? 'Reward Claimed' : 'Not Claimed'}</p>
            <p className="text-xs text-text-muted">
              {prediction.hasClaimed ? 'This prediction has been settled and claimed.' : 'Awaiting settlement or claim.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
