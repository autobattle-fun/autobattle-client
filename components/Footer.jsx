import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface/50 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-mono font-bold text-lg tracking-tighter text-gray-400">
            AUTO<span className="text-emerald">BATTLE</span>.FUN
          </span>
        </div>

        <div className="text-gray-500 font-mono text-xs">
          © 2026 AutoBattle.fun. All systems operational.
        </div>

        <div className="flex gap-4 font-mono text-xs text-gray-400">
          <a href="#" className="hover:text-emerald transition-colors">
            TERMS
          </a>
          <a href="#" className="hover:text-emerald transition-colors">
            PRIVACY
          </a>
          <a href="#" className="hover:text-emerald transition-colors">
            DOCS
          </a>
        </div>
      </div>
    </footer>
  );
}
