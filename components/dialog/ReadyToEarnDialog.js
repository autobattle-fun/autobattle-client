import { Copy, Plus } from "lucide-react";
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
import Image from "next/image";
import { ReactQRCode } from "@lglab/react-qr-code";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function ReadyToEarnDialog({ autoBalance }) {
  const user = useUserStore((state) => state.user);
  const { resolvedTheme } = useTheme();
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
          <div className="flex flex-col items-center justify-center p-6 bg-element border border-text-muted/30 rounded-2xl">
            <div className="text-xl font-semibold">Deposit $AUTO</div>
            <ReactQRCode
              value={user?.walletAddress}
              finderPatternInnerSettings={{
                style: "rounded",
              }}
              finderPatternOuterSettings={{
                style: "rounded-lg",
              }}
              dataModulesSettings={{
                style: "rounded",
              }}
              imageSettings={{
                src: "/logo/Autobattle-logo.svg",
                height: 30,
                width: 27,
                excavate: true,
              }}
              size={200}
              gradient={{
                type: "linear",
                stops: [
                  {
                    offset: 0,
                    color: resolvedTheme === "light" ? "#000000" : "#FFFFFF",
                  },
                  {
                    offset: 1,
                    color: resolvedTheme === "light" ? "#000000" : "#FFFFFF",
                  },
                ],
              }}
            />

            <div className="flex justify-between items-center w-full mt-2">
              <div>
                <div className="text-foreground/50 text-sm font-semibold text-left w-full">
                  Deposit Address
                </div>
                <div className="text-lg font-semibold text-left w-full">
                  {user?.walletAddress?.slice(0, 10)}...
                  {user?.walletAddress?.slice(-4)}
                </div>
              </div>

              <div
                className="bg-primary/10 rounded-lg p-3 text-foreground cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(user?.walletAddress);
                  toast.success("Address copied to clipboard");
                }}
              >
                <Copy className="w-4 h-4 opacity-90" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-element border border-text-muted/30 rounded-2xl">
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
        <DialogFooter variant="bare" className="gap-4 sm:space-x-0">
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
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
