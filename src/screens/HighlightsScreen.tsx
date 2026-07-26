import { Plus, Shield, Trophy } from "lucide-react";
import type { Highlight } from "../types";
import EmptyState from "../components/EmptyState";

export default function HighlightsScreen({
  highlights,
  onAdd,
}: {
  highlights: Highlight[];
  onAdd: () => void;
}) {
  return (
    <div className="relative min-h-[70vh] pb-24 px-4">
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-sm font-bold text-white">Match Highlights</h2>
        <button
          onClick={onAdd}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B2432] border border-[#2A3445] text-[#00BCD4] hover:border-[#00BCD4] transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {highlights.length === 0 ? (
        <EmptyState icon={Trophy} title="No highlights yet" subtitle="Added highlight matches will be listed here." />
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {highlights.map((h) => (
            <div key={h.id} className="rounded-[20px] border border-[#2A3445] bg-[#1B2432] p-4 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 truncate text-xs font-bold text-gray-300">
                  <Trophy size={13} className="text-[#00BCD4]" /> {h.tournament}
                </p>
                <span className="shrink-0 text-[11px] font-medium text-gray-500">{h.date}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-1 items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] border border-[#2A3445]">
                    <Shield size={16} className="text-gray-500" />
                  </div>
                  <p className="truncate text-sm font-semibold text-white">{h.teamA}</p>
                </div>
                <span className="px-2 text-sm font-extrabold text-[#00BCD4]">VS</span>
                <div className="flex flex-1 items-center justify-end gap-2.5">
                  <p className="truncate text-right text-sm font-semibold text-white">{h.teamB}</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] border border-[#2A3445]">
                    <Shield size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
