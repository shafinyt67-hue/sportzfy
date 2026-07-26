import { FileUp, ListPlus, Plus, Search, ShieldCheck, Tv, UserX } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Playlist } from "../types";
import EmptyState from "../components/EmptyState";
import { useToast } from "../hooks/useToast";

export default function PlaylistsScreen({
  playlists,
  onAdd,
  onOpenPlaylist,
  onImportFile,
}: {
  playlists: Playlist[];
  onAdd: () => void;
  onOpenPlaylist: (playlist: Playlist) => void;
  onImportFile: (file: File) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "az">("newest");
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPlaylists = useMemo(() => {
    const searched = playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    return [...searched].sort((a, b) => {
      if (sortBy === "az") return a.name.localeCompare(b.name);
      return b.createdAt - a.createdAt;
    });
  }, [playlists, query, sortBy]);

  return (
    <div className="relative min-h-[70vh] pb-24 px-4" onClick={() => menuOpen && setMenuOpen(false)}>
      {playlists.length === 0 ? (
        <EmptyState icon={Tv} title="No playlists added" subtitle="Add an M3U / M3U8 playlist link to get started." />
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#2A3445] bg-[#1B2432] px-3 py-2">
            <Search size={15} className="text-gray-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search playlist name"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as "newest" | "az")}
              className="rounded-lg border border-[#2A3445] bg-[#111827] px-2 py-1 text-xs text-gray-300 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="az">A-Z</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            {filteredPlaylists.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpenPlaylist(p)}
              className="flex w-full items-center gap-3 rounded-[20px] border border-[#2A3445] bg-[#1B2432] p-3.5 text-left shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] border border-[#2A3445]">
                <Tv size={20} className="text-[#00BCD4]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{p.name}</p>
                <p className="truncate text-xs text-gray-500">{p.url}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">
                <ShieldCheck size={11} /> Approved
              </span>
            </button>
            ))}
          </div>
        </div>
      )}

      {menuOpen && (
        <div
          className="animate-scalein fixed bottom-40 right-5 z-30 w-52 overflow-hidden rounded-xl border border-[#2A3445] bg-[#1B2432] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              onAdd();
            }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium text-white hover:bg-white/5"
          >
            <ListPlus size={17} className="text-[#00BCD4]" /> Add New Playlist
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              fileInputRef.current?.click();
            }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium text-white hover:bg-white/5 border-t border-[#2A3445]"
          >
            <FileUp size={17} className="text-[#00BCD4]" /> Choose Playlist File
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              showToast("Xtream Codes login is not supported");
            }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-500 hover:bg-white/5 border-t border-[#2A3445]"
          >
            <UserX size={17} /> Xtream Codes Login
          </button>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((v) => !v);
        }}
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#00BCD4] text-[#0B1220] shadow-xl shadow-cyan-950/50 hover:opacity-90 transition-opacity"
        aria-label="Add"
      >
        <Plus size={26} className={`transition-transform ${menuOpen ? "rotate-45" : ""}`} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".m3u,.m3u8"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (!file.name.toLowerCase().endsWith(".m3u") && !file.name.toLowerCase().endsWith(".m3u8")) {
            showToast("Unsupported Playlist Format");
            return;
          }
          onImportFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
