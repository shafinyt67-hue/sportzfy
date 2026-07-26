import { PlayCircle, RefreshCcw, Search, Shield, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Channel, FavoriteChannel, Playlist, StreamPayload } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToast } from "../hooks/useToast";
import {
  PlaylistFormatError,
  PlaylistNetworkError,
  PlaylistValidationError,
  playlistsRepository,
} from "../app/repository/playlistsRepository";

const defaultGroups = ["Sports", "Movies", "News", "Kids", "Entertainment"];

export default function PlaylistChannelsScreen({
  playlist,
  onOpenPlayer,
}: {
  playlist: Playlist;
  onOpenPlayer: (stream: StreamPayload) => void;
}) {
  const { showToast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [retryTick, setRetryTick] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [favorites, setFavorites] = useLocalStorage<FavoriteChannel[]>("sz_favorite_channels", []);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const holdTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadChannels() {
      setLoading(true);
      setFetchError("");

      const stored = playlistsRepository.getStoredChannels(playlist.id);
      if (stored.length > 0) {
        if (!active) return;
        setChannels(
          stored.map((channel) => ({
            id: channel.id,
            name: channel.channel_name,
            url: channel.stream_url,
            logo: channel.logo_url,
            group: channel.group_name,
          }))
        );
        setLoading(false);
        return;
      }

      try {
        const parsed = await playlistsRepository.parseAndStoreChannels({
          id: playlist.id,
          playlist_name: playlist.name,
          playlist_url: playlist.url,
          approved: playlist.approved,
          created_date: playlist.createdAt,
          format: playlist.format,
        });

        if (!active) return;
        setChannels(
          parsed.map((channel) => ({
            id: channel.id,
            name: channel.channel_name,
            url: channel.stream_url,
            logo: channel.logo_url,
            group: channel.group_name,
          }))
        );
        setLoading(false);
      } catch (error) {
        if (!active) return;

        if (error instanceof PlaylistValidationError) {
          setFetchError("Invalid Playlist URL");
        } else if (error instanceof PlaylistNetworkError) {
          setFetchError(error.message);
        } else if (error instanceof PlaylistFormatError) {
          setFetchError("Unsupported Playlist Format");
        } else {
          setFetchError("Connection Failed");
        }
        setLoading(false);
      }
    }

    loadChannels();
    return () => {
      active = false;
    };
  }, [playlist, retryTick]);

  const favoriteUrlSet = useMemo(() => new Set(favorites.map((item) => item.streamUrl)), [favorites]);

  const groups = useMemo(() => {
    const fromChannels = channels
      .map((channel) => channel.group?.trim())
      .filter((group): group is string => !!group);
    return ["All", ...defaultGroups, ...Array.from(new Set(fromChannels)).filter((group) => !defaultGroups.includes(group))];
  }, [channels]);

  const filteredChannels = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return channels.filter((channel) => {
      if (favoritesOnly && !favoriteUrlSet.has(channel.url)) return false;
      const groupValue = (channel.group || "Ungrouped").trim();
      if (selectedGroup !== "All" && groupValue.toLowerCase() !== selectedGroup.toLowerCase()) return false;
      if (!lowerQuery) return true;
      return (
        channel.name.toLowerCase().includes(lowerQuery) ||
        groupValue.toLowerCase().includes(lowerQuery) ||
        playlist.name.toLowerCase().includes(lowerQuery)
      );
    });
  }, [channels, favoritesOnly, favoriteUrlSet, selectedGroup, query, playlist.name]);

  function addFavorite(channel: Channel) {
    if (favoriteUrlSet.has(channel.url)) {
      showToast("Already in favorites");
      return;
    }
    setFavorites((current) => [
      {
        id: `${playlist.id}-${channel.id}`,
        playlistId: playlist.id,
        channelName: channel.name,
        streamUrl: channel.url,
        logo: channel.logo,
        group: channel.group,
        addedAt: Date.now(),
      },
      ...current,
    ]);
    showToast("Added to favorites");
  }

  function startLongPress(channel: Channel) {
    longPressFired.current = false;
    holdTimer.current = window.setTimeout(() => {
      longPressFired.current = true;
      addFavorite(channel);
    }, 500);
  }

  function clearLongPress() {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  return (
    <div className="px-4 pb-10 pt-4">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#2A3445] bg-[#1B2432] px-3.5 py-2.5">
        <Search size={16} className="text-gray-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search playlist, group or channel"
          className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
        />
      </div>

      <div className="mb-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              selectedGroup === group ? "bg-[#00BCD4] text-[#0B1220]" : "bg-[#1B2432] text-gray-400"
            }`}
          >
            {group}
          </button>
        ))}
        <button
          onClick={() => setFavoritesOnly((value) => !value)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            favoritesOnly ? "bg-amber-500/20 text-amber-300" : "bg-[#1B2432] text-gray-400"
          }`}
        >
          Favorites
        </button>
        <button
          onClick={() => setRetryTick((value) => value + 1)}
          className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#1B2432] px-3 py-1.5 text-xs font-semibold text-[#00BCD4]"
        >
          <RefreshCcw size={12} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#2A3445] border-t-[#00BCD4]" />
          <p className="text-sm text-gray-400">Loading channels...</p>
        </div>
      )}

      {!loading && !!fetchError && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm font-semibold text-white">{fetchError}</p>
          <button
            onClick={() => setRetryTick((value) => value + 1)}
            className="flex h-11 items-center gap-1.5 rounded-xl bg-[#00BCD4] px-4 text-sm font-semibold text-[#0B1220]"
          >
            <RefreshCcw size={16} /> Retry
          </button>
        </div>
      )}

      {!loading && !fetchError && filteredChannels.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm font-semibold text-white">No Channels Available</p>
          <p className="text-xs text-gray-500">This playlist does not contain any valid stream items.</p>
        </div>
      )}

      {!loading && !fetchError && filteredChannels.length > 0 && (
        <div className="flex flex-col gap-3">
          {filteredChannels.map((channel) => (
            <button
              type="button"
              key={channel.id}
              onPointerDown={() => startLongPress(channel)}
              onPointerUp={clearLongPress}
              onPointerLeave={clearLongPress}
              onClick={() => {
                if (longPressFired.current) {
                  longPressFired.current = false;
                  return;
                }
                onOpenPlayer({
                  channelName: channel.name,
                  streamUrl: channel.url,
                  streamType: playlist.format,
                  logo: channel.logo,
                  sourceName: playlist.name,
                });
              }}
              className="flex items-center gap-3 rounded-[20px] border border-[#2A3445] bg-[#1B2432] p-3.5 text-left shadow-md"
            >
              {channel.logo ? (
                <img src={channel.logo} alt="Channel logo" className="h-11 w-11 rounded-full object-cover" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2A3445] bg-[#111827]">
                  <Shield size={18} className="text-gray-500" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{channel.name}</p>
                <p className="truncate text-[11px] text-gray-500">{channel.group || "Ungrouped"}</p>
              </div>
              {favoriteUrlSet.has(channel.url) && <Star size={15} className="text-amber-300" fill="currentColor" />}
              <PlayCircle size={18} className="shrink-0 text-[#00BCD4]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}