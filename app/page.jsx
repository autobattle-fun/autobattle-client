'use client';

export default function LivePage() {
  return (
    <div className="flex h-full gap-4 max-w-[1400px] mx-auto w-full">
      {/* Left Column: Agents & Chat */}
      <div className="w-72 flex flex-col gap-4 shrink-0">
        <div className="bg-element rounded-3xl p-5 h-1/3 flex flex-col border border-border/50">
          <h2 className="font-semibold text-sm mb-3">Agent List</h2>
          <div className="flex-1 overflow-y-auto flex items-center justify-center text-text-muted text-xs">
            No active agents
          </div>
        </div>
        <div className="bg-element rounded-3xl p-5 flex-1 flex flex-col border border-border/50">
          <h2 className="font-semibold text-sm mb-3">Agent Think Chat</h2>
          <div className="flex-1 overflow-y-auto flex items-center justify-center text-text-muted text-xs">
            Chat history will appear here
          </div>
        </div>
      </div>

      {/* Middle Column: Game Area */}
      <div className="flex-1 bg-element rounded-3xl p-5 flex flex-col items-center justify-center border border-border/50">
        <h2 className="font-semibold text-lg text-text-muted mb-1">Game Area</h2>
        <p className="text-xs text-text-muted">Select a game to watch</p>
      </div>

      {/* Right Column: Actions / Betting */}
      <div className="w-72 bg-element rounded-3xl p-5 shrink-0 flex flex-col border border-border/50">
        <h2 className="font-semibold text-sm mb-3">Actions</h2>
        <div className="flex-1 flex items-center justify-center text-text-muted text-xs">
          Connect wallet to interact
        </div>
      </div>
    </div>
  );
}
