import {
  Bell,
  Bug,
  Copyright,
  Link2,
  ListVideo,
  Mail,
  MessageSquare,
  MonitorPlay,
  RefreshCw,
  Settings,
  Share2,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  crashLogEnabled: boolean;
  onToggleCrashLog: () => void;
  floatingPlayerEnabled: boolean;
  onNetworkStream: () => void;
  onPlaylists: () => void;
  onFloatingPlayer: () => void;
  onVideoQuality: () => void;
  onCrashLogDialog: () => void;
  onNotice: () => void;
  onJoinUs: () => void;
  onCopyright: () => void;
  onShare: () => void;
  onEmail: () => void;
  onUpdateApp: () => void;
  onExit: () => void;
}

export default function Drawer(props: DrawerProps) {
  const {
    open,
    onClose,
    crashLogEnabled,
    onToggleCrashLog,
    floatingPlayerEnabled,
    onNetworkStream,
    onPlaylists,
    onFloatingPlayer,
    onVideoQuality,
    onCrashLogDialog,
    onNotice,
    onJoinUs,
    onCopyright,
    onShare,
    onEmail,
    onUpdateApp,
    onExit,
  } = props;

  const items: { icon: typeof Link2; label: string; onClick: () => void }[] = [
    { icon: Link2, label: "Network Stream", onClick: onNetworkStream },
    { icon: ListVideo, label: "Playlists", onClick: onPlaylists },
  ];

  const items2: { icon: typeof Bell; label: string; onClick: () => void }[] = [
    { icon: Bell, label: "Notice", onClick: onNotice },
    { icon: MessageSquare, label: "Join Us", onClick: onJoinUs },
  ];

  const items3: { icon: typeof Copyright; label: string; onClick: () => void }[] = [
    { icon: Copyright, label: "Copyright", onClick: onCopyright },
    { icon: Share2, label: "Share Our App", onClick: onShare },
    { icon: Mail, label: "Email", onClick: onEmail },
    { icon: RefreshCw, label: "Update App", onClick: onUpdateApp },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-[65] h-full w-full max-w-[328px] border-r border-white/10 bg-[#121011] flex flex-col shadow-2xl shadow-black/60 ${
          open ? "animate-drawerin" : "-translate-x-full"
        } transition-transform duration-200`}
      >
        <div className="flex h-[188px] items-center gap-3 border-b border-white/10 bg-[radial-gradient(circle_at_90%_10%,rgba(200,16,46,.5),transparent_50%),linear-gradient(135deg,#291014,#121011)] px-5">
          <Logo size={56} />
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold text-white">
              Sport<span className="text-[#F05468]">zfy</span>
            </h2>
            <p className="text-sm font-medium text-gray-300">Live Sports Streaming</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-0">
          <DrawerSection items={items} onNavigate={onClose} />

          <button
            onClick={onFloatingPlayer}
            className="flex w-full items-center gap-4 border-b border-[#2A3445] px-4 py-4 text-left text-[16px] text-white transition-colors hover:bg-white/5 active:bg-white/10"
          >
            <MonitorPlay size={24} className="shrink-0 text-gray-300" />
            <span className="flex-1 font-medium">Floating Player</span>
            <span
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                floatingPlayerEnabled ? "bg-[#C8102E]" : "bg-[#30282A]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  floatingPlayerEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>

          <button
            onClick={onVideoQuality}
            className="flex w-full items-center gap-4 border-b border-[#2A3445] px-4 py-4 text-left text-[16px] text-white transition-colors hover:bg-white/5 active:bg-white/10"
          >
            <Settings size={24} className="shrink-0 text-gray-300" />
            <span className="font-medium">Video Quality Setting</span>
          </button>

          <button
            onClick={onCrashLogDialog}
            className="flex w-full items-center gap-4 border-b border-[#2A3445] px-4 py-4 text-left text-[16px] text-white transition-colors hover:bg-white/5 active:bg-white/10"
          >
            <Bug size={24} className="shrink-0 text-gray-300" />
            <span className="font-medium">Crash Log Dialog</span>
          </button>

          <button
            onClick={onToggleCrashLog}
            className="flex w-full items-center gap-4 border-b border-[#2A3445] px-4 py-4 text-left text-[16px] text-white transition-colors hover:bg-white/5 active:bg-white/10"
          >
            <Bug size={24} className="shrink-0 text-gray-300" />
            <span className="flex-1 font-medium">Crash Log</span>
            <span
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                crashLogEnabled ? "bg-[#C8102E]" : "bg-[#30282A]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  crashLogEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>

          <DrawerSection
            items={items2}
            onNavigate={(fn) => {
              fn();
            }}
          />
          <DrawerSection
            items={items3}
            onNavigate={(fn) => {
              fn();
            }}
          />
        </div>

        <div className="border-t border-[#2A3445] p-3">
          <button
            onClick={onExit}
            className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left hover:bg-white/5 transition-colors"
          >
            <LogOut size={22} className="text-red-400 shrink-0" />
            <span className="text-[15px] font-semibold text-red-400">Exit</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function DrawerSection<T extends { icon: any; label: string; onClick: () => void }>({
  items,
  onNavigate,
}: {
  items: T[];
  onNavigate: (onClick: () => void) => void;
}) {
  return (
    <div>
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => onNavigate(item.onClick)}
          className="flex w-full items-center gap-4 border-b border-[#2A3445] px-4 py-4 text-left text-[16px] text-white transition-colors hover:bg-white/5 active:bg-white/10"
        >
          <item.icon size={24} className="text-gray-300 shrink-0" />
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
