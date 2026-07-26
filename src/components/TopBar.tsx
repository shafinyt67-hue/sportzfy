import { ArrowLeft, Menu, Search, Star } from "lucide-react";
import Logo from "./Logo";

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onMenuClick: () => void;
  onSearch: () => void;
  onFavorite: () => void;
}

export default function TopBar({
  title,
  showBack,
  onBack,
  onMenuClick,
  onSearch,
  onFavorite,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 mt-2 flex h-14 items-center gap-2 border-b border-white/[.06] bg-[#0D0D0D]/90 px-4 backdrop-blur-xl">
      {showBack ? (
        <button
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
      ) : (
        <div className="shrink-0" aria-hidden>
          <Logo size={38} />
        </div>
      )}

      <h1 className="flex-1 truncate text-lg font-extrabold tracking-tight text-white">{title}</h1>

      <button
        onClick={onSearch}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5"
        aria-label="Search"
      >
        <Search size={24} />
      </button>
      <button
        onClick={onFavorite}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5"
        aria-label="Favorites"
      >
        <Star size={24} />
      </button>
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5"
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
