import { Calendar, Clock, Shield, Timer } from "lucide-react";
import type { Match } from "../types";

export default function MatchCard({ match, onClick }: { match: Match; onClick: () => void }) {
  const statusLabel =
    match.status === "live" ? "Live" : match.status === "upcoming" ? "Upcoming" : "Finished";

  return (
    <button
      type="button"
      onClick={onClick}
      className="premium-surface w-full rounded-[22px] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 active:scale-[.985]"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-bold text-white">{match.tournament}</p>
        {match.status === "live" ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[10px] font-bold text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-gray-400">
            <Calendar size={12} /> {match.date}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] border border-[#2A3445]">
            <Shield size={20} className="text-gray-500" />
          </div>
          <p className="truncate max-w-[90px] text-center text-xs font-semibold text-gray-200">
            {match.teamA}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 px-2">
          <span className="text-sm font-extrabold text-[#F05468]">VS</span>
          {match.status === "upcoming" && match.countdown && (
            <span className="flex items-center gap-1 rounded-full bg-[#111827] px-2 py-0.5 text-[10px] font-semibold text-gray-400">
              <Timer size={10} /> {match.countdown}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] border border-[#2A3445]">
            <Shield size={20} className="text-gray-500" />
          </div>
          <p className="truncate max-w-[90px] text-center text-xs font-semibold text-gray-200">
            {match.teamB}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#2A3445] pt-2.5 text-xs font-medium text-gray-400">
        <span className="flex items-center gap-1.5">
          <Clock size={12} /> {match.time}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            match.status === "live"
              ? "bg-red-500/15 text-red-400"
              : match.status === "upcoming"
                ? "bg-amber-500/15 text-amber-400"
                : "bg-slate-500/15 text-slate-300"
          }`}
        >
          {statusLabel}
        </span>
      </div>
    </button>
  );
}
