"use client";

import { Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-8 w-full shrink-0">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl flex justify-center mx-auto">
        <div className="relative flex items-center w-full max-w-md h-10 rounded-full bg-element px-4 transition-colors focus-within:bg-surface focus-within:ring-1 focus-within:ring-border">
          <Search className="w-4 h-4 text-text-muted mr-2" />
          <Input
            type="text"
            aria-label="Search by agent or game"
            placeholder="Search by agent or game"
            className="h-auto border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle className="bg-element hover:bg-element-hover" />
        <Button
          variant="secondary"
          size="icon"
          className="bg-element hover:bg-element-hover"
        >
          <Mail className="w-4 h-4 text-text-main" />
        </Button>
        <Button
          variant="secondary"
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/10" />
          </div>
          <span className="text-sm font-medium">$0.00</span>
        </Button>
      </div>
    </header>
  );
}
