import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, WifiOff } from "lucide-react";
import { ToastProvider, useToast } from "./hooks/useToast";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type {
  BannerData,
  Category,
  Highlight,
  JoinUsData,
  Match,
  MatchStatus,
  NoticeData,
  PlaybackResume,
  Playlist,
  ScreenName,
  StreamPayload,
  UpdateConfig,
  VideoQuality,
} from "./types";

import SplashScreen from "./components/SplashScreen";
import TopBar from "./components/TopBar";
import NotificationBanner from "./components/NotificationBanner";
import BottomNav from "./components/BottomNav";
import Drawer from "./components/Drawer";
import SearchModal from "./components/SearchModal";
import {
  AddHighlightModal,
  AddMatchModal,
  AddPlaylistModal,
  AddSportModal,
} from "./components/AddModals";
import {
  CrashLogModal,
  CopyrightModal,
  EmailModal,
  ExitModal,
  GoodbyeScreen,
  JoinUsModal,
  NoticeModal,
  NoticePreview,
  UpdateAppModal,
  VideoQualityModal,
} from "./components/DrawerModals";

import HomeScreen from "./screens/HomeScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import HighlightsScreen from "./screens/HighlightsScreen";
import NetworkStreamScreen from "./screens/NetworkStreamScreen";
import PlaylistsScreen from "./screens/PlaylistsScreen";
import PlaylistChannelsScreen from "./screens/PlaylistChannelsScreen";
import PlayerScreen from "./screens/PlayerScreen";
import { loadAppBootstrapData } from "./app/services/bootstrapService";
import { linksRepository } from "./app/repository/linksRepository";
import {
  PlaylistFormatError,
  PlaylistNetworkError,
  PlaylistValidationError,
  playlistsRepository,
} from "./app/repository/playlistsRepository";
import { settingsRepository } from "./app/repository/settingsRepository";
import { isOnline } from "./app/network/connectivity";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const placeholderCategories: Category[] = [
  { id: "ph-1", name: "Category 1", emoji: "⚽" },
  { id: "ph-2", name: "Category 2", emoji: "🏏" },
  { id: "ph-3", name: "Category 3", emoji: "🏀" },
  { id: "ph-4", name: "Category 4", emoji: "🎾" },
];

