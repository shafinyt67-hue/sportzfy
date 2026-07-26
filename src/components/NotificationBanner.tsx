import { CheckCircle2, Globe, Send, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import type { BannerData } from "../types";

interface Props {
  banner: BannerData;
  onUpdate: (data: Partial<BannerData>) => void;
  onApprove: (website: string, telegram: string) => void;
}

export default function NotificationBanner({ banner, onUpdate, onApprove }: Props) {
  const [website, setWebsite] = useState(banner.website);
  const [telegram, setTelegram] = useState(banner.telegram);

  if (!banner.visible) return null;

  if (banner.approved) {
    return (
      <div className="relative mx-4 mt-4 rounded-[20px] border border-[#2A3445] bg-[#1B2432] p-4 shadow-lg">
        <button
          onClick={() => onUpdate({ visible: false })}
          className="absolute right-3 top-3 h-7 w-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-white/5 hover:text-white"
        >
          <X size={16} />
        </button>
        <div className="flex items-start gap-2 pr-8 text-sm leading-relaxed text-gray-200">
          <Globe size={16} className="mt-0.5 shrink-0 text-[#00BCD4]" />
          <span>
            Official website:{" "}
            <a
              href={banner.website}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#00BCD4] underline underline-offset-2 break-all"
            >
              {banner.website}
            </a>
          </span>
        </div>
        <div className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-gray-200">
          <Send size={16} className="mt-0.5 shrink-0 text-[#00BCD4]" />
          <span>
            Join our official Telegram:{" "}
            <a
              href={banner.telegram}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#00BCD4] underline underline-offset-2 break-all"
            >
              {banner.telegram}
            </a>
          </span>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
          <ShieldCheck size={14} /> Approved
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-4 mt-4 rounded-[20px] border border-[#2A3445] bg-[#1B2432] p-4 shadow-lg">
      <button
        onClick={() => onUpdate({ visible: false })}
        className="absolute right-3 top-3 h-7 w-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-white/5 hover:text-white"
      >
        <X size={16} />
      </button>
      <p className="pr-8 text-sm font-semibold text-white">Admin Notification Setup</p>
      <p className="mt-0.5 text-xs text-gray-400">Paste links below, then approve to lock permanently.</p>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 rounded-xl border border-[#2A3445] bg-[#111827] px-3 py-2.5">
          <Globe size={16} className="shrink-0 text-gray-400" />
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website link"
            className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#2A3445] bg-[#111827] px-3 py-2.5">
          <Send size={16} className="shrink-0 text-gray-400" />
          <input
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="Telegram link"
            className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          />
        </div>
      </div>

      <button
        disabled={!website.trim() || !telegram.trim()}
        onClick={() => onApprove(website.trim(), telegram.trim())}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00BCD4] text-sm font-semibold text-[#0B1220] transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
      >
        <CheckCircle2 size={18} /> Approve
      </button>
    </div>
  );
}
