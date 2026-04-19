import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogPanel,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function ReadyToEarnDialog({ solBalance, autoBalance }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            size="icon"
            aria-label="Buy $AUTO"
            className="cursor-pointer"
          />
        }
      >
        <Plus className="w-4 h-4" />
      </DialogTrigger>

      <DialogPopup
        className="bg-background rounded-4xl! p-3! border-text-muted/30 border"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-4xl font-semibold">
            Ready to Earn
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground -mt-1 mb-2 font-semibold opacity-50">
            Refill your wallet to enable your trade and start earning
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-4 py-4 mb-3">
          {/* Solana Balance Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-element border border-text-muted/30">
            {/* Icon Placeholder */}

            <Image
              src="/logo/Sol-logo.svg"
              width={32}
              height={32}
              alt="Solana"
              className="ml-1.5"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-2xl leading-tight">
                {solBalance || 0} SOL
              </span>
              <span className="text-sm text-muted-foreground font-semibold opacity-50">
                You need SOL to pay for gas
              </span>
            </div>
          </div>

          {/* $AUTO Balance Card */}
          <div className="flex items-center gap-4 p-4 bg-element border border-text-muted/30 rounded-2xl">
            {/* Icon Placeholder */}
            <Image
              src="/logo/Autobattle-logo.svg"
              width={32}
              height={32}
              alt="Autobattle.fun"
              className="ml-1.5"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-2xl leading-tight">
                {autoBalance || 0} $AUTO
              </span>
              <span className="text-sm text-muted-foreground font-semibold opacity-50">
                You need $AUTO to execute trades
              </span>
            </div>
          </div>
        </DialogPanel>

        {/* Using variant="bare" as per your docs if you don't want 
          the default footer background/borders. 
          A grid is used to place the buttons side-by-side.
        */}
        <DialogFooter
          variant="bare"
          className="grid grid-cols-2 gap-4 sm:space-x-0"
        >
          <Button className="h-14 flex-1 items-center gap-2 rounded-full! font-semibold py-1 transition-all duration-200 hover:scale-105 cursor-pointer">
            <Image
              src="/logo/Autobattle-logo.svg"
              width={15}
              height={15}
              alt="Autobattle.fun"
              className="brightness-0 invert"
            />
            Get $AUTO
          </Button>
          <Card className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full! border border-text-muted bg-element p-3 text-center shadow-inner transition-all duration-200 hover:scale-105">
            <Image
              src="/logo/Sol-logo.svg"
              width={15}
              height={15}
              alt="Solana"
              style={{
                filter: isDark ? "brightness(0) invert(1)" : "brightness(0)",
              }}
            />
            <div className="text-sm font-bold">Get SOL</div>
          </Card>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
