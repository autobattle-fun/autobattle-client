import { ArrowUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProfileActions() {
  return (
    <div className="flex gap-3">
      <Button className="h-14 flex-1 items-center gap-2 rounded-2xl font-semibold">
        <ArrowUp className="h-4 w-4" />
        Get $AUTO
      </Button>
      <Card className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-border bg-element p-3 text-center shadow-inner transition-transform duration-200 hover:-translate-y-0.5">
        <Send className="h-4 w-4" />
        <div className="text-sm font-bold">Send</div>
      </Card>
    </div>
  );
}
