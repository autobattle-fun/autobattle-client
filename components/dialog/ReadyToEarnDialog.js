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
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import Link from "next/link";

export default function ReadyToEarnDialog({
  solBalance,
  autoBalance,
  renderElement,
}) {
  const user = useUserStore((state) => state.user);
  const { resolvedTheme } = useTheme();
  return (
    <Dialog>
      <DialogTrigger
        render={
          renderElement ? (
            renderElement
          ) : (
            <Button
              type="button"
              size="icon"
              aria-label="Buy $AUTO"
              className="cursor-pointer h-8 w-8 md:h-9 md:w-9 relative"
            >
              {(solBalance === 0 || autoBalance === 0) && (
                <div className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping bg-primary" />
              )}
              <Plus className="w-4 h-4 relative" />
            </Button>
          )
        }
      ></DialogTrigger>

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
          <div className="flex flex-col items-center justify-center p-6 pt-4 bg-element border border-text-muted/30 rounded-2xl">
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
                src: "/logo/Autobattle-icon.svg",
                height: 35,
                width: 35,
                excavate: true,
              }}
              size={175}
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
                {autoBalance ? formatNumber(autoBalance, 4) : 0} $AUTO
              </span>
              <span className="text-sm text-muted-foreground font-semibold opacity-50">
                You need $AUTO to execute trades
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-element border border-text-muted/30 rounded-2xl">
            <Image
              src="/logo/Sol-logo.svg"
              width={32}
              height={32}
              alt="solana"
              className="ml-1.5"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-2xl leading-tight">
                {solBalance ? formatNumber(solBalance, 4) : 0} SOL
              </span>
              <span className="text-sm text-muted-foreground font-semibold opacity-50">
                You need SOL to pay for execution fees
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
          className="gap-4 sm:space-x-0 -mt-3 flex flex-col!"
        >
          <Link
            href="https://pump.fun/coin/AHuCNBJziaMf7LtjvGwDCE7D2XWWSA7K5egxwNGZpump"
            target="_blank"
            className={cn(
              "flex-1 rounded-xl md:rounded-2xl pb-[4px] group bg-primary/70 cursor-pointer",
            )}
          >
            <div
              className={cn(
                "h-full rounded-xl md:rounded-2xl p-4 flex flex-col items-center transition-transform duration-150 ease-out bg-primary",

                "group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]",
              )}
            >
              <div className="text-2xl text-white font-bold tracking-tighter flex items-center gap-2">
                <Image
                  src="/logo/Autobattle-logo.svg"
                  width={20}
                  height={20}
                  alt="Autobattle.fun"
                  className="brightness-0 invert"
                />
                Get $AUTO
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1 justify-center font-semibold text-xs opacity-50 -mb-5 -mt-1">
            <p>Powered by</p>
            <Image
              src="/footer/pump.svg"
              width={15}
              height={15}
              alt="pump.fun"
              className=""
            />
            <p>pump.fun</p>
          </div>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