function AppShell() {
  const { showToast } = useToast();
  const bootstrap = loadAppBootstrapData();

  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setSplashFade(true), 1600);
    const removeTimer = window.setTimeout(() => setShowSplash(false), 2100);
    const loadingTimer = window.setTimeout(() => setInitialLoading(false), 2450);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(loadingTimer);
    };
  }, []);

  const [screen, setScreen] = useState<ScreenName>("home");
  const [lastMainTab, setLastMainTab] = useState<"home" | "categories" | "highlights">("home");
  const [backTarget, setBackTarget] = useState<ScreenName>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [exited, setExited] = useState(false);

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [selectedStream, setSelectedStream] = useState<StreamPayload | null>(null);
  const [playbackResume, setPlaybackResume] = useLocalStorage<PlaybackResume | null>(
    "sz_playback_resume",
    null
  );

  const [banner, setBanner] = useLocalStorage<BannerData>("sz_banner", {
    website: bootstrap.links.website_link,
    telegram: bootstrap.links.telegram_link,
    approved: bootstrap.links.approved,
    visible: true,
  });
  const [categories, setCategories] = useLocalStorage<Category[]>("sz_categories", []);
  const [matches, setMatches] = useLocalStorage<Match[]>("sz_matches", []);
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>(
    "sz_playlists",
    bootstrap.playlists.map((playlist) => ({
      id: playlist.id,
      name: playlist.playlist_name,
      url: playlist.playlist_url,
      format: playlist.format,
      approved: playlist.approved,
      createdAt: playlist.created_date,
    }))
  );
  const [highlights, setHighlights] = useLocalStorage<Highlight[]>("sz_highlights", []);
  const [floatingPlayer, setFloatingPlayer] = useLocalStorage<boolean>(
    "sz_floating_player",
    bootstrap.settings.floating_player
  );
  const [crashLog, setCrashLog] = useLocalStorage<boolean>("sz_crash_log", false);
  const [videoQuality, setVideoQuality] = useLocalStorage<VideoQuality>(
    "sz_video_quality",
    bootstrap.settings.video_quality
  );
  const [joinUs, setJoinUs] = useLocalStorage<JoinUsData>("sz_join_us", {
    telegram: "",
    approved: false,
  });
  const [updateConfig, setUpdateConfig] = useLocalStorage<UpdateConfig>("sz_update_config", {
    url: "",
    approved: false,
  });
  const [notice, setNotice] = useLocalStorage<NoticeData>("sz_notice", {
    title: "",
    description: "",
  });

  useEffect(() => {
    if (categories.length === 0) {
      setCategories(placeholderCategories);
    }
  }, [categories.length, setCategories]);

  const [activeMatchTab, setActiveMatchTab] = useState<MatchStatus>("recent");

  const [showSearch, setShowSearch] = useState(false);
  const [showAddSport, setShowAddSport] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [showAddHighlight, setShowAddHighlight] = useState(false);
  const [showVideoQuality, setShowVideoQuality] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [showJoinUs, setShowJoinUs] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showUpdateApp, setShowUpdateApp] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [showCrashLogDialog, setShowCrashLogDialog] = useState(false);

  const appBarTitle = useMemo(() => {
    if (screen === "playlistChannels") return selectedPlaylist?.name ?? "Playlist Channels";
    if (screen === "player") return selectedStream?.channelName ?? "Player";
    if (screen === "home") return "Sportzfy";
    if (screen === "categories") return "Categories";
    if (screen === "highlights") return "Highlights";
    if (screen === "networkStream") return "Network Stream";
    return "Playlists/IPTV";
  }, [screen, selectedPlaylist, selectedStream]);

  function goMain(tab: "home" | "categories" | "highlights") {
    setScreen(tab);
    setLastMainTab(tab);
  }

  function openSubScreen(name: ScreenName) {
    setBackTarget(lastMainTab);
    setScreen(name);
    setDrawerOpen(false);
  }

  function openPlaylistChannels(playlist: Playlist, origin: ScreenName) {
    setSelectedPlaylist(playlist);
    settingsRepository.setLastOpenedPlaylist(playlist.id);
    setBackTarget(origin);
    setScreen("playlistChannels");
  }

  function openPlayer(stream: StreamPayload, origin: ScreenName) {
    if (!isOnline()) {
      showToast("No Internet Connection");
      return;
    }
    setSelectedStream(stream);
    setBackTarget(origin);
    setScreen("player");
  }

  async function importLocalPlaylist(file: File) {
    try {
      const rawText = await file.text();
      const playlistEntity = playlistsRepository.createApprovedFromLocalFile({
        id: uid(),
        name: file.name.replace(/\.(m3u|m3u8)$/i, "") || "Local Playlist",
        fileName: file.name,
        rawText,
        createdDate: Date.now(),
      });
      const viewPlaylist: Playlist = {
        id: playlistEntity.id,
        name: playlistEntity.playlist_name,
        url: playlistEntity.playlist_url,
        format: playlistEntity.format,
        approved: playlistEntity.approved,
        createdAt: playlistEntity.created_date,
      };
      setPlaylists((value) => [viewPlaylist, ...value]);
      showToast("Local playlist approved and imported");
    } catch (error) {
      if (error instanceof PlaylistFormatError) {
        showToast("Unsupported Playlist Format");
      } else {
        showToast("Unable to import local file");
      }
    }
  }

  function handleBack() {
    if (screen === "player" || screen === "playlistChannels" || screen === "networkStream" || screen === "playlists") {
      if (backTarget === "home" || backTarget === "categories" || backTarget === "highlights") {
        goMain(backTarget);
      } else {
        setScreen(backTarget);
      }
    }
  }

  if (exited) return <GoodbyeScreen />;

  const showBack = !["home", "categories", "highlights"].includes(screen);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col overflow-x-hidden bg-[#0D0D0D] shadow-2xl shadow-black/50">
      {showSplash && <SplashScreen fadeOut={splashFade} />}

      <TopBar
        title={appBarTitle}
        showBack={showBack}
        onBack={handleBack}
        onMenuClick={() => setDrawerOpen(true)}
        onSearch={() => setShowSearch(true)}
        onFavorite={() => showToast("No favorites added yet")}
      />

      <NotificationBanner
        banner={banner}
        onUpdate={(data) => setBanner((value) => ({ ...value, ...data }))}
        onApprove={(website, telegram) => {
          linksRepository.approve(website, telegram);
          setBanner({ website, telegram, approved: true, visible: true });
          showToast("Links approved and locked");
        }}
      />
      <NoticePreview notice={notice} />

      {!navigator.onLine && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2">
          <WifiOff size={16} className="text-red-300" />
          <p className="flex-1 text-xs font-medium text-red-200">No Internet Connection</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white"
          >
            <RefreshCcw size={11} /> Retry
          </button>
        </div>
      )}

      <main className="flex-1">
        {initialLoading ? (
          <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#C8102E]" />
            <p className="text-sm font-medium tracking-wide text-gray-400">Preparing your live experience...</p>
          </div>
        ) : (
          <>
            {screen === "home" && (
              <HomeScreen
                categories={categories}
                matches={matches}
                activeTab={activeMatchTab}
                onTabChange={setActiveMatchTab}
                onAddCategory={() => setShowAddSport(true)}
                onAddMatch={() => setShowAddMatch(true)}
                onMatchTap={(match) =>
                  openPlayer(
                    {
                      channelName: `${match.teamA} vs ${match.teamB}`,
                      streamUrl: match.streamUrl,
                      streamType: match.streamType,
                      sourceName: match.tournament,
                    },
                    "home"
                  )
                }
              />
            )}
            {screen === "categories" && (
              <CategoriesScreen
                playlists={playlists}
                onAdd={() => setShowAddPlaylist(true)}
                onOpenPlaylist={(playlist) => openPlaylistChannels(playlist, "categories")}
              />
            )}
            {screen === "highlights" && (
              <HighlightsScreen highlights={highlights} onAdd={() => setShowAddHighlight(true)} />
            )}
            {screen === "networkStream" && (
              <NetworkStreamScreen
                onPlay={(payload) => {
                  openPlayer(payload, "networkStream");
                }}
              />
            )}
            {screen === "playlists" && (
              <PlaylistsScreen
                playlists={playlists}
                onAdd={() => setShowAddPlaylist(true)}
                onOpenPlaylist={(playlist) => openPlaylistChannels(playlist, "playlists")}
                onImportFile={importLocalPlaylist}
              />
            )}
            {screen === "playlistChannels" && selectedPlaylist && (
              <PlaylistChannelsScreen
                playlist={selectedPlaylist}
                onOpenPlayer={(stream) => openPlayer(stream, "playlistChannels")}
              />
            )}
            {screen === "player" && selectedStream && (
              <PlayerScreen
                stream={selectedStream}
                initialPosition={
                  playbackResume?.streamUrl === selectedStream.streamUrl ? playbackResume.position : 0
                }
                onPositionSave={(position) =>
                  setPlaybackResume({
                    streamUrl: selectedStream.streamUrl,
                    channelName: selectedStream.channelName,
                    sourceName: selectedStream.sourceName,
                    position,
                    savedAt: Date.now(),
                  })
                }
              />
            )}
          </>
        )}
      </main>

      <BottomNav active={lastMainTab} onChange={(tab) => goMain(tab as "home" | "categories" | "highlights")} />

      {floatingPlayer && selectedStream && screen !== "player" && (
        <button
          onClick={() => openPlayer(selectedStream, screen)}
          className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#C8102E] text-white shadow-xl shadow-red-950/50 transition-transform active:scale-95"
          aria-label="Open floating player"
        >
          <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
        </button>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        crashLogEnabled={crashLog}
        floatingPlayerEnabled={floatingPlayer}
        onToggleCrashLog={() => {
          setCrashLog((value) => !value);
          showToast(!crashLog ? "Crash log dialog enabled" : "Crash log dialog disabled");
        }}
        onNetworkStream={() => openSubScreen("networkStream")}
        onPlaylists={() => openSubScreen("playlists")}
        onFloatingPlayer={() => {
          setFloatingPlayer((value) => !value);
          settingsRepository.setFloatingPlayer(!floatingPlayer);
          setDrawerOpen(false);
          showToast(!floatingPlayer ? "Floating player enabled" : "Floating player disabled");
        }}
        onVideoQuality={() => {
          setDrawerOpen(false);
          setShowVideoQuality(true);
        }}
        onCrashLogDialog={() => {
          setDrawerOpen(false);
          setShowCrashLogDialog(true);
        }}
        onNotice={() => {
          setDrawerOpen(false);
          setShowNotice(true);
        }}
        onJoinUs={() => {
          setDrawerOpen(false);
          setShowJoinUs(true);
        }}
        onCopyright={() => {
          setDrawerOpen(false);
          setShowCopyright(true);
        }}
        onShare={async () => {
          setDrawerOpen(false);
          const shareData = {
            title: "Sportzfy",
            text: "Watch live sports on Sportzfy!",
            url: window.location.href,
          };
          try {
            if (navigator.share) {
              await navigator.share(shareData);
            } else {
              await navigator.clipboard.writeText(shareData.url);
              showToast("App link copied to clipboard");
            }
          } catch {
            /* user cancelled */
          }
        }}
        onEmail={() => {
          setDrawerOpen(false);
          setShowEmail(true);
        }}
        onUpdateApp={() => {
          setDrawerOpen(false);
          setShowUpdateApp(true);
        }}
        onExit={() => {
          setDrawerOpen(false);
          setShowExit(true);
        }}
      />

      {showSearch && (
        <SearchModal
          matches={matches}
          playlists={playlists}
          highlights={highlights}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showAddSport && (
        <AddSportModal
          onClose={() => setShowAddSport(false)}
          onSave={(data) => setCategories((value) => [...value, { ...data, id: uid() }])}
        />
      )}

      {showAddMatch && (
        <AddMatchModal
          status={activeMatchTab}
          onClose={() => setShowAddMatch(false)}
          onSave={(data) => setMatches((value) => [{ ...data, id: uid() }, ...value])}
        />
      )}

      {showAddPlaylist && (
        <AddPlaylistModal
          onClose={() => setShowAddPlaylist(false)}
          onSave={(data) => {
            try {
              const playlistEntity = playlistsRepository.createApproved({
                id: uid(),
                name: data.name,
                url: data.url,
                format: data.format,
                createdDate: Date.now(),
              });
              const viewPlaylist: Playlist = {
                id: playlistEntity.id,
                name: playlistEntity.playlist_name,
                url: playlistEntity.playlist_url,
                format: playlistEntity.format,
                approved: playlistEntity.approved,
                createdAt: playlistEntity.created_date,
              };
              setPlaylists((value) => [viewPlaylist, ...value]);

              // Simulate background parsing and local channel storage after save.
              window.setTimeout(async () => {
                try {
                  await playlistsRepository.parseAndStoreChannels(playlistEntity);
                } catch {
                  /* parsing errors are surfaced when opening playlist channels */
                }
              }, 0);

              showToast("Playlist approved and saved");
            } catch (error) {
              if (error instanceof PlaylistValidationError) {
                showToast(error.message);
              } else if (error instanceof PlaylistNetworkError) {
                showToast("Connection Failed");
              } else if (error instanceof PlaylistFormatError) {
                showToast("Unsupported Playlist Format");
              } else {
                showToast("Unable to save playlist");
              }
            }
          }}
        />
      )}

      {showAddHighlight && (
        <AddHighlightModal
          onClose={() => setShowAddHighlight(false)}
          onSave={(data) => setHighlights((value) => [{ ...data, id: uid() }, ...value])}
        />
      )}

      {showVideoQuality && (
        <VideoQualityModal
          value={videoQuality}
          onClose={() => setShowVideoQuality(false)}
          onChange={(value) => {
            setVideoQuality(value);
            settingsRepository.setVideoQuality(value);
            showToast(`Video quality set to ${value}`);
          }}
        />
      )}

      {showCrashLogDialog && <CrashLogModal onClose={() => setShowCrashLogDialog(false)} />}
      {showNotice && (
        <NoticeModal
          notice={notice}
          onSave={(value) => setNotice(value)}
          onClose={() => setShowNotice(false)}
        />
      )}
      {showJoinUs && <JoinUsModal data={joinUs} onSave={setJoinUs} onClose={() => setShowJoinUs(false)} />}
      {showCopyright && <CopyrightModal onClose={() => setShowCopyright(false)} />}
      {showEmail && <EmailModal onClose={() => setShowEmail(false)} />}
      {showUpdateApp && (
        <UpdateAppModal
          config={updateConfig}
          onSave={(value) => setUpdateConfig(value)}
          onClose={() => setShowUpdateApp(false)}
        />
      )}
      {showExit && (
        <ExitModal
          onClose={() => setShowExit(false)}
          onConfirm={() => {
            setShowExit(false);
            setExited(true);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  );
}
