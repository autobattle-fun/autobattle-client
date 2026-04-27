import { cn } from "@/lib/utils";

export default function BuyButton({ candidate, price, color }) {
  return (
    <div
      className={cn(
        "flex-1 rounded-xl md:rounded-2xl pb-[4px] md:pb-[7px] cursor-pointer group",
        `bg-${color}-500`,
      )}
    >
      <div
        className={cn(
          "h-full  rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col items-center transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-[4px] md:group-active:translate-y-[7px]",
          `bg-${color}-400`,
        )}
      >
        <div className="text-[10px] md:text-sm text-white font-bold tracking-widest mb-1 md:mb-2 text-center">
          {candidate}
        </div>
        <div className="text-xl md:text-3xl text-white font-bold tracking-tighter">
          {price}
        </div>
      </div>
    </div>
  );
}
