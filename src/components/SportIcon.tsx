import type { Category } from "../types";

export default function SportIcon({ category }: { category: Category }) {
  return (
    <div className="flex w-[72px] shrink-0 flex-col items-center gap-1.5">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#2A3445] bg-[#1B2432] text-2xl shadow-md">
        <span>{category.emoji}</span>
      </div>
      <p className="w-full truncate text-center text-[11px] font-medium text-gray-300">{category.name}</p>
    </div>
  );
}
