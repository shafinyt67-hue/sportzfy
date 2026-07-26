import { Search as SearchIcon, Shield, Tv, Trophy, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Highlight, Match, Playlist } from "../types";

interface Props {
  matches: Match[];
  playlists: Playlist[];
  highlights: Highlight[];
  onClose: () => void;
}

export default function SearchModal({ matches, playlists, highlights, onClose }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      matches: matches.filter(
        (m) => m.tournament.toLowerCase().includes(q) || m.teamA.toLowerCase().includes(q) || m.teamB.toLowerCase().includes(q)
      ),
      playlists: playlists.filter((p) => p.name.toLowerCase().includes(q)),
      highlights: highlights.filter(
        (h) => h.tournament.toLowerCase().includes(q) || h.teamA.toLowerCase().includes(q) || h.teamB.toLowerCase().includes(q)
      ),
    };
  }, [query, matches, playlists, highlights]);

  const totalResults = results ? results.matches.length + results.playlists.length + results.highlights.length : 0;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#111827]">
      <div className="flex items-center gap-2 border-b border-[#2A3445] px-4 py-3">
        <SearchIcon size={20} className="text-gray-500" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search matches, playlists, highlights…"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
        />
        <button onClick={onClose} className="h-9 w-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-white/5 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!results && <p className="pt-10 text-center text-sm text-gray-500">Start typing to search across the app.</p>}
        {results && totalResults === 0 && (
          <p className="pt-10 text-center text-sm text-gray-500">No results found for "{query}".</p>
        )}

        {results && results.matches.length > 0 && (
          <div className="mb-5">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Matches</h3>
            <div className="flex flex-col gap-2">
              {results.matches.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-[#2A3445] bg-[#1B2432] p-3">
                  <Shield size={16} className="text-[#00BCD4]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {m.teamA} vs {m.teamB}
                    </p>
                    <p className="truncate text-xs text-gray-500">{m.tournament}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results && results.playlists.length > 0 && (
          <div className="mb-5">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Playlists</h3>
            <div className="flex flex-col gap-2">
              {results.playlists.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-[#2A3445] bg-[#1B2432] p-3">
                  <Tv size={16} className="text-[#00BCD4]" />
                  <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {results && results.highlights.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Highlights</h3>
            <div className="flex flex-col gap-2">
              {results.highlights.map((h) => (
                <div key={h.id} className="flex items-center gap-3 rounded-xl border border-[#2A3445] bg-[#1B2432] p-3">
                  <Trophy size={16} className="text-[#00BCD4]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {h.teamA} vs {h.teamB}
                    </p>
                    <p className="truncate text-xs text-gray-500">{h.tournament}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
