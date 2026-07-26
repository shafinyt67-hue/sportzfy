import { Plus, Radio, Clock3, History } from "lucide-react";
import type { Category, Match, MatchStatus } from "../types";
import SportIcon from "../components/SportIcon";
import MatchCard from "../components/MatchCard";
import EmptyState from "../components/EmptyState";

interface Props {
  categories: Category[];
  matches: Match[];
  activeTab: MatchStatus;
  onTabChange: (tab: MatchStatus) => void;
  onAddCategory: () => void;
  onAddMatch: () => void;
  onMatchTap: (match: Match) => void;
}

const tabs: { key: MatchStatus; label: string }[] = [
  { key: "recent", label: "Recent" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
];

export default function HomeScreen({
  categories,
  matches,
  activeTab,
  onTabChange,
  onAddCategory,
  onAddMatch,
  onMatchTap,
}: Props) {
  const filtered = matches.filter((m) => m.status === activeTab);

  const emptyIcon = activeTab === "live" ? Radio : activeTab === "upcoming" ? Clock3 : History;

  return (
    <div className="animate-risein pb-8">
      {/* Sports categories */}
      <div className="relative mt-5 overflow-hidden px-4">
        <div className="flex items-center justify-between">
          <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#F05468]">Explore live</p><h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-white">Sports</h2></div>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {categories.map((c) => (
            <SportIcon key={c.id} category={c} />
          ))}
          <button onClick={onAddCategory} className="flex w-[72px] shrink-0 flex-col items-center gap-1.5">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-dashed border-white/15 text-gray-500 transition-colors hover:border-[#F05468] hover:text-[#F05468]">
              <Plus size={22} />
            </div>
            <p className="text-[11px] font-medium text-gray-500">Add</p>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[65px] z-20 mt-5 flex items-center gap-1 border-y border-white/[.06] bg-[#0D0D0D]/90 px-4 py-2.5 backdrop-blur-xl">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`rounded-full px-4 py-2 text-xs transition-colors ${
              activeTab === t.key
                ? "bg-[#C8102E]/15 font-bold text-[#F7A3AE]"
                : "font-medium text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={onAddMatch}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-red-300/20 bg-[#C8102E] text-white shadow-lg shadow-red-950/40 transition-transform active:scale-95"
          aria-label="Add match"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Match list */}
      <div className="mt-4 px-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title={`No ${activeTab} matches`}
            subtitle="Matches added by the admin will appear here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((m) => (
              <MatchCard key={m.id} match={m} onClick={() => onMatchTap(m)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
