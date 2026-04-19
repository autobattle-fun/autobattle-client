import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export function ProfileActions() {
  return (
    <div className="mb-3 flex w-full gap-3">
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
      <Card className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full! border border-border bg-element p-3 text-center shadow-inner transition-all duration-200 hover:scale-105">
        <ArrowUp className="w-4 h-4" />
        <div className="text-sm font-bold">Send</div>
      </Card>
    </div>
  );
}
