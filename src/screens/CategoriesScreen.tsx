import { ListVideo, Plus, ShieldCheck, Tv } from "lucide-react";
import type { Playlist } from "../types";
import EmptyState from "../components/EmptyState";

export default function CategoriesScreen({
  playlists,
  onAdd,
  onOpenPlaylist,
}: {
  playlists: Playlist[];
  onAdd: () => void;
  onOpenPlaylist: (playlist: Playlist) => void;
}) {
  return (
    <div className="relative min-h-[70vh] pb-24 px-4">
      {playlists.length === 0 ? (
        <EmptyState
          icon={ListVideo}
          title="No playlists yet"
          subtitle="Tap the + button to add an M3U / M3U8 playlist."
        />
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3.5">
          {playlists.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpenPlaylist(p)}
              className="flex items-center gap-3 rounded-[20px] border border-[#2A3445] bg-[#1B2432] p-3.5 shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] border border-[#2A3445]">
                <Tv size={20} className="text-[#00BCD4]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{p.name}</p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <ShieldCheck size={11} /> Approved
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onAdd}
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#00BCD4] text-[#0B1220] shadow-xl shadow-cyan-950/50 hover:opacity-90 transition-opacity"
        aria-label="Add playlist"
      >
        <Plus size={26} />
      </button>
    </div>
  );
}
