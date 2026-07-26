import { useState } from "react";
import Modal from "./Modal";
import type { JoinUsData, NoticeData, UpdateConfig, VideoQuality } from "../types";
import {
  AlertTriangle,
  Check,
  Clipboard,
  Copyright,
  ExternalLink,
  LogOut,
  Mail,
  Save,
  Send,
  Sparkles,
} from "lucide-react";

const qualities: VideoQuality[] = ["Auto", "240p", "360p", "480p", "720p", "1080p"];

export function VideoQualityModal({
  value,
  onClose,
  onChange,
}: {
  value: VideoQuality;
  onClose: () => void;
  onChange: (q: VideoQuality) => void;
}) {
  return (
    <Modal title="Video Quality Setting" onClose={onClose}>
      <div className="flex flex-col gap-2">
        {qualities.map((q) => (
          <button
            key={q}
            onClick={() => {
              onChange(q);
              onClose();
            }}
            className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-semibold transition-colors ${
              value === q ? "border-[#00BCD4] bg-[#00BCD4]/10 text-[#00BCD4]" : "border-[#2A3445] bg-[#111827] text-gray-300"
            }`}
          >
            {q}
            {value === q && <Check size={17} />}
          </button>
        ))}
      </div>
    </Modal>
  );
}

export function CrashLogModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const logs = `[Info] App started\n[Info] Network stack ready\n[Info] Playlist parser initialized\n[Warn] No critical crash detected`;
  return (
    <Modal
      title="Crash Log Dialog"
      onClose={onClose}
      footer={
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(logs);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#2A3445] text-sm font-semibold text-gray-300"
          >
            <Clipboard size={15} /> {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-xl bg-[#00BCD4] text-sm font-semibold text-[#0B1220]"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="min-h-36 rounded-xl border border-[#2A3445] bg-[#111827] p-3 font-mono text-xs leading-relaxed text-gray-300 whitespace-pre-wrap">
        {logs}
      </div>
    </Modal>
  );
}

export function NoticeModal({
  notice,
  onSave,
  onClose,
}: {
  notice: NoticeData;
  onSave: (notice: NoticeData) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(notice.title);
  const [description, setDescription] = useState(notice.description);
  return (
    <Modal title="Notice" onClose={onClose}>
      <div className="space-y-3">
        <div className="rounded-xl border border-[#2A3445] bg-[#111827] p-3">
          <p className="text-xs text-gray-500">Notice Title</p>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter notice title"
            className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
          />
        </div>
        <div className="rounded-xl border border-[#2A3445] bg-[#111827] p-3">
          <p className="text-xs text-gray-500">Notice Description</p>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter notice description"
            rows={4}
            className="mt-1 w-full resize-none bg-transparent text-sm text-gray-300 outline-none"
          />
        </div>
        <button
          onClick={() => {
            onSave({ title: title.trim(), description: description.trim() });
            onClose();
          }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00BCD4] text-sm font-semibold text-[#0B1220]"
        >
          <Save size={16} /> Save Notice
        </button>
      </div>
    </Modal>
  );
}

export function JoinUsModal({
  data,
  onSave,
  onClose,
}: {
  data: JoinUsData;
  onSave: (data: JoinUsData) => void;
  onClose: () => void;
}) {
  const [telegram, setTelegram] = useState(data.telegram);
  return (
    <Modal title="Join Us" onClose={onClose}>
      <div className="space-y-3">
        <div className="rounded-xl border border-[#2A3445] bg-[#111827] p-3">
          <p className="text-xs text-gray-500">Telegram Link</p>
          <input
            value={telegram}
            onChange={(event) => setTelegram(event.target.value)}
            placeholder="Paste Telegram link"
            disabled={data.approved}
            className="mt-1 w-full bg-transparent text-sm text-white outline-none disabled:text-gray-500"
          />
        </div>
        {data.approved ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
            <span className="text-sm font-semibold text-emerald-400">Approved</span>
            {data.telegram && (
              <a href={data.telegram} target="_blank" rel="noreferrer" className="text-xs text-[#00BCD4] underline">
                Open Link
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="flex h-11 items-center justify-center rounded-xl border border-[#2A3445] text-sm font-semibold text-gray-300"
            >
              Cancel
            </button>
            <button
              disabled={!/^https?:\/\//i.test(telegram.trim())}
              onClick={() => {
                onSave({ telegram: telegram.trim(), approved: true });
                onClose();
              }}
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#00BCD4] text-sm font-semibold text-[#0B1220] disabled:opacity-40"
            >
              <Check size={16} /> Approve
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function CopyrightModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Copyright" onClose={onClose}>
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <Copyright size={30} className="text-[#00BCD4]" />
        <p className="text-sm text-gray-300">© {new Date().getFullYear()} Sportzfy.</p>
        <p className="text-xs text-gray-500">Developer: Your Developer Name</p>
        <p className="text-xs text-gray-500">App Version: 1.0.0</p>
      </div>
    </Modal>
  );
}

export function UpdateAppModal({
  config,
  onSave,
  onClose,
}: {
  config: UpdateConfig;
  onSave: (config: UpdateConfig) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(config.url);
  const valid = /^https?:\/\//i.test(url.trim());
  return (
    <Modal title="Update App" onClose={onClose}>
      <div className="space-y-3">
        <div className="rounded-xl border border-[#2A3445] bg-[#111827] p-3">
          <p className="text-xs text-gray-500">Update URL</p>
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste update URL"
            disabled={config.approved}
            className="mt-1 w-full bg-transparent text-sm text-white outline-none disabled:text-gray-500"
          />
        </div>
        {config.approved ? (
          <a
            href={config.url || undefined}
            target="_blank"
            rel="noreferrer"
            className={`flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00BCD4] text-sm font-semibold text-[#0B1220] ${
              !config.url && "pointer-events-none opacity-40"
            }`}
          >
            <ExternalLink size={16} /> Open Update URL
          </a>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="flex h-11 items-center justify-center rounded-xl border border-[#2A3445] text-sm font-semibold text-gray-300"
            >
              Cancel
            </button>
            <button
              disabled={!valid}
              onClick={() => {
                onSave({ url: url.trim(), approved: true });
                onClose();
              }}
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#00BCD4] text-sm font-semibold text-[#0B1220] disabled:opacity-40"
            >
              <Check size={16} /> Approve
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function EmailModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const email = "support@sportzfy.app";
  const subject = "Sportzfy Support";
  return (
    <Modal title="Contact Email" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-[#2A3445] bg-[#111827] px-4 py-3.5">
          <Mail size={18} className="text-[#00BCD4]" />
          <span className="flex-1 truncate text-sm font-medium text-white">{email}</span>
        </div>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
          className="flex h-11 items-center justify-center rounded-xl bg-[#00BCD4] text-sm font-semibold text-[#0B1220]"
        >
          Open Email App
        </a>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
          className="flex h-11 items-center justify-center rounded-xl border border-[#2A3445] text-sm font-semibold text-gray-300"
        >
          {copied ? "Copied" : "Copy Email"}
        </button>
      </div>
    </Modal>
  );
}

export function ExitModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal title="Exit Application?" onClose={onClose}>
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle size={26} className="text-red-400" />
        </div>
        <p className="text-sm text-gray-300">Are you sure you want to close the app?</p>
        <div className="mt-2 grid w-full grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-xl border border-[#2A3445] text-sm font-semibold text-gray-300"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-red-500 text-sm font-semibold text-white"
          >
            <LogOut size={16} /> Yes
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function GoodbyeScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-[#111827] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#2A3445] bg-[#1B2432]">
        <LogOut size={28} className="text-[#00BCD4]" />
      </div>
      <h2 className="text-xl font-bold text-white">Thanks for using Sportzfy</h2>
      <p className="text-sm text-gray-500">You may now close this tab.</p>
    </div>
  );
}

export function NoticePreview({ notice }: { notice: NoticeData }) {
  if (!notice.title && !notice.description) return null;
  return (
    <div className="mx-4 mt-3 rounded-xl border border-[#2A3445] bg-[#1B2432] px-4 py-3">
      <p className="text-sm font-semibold text-white">{notice.title || "Notice"}</p>
      <p className="mt-1 text-xs text-gray-400">{notice.description || "No details"}</p>
      <div className="mt-2 flex items-center gap-1 text-[11px] text-[#00BCD4]">
        <Sparkles size={12} /> Admin notice
      </div>
    </div>
  );
}

export function JoinUsQuickLink({ data }: { data: JoinUsData }) {
  if (!data.approved || !data.telegram) return null;
  return (
    <a
      href={data.telegram}
      target="_blank"
      rel="noreferrer"
      className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-[#2A3445] bg-[#1B2432] px-4 py-3 text-sm text-white"
    >
      <Send size={15} className="text-[#00BCD4]" /> Join our Telegram community
    </a>
  );
}