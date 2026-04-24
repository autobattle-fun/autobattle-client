import { GameArena } from "../../GameArena";

export function MainGameSection({ onGameEvent, getAgentAction }) {
  return (
    <div className="h-155 overflow-hidden">
      <GameArena onGameEvent={onGameEvent} getAgentAction={getAgentAction} />
    </div>
  );
}
