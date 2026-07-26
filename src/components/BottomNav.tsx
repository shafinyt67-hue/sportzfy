import { Grid2x2, Home, PlayCircle } from "lucide-react";
import type { ScreenName } from "../types";

interface Props {
  active: "home" | "categories" | "highlights";
  onChange: (tab: ScreenName) => void;
}

const items: { key: "home" | "categories" | "highlights"; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "categories", label: "Categories", icon: Grid2x2 },
  { key: "highlights", label: "Highlights", icon: PlayCircle },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="sticky bottom-0 z-30 mx-3 mb-3 flex items-stretch justify-around rounded-[24px] border border-white/10 bg-[#1A1718]/95 px-2 shadow-2xl shadow-black/50 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      {items.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`relative m-1 flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2.5 transition-all duration-300 active:scale-95 ${isActive ? "bg-[#C8102E]/15" : ""}`}
          >
            <Icon size={21} className={isActive ? "text-[#F05468]" : "text-gray-500"} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[11px] font-semibold ${isActive ? "text-[#F7A3AE]" : "text-gray-500"}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
