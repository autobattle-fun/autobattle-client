"use client";

import { Search, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-8 w-full shrink-0 relative">
      {/* Search Bar */}
      <div className="max-w-xl w-full flex justify-center mx-auto absolute left-1/2 -translate-x-1/2">
        <div className="relative flex items-center w-full border border-border shadow-inner max-w-md h-10 rounded-full bg-element px-4 transition-colors focus-within:bg-surface focus-within:ring-1 focus-within:ring-border">
          <Search className="w-4 h-4 text-text-muted mr-2" />
          <Input
            type="text"
            aria-label="Search by address or name"
            placeholder="Search by address or name"
            className="h-auto bg-transparent px-0 py-0 text-sm shadow-none border-0 focus-visible:ring-0!"
          />
        </div>
      </div>

      <div />

      <div className="flex items-center gap-3">
        <ThemeToggle className="bg-element hover:bg-element-hover border border-border shadow-inner" />
        {/* <Button
          variant="secondary"
          size="icon"
          className="bg-element hover:bg-element-hover"
        >
          <Mail className="w-4 h-4 text-text-main" />
        </Button> */}
        {/* <Button
          variant="secondary"
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/10" />
          </div>
          <span className="text-sm font-medium">$0.00</span>
        </Button> */}

        <Button className="flex items-center gap-2 font-semibold py-1 rounded-full transition-all! hover:scale-105 duration-200 cursor-pointer">
          <Plus className="w-4 h-4" />
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
