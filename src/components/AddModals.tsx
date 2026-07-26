import { useState } from "react";
import Modal from "./Modal";
import type { Category, Highlight, Match, MatchStatus, Playlist, StreamType } from "../types";
import { Lock } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[#2A3445] bg-[#111827] px-3.5 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#00BCD4] transition-colors";
const labelClass = "mb-1.5 block text-xs font-semibold text-gray-400";
const primaryBtn =
  "flex h-12 w-full items-center justify-center rounded-xl bg-[#00BCD4] text-sm font-semibold text-[#0B1220] disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity";

const emojiChoices = ["⚽", "🏏", "🏀", "🎾", "🏈", "🏐", "🏉", "🥊", "🏒", "🏓", "🏸", "🎱", "🏹", "🏎️", "🚴", "⛳"];

export function AddSportModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: Omit<Category, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("⚽");

  return (
    <Modal title="Add Sport Category" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Category Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Football" />
        </div>
        <div>
          <label className={labelClass}>Icon</label>
          <div className="flex flex-wrap gap-2">
            {emojiChoices.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-xl border transition-colors ${
                  emoji === e ? "border-[#00BCD4] bg-[#00BCD4]/10" : "border-[#2A3445] bg-[#111827]"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <button
          disabled={!name.trim()}
          className={primaryBtn}
          onClick={() => {
            onSave({ name: name.trim(), emoji });
            onClose();
          }}
        >
          Save Category
        </button>
      </div>
    </Modal>
  );
}

export function AddMatchModal({
  status,
  onClose,
  onSave,
}: {
  status: MatchStatus;
  onClose: () => void;
  onSave: (data: Omit<Match, "id">) => void;
}) {
  const [tournament, setTournament] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [countdown, setCountdown] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [streamType, setStreamType] = useState<StreamType>("M3U8");

  const valid =
    tournament.trim() &&
    teamA.trim() &&
    teamB.trim() &&
    date.trim() &&
    time.trim() &&
    /^https?:\/\//i.test(streamUrl.trim());

  return (
    <Modal title={`Add ${status[0].toUpperCase()}${status.slice(1)} Match`} onClose={onClose}>
      <div className="space-y-3.5">
        <div>
          <label className={labelClass}>Tournament Name</label>
          <input className={inputClass} value={tournament} onChange={(e) => setTournament(e.target.value)} placeholder="e.g. Premier League" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Date</label>
            <input className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} placeholder="DD/MM/YYYY" />
          </div>
          <div>
            <label className={labelClass}>Time</label>
            <input className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} placeholder="HH:MM" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Team A</label>
            <input className={inputClass} value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="Team A" />
          </div>
          <div>
            <label className={labelClass}>Team B</label>
            <input className={inputClass} value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="Team B" />
          </div>
        </div>
        {status === "upcoming" && (
          <div>
            <label className={labelClass}>Countdown Label</label>
            <input className={inputClass} value={countdown} onChange={(e) => setCountdown(e.target.value)} placeholder="e.g. Starts in 2h" />
          </div>
        )}
        <div>
          <label className={labelClass}>Stream URL</label>
          <input className={inputClass} value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} placeholder="https://example.com/live.m3u8" />
        </div>
        <div>
          <label className={labelClass}>Stream Type</label>
          <div className="flex gap-2">
            {(["M3U", "M3U8"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setStreamType(type)}
                className={`h-11 flex-1 rounded-xl border text-sm font-semibold transition-colors ${
                  streamType === type ? "border-[#00BCD4] bg-[#00BCD4]/10 text-[#00BCD4]" : "border-[#2A3445] bg-[#111827] text-gray-400"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex h-12 items-center justify-center rounded-xl border border-[#2A3445] text-sm font-semibold text-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            className={primaryBtn}
            onClick={() => {
              onSave({
                tournament: tournament.trim(),
                date: date.trim(),
                time: time.trim(),
                teamA: teamA.trim(),
                teamB: teamB.trim(),
                status,
                countdown: countdown.trim() || undefined,
                streamUrl: streamUrl.trim(),
                streamType,
              });
              onClose();
            }}
          >
            Save Match
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AddPlaylistModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: Omit<Playlist, "id" | "createdAt">) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<StreamType>("M3U8");

  const normalizedUrl = url.trim().toLowerCase();
  const validUrl = /^https?:\/\//i.test(url.trim()) && (normalizedUrl.includes(".m3u") || normalizedUrl.includes(".m3u8"));
  const valid = name.trim() && validUrl;

  return (
    <Modal title="Add New Playlist" onClose={onClose}>
      <div className="space-y-3.5">
        <div>
          <label className={labelClass}>Playlist Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sports Channel HD" />
        </div>
        <div>
          <label className={labelClass}>Playlist URL</label>
          <input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/playlist.m3u8" />
          {!!url && !validUrl && <p className="mt-1 text-xs text-red-400">Use a valid http/https .m3u or .m3u8 URL.</p>}
        </div>
        <div>
          <label className={labelClass}>Format</label>
          <div className="flex gap-2">
            {(["M3U", "M3U8"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`h-11 flex-1 rounded-xl text-sm font-semibold border transition-colors ${
                  format === f ? "border-[#00BCD4] bg-[#00BCD4]/10 text-[#00BCD4]" : "border-[#2A3445] bg-[#111827] text-gray-400"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-[#111827] border border-[#2A3445] p-3 text-xs text-gray-400">
          <Lock size={14} className="mt-0.5 shrink-0 text-[#00BCD4]" />
          <span>Once saved, this playlist is automatically Approved and permanently locked. Editing and deleting will be disabled.</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex h-12 items-center justify-center rounded-xl border border-[#2A3445] text-sm font-semibold text-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            className={primaryBtn}
            onClick={() => {
              onSave({ name: name.trim(), url: url.trim(), format, approved: true });
              onClose();
            }}
          >
            Approve
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AddHighlightModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: Omit<Highlight, "id">) => void;
}) {
  const [tournament, setTournament] = useState("");
  const [date, setDate] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  const valid = tournament.trim() && date.trim() && teamA.trim() && teamB.trim();

  return (
    <Modal title="Add Highlight" onClose={onClose}>
      <div className="space-y-3.5">
        <div>
          <label className={labelClass}>Tournament</label>
          <input className={inputClass} value={tournament} onChange={(e) => setTournament(e.target.value)} placeholder="e.g. FIFA World Cup" />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} placeholder="DD/MM/YYYY" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Team One</label>
            <input className={inputClass} value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="Team One" />
          </div>
          <div>
            <label className={labelClass}>Team Two</label>
            <input className={inputClass} value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="Team Two" />
          </div>
        </div>
        <button
          disabled={!valid}
          className={primaryBtn}
          onClick={() => {
            onSave({ tournament: tournament.trim(), date: date.trim(), teamA: teamA.trim(), teamB: teamB.trim() });
            onClose();
          }}
        >
          Save Highlight
        </button>
      </div>
    </Modal>
  );
}
