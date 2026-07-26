import { ClipboardPaste, Play } from "lucide-react";
import { useState } from "react";
import { useToast } from "../hooks/useToast";
import type { StreamPayload, StreamType } from "../types";

interface Props {
  onPlay: (payload: StreamPayload) => void;
}

function detectStreamType(url: string): StreamType | null {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".m3u8")) return "M3U8";
  if (path.endsWith(".ts")) return "TS";
  if (path.endsWith(".mp4")) return "MP4";
  if (path.endsWith(".mpd")) return "DASH";
  return null;
}

const validUrl = (value: string) => /^https?:\/\//i.test(value.trim());

export default function NetworkStreamScreen({ onPlay }: Props) {
  const { showToast } = useToast();
  const [streamUrl, setStreamUrl] = useState("");
  const [cookie, setCookie] = useState("");
  const [referer, setReferer] = useState("");
  const [origin, setOrigin] = useState("");
  const [drmLicense, setDrmLicense] = useState("");
  const [drmType, setDrmType] = useState<"Default" | "ClearKey">("Default");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  async function paste(setter: (value: string) => void) {
    try {
      const text = await navigator.clipboard.readText();
      setter(text);
    } catch {
      showToast("Clipboard access denied");
    }
  }

  async function handlePlay() {
    const trimmed = streamUrl.trim();
    if (!trimmed) {
      showToast("Please enter stream URL");
      return;
    }
    if (!validUrl(trimmed)) {
      showToast("Invalid URL");
      return;
    }
    const streamType = detectStreamType(trimmed);
    if (!streamType) {
      showToast("Unsupported stream");
      return;
    }

    setIsConnecting(true);
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 6000);
      const response = await fetch(trimmed, {
        method: "GET",
        signal: controller.signal,
        headers: {
          ...(cookie.trim() ? { Cookie: cookie.trim() } : {}),
          ...(referer.trim() ? { Referer: referer.trim() } : {}),
          ...(origin.trim() ? { Origin: origin.trim() } : {}),
        },
      });
      window.clearTimeout(timeoutId);
      if (!response.ok) {
        showToast("Unable to connect");
        return;
      }

      setIsBuffering(true);
      await new Promise((resolve) => window.setTimeout(resolve, 700));

      onPlay({
        channelName: "Network Stream",
        streamUrl: trimmed,
        streamType,
        sourceName: "Network Stream",
        cookie: cookie.trim() || undefined,
        referer: referer.trim() || undefined,
        origin: origin.trim() || undefined,
        drmLicense: drmLicense.trim() || undefined,
        drmType,
      });
    } catch {
      showToast("Unable to connect");
    } finally {
      setIsConnecting(false);
      setIsBuffering(false);
    }
  }

  return (
    <div className="px-4 pb-10 pt-4">
      <div className="rounded-[20px] border border-[#00BCD4]/50 bg-[#1B2432] p-2">
        {[
          { key: "Stream URL", value: streamUrl, setter: setStreamUrl },
          { key: "Cookie", value: cookie, setter: setCookie },
          { key: "Referer", value: referer, setter: setReferer },
          { key: "Origin", value: origin, setter: setOrigin },
          { key: "DRM License", value: drmLicense, setter: setDrmLicense },
        ].map((field, index, arr) => (
          <div
            key={field.key}
            className={`flex items-center gap-3 px-3.5 py-3.5 ${index !== arr.length - 1 ? "border-b border-[#2A3445]" : ""}`}
          >
            <input
              value={field.value}
              onChange={(event) => field.setter(event.target.value)}
              placeholder={`Paste ${field.key}`}
              className="flex-1 bg-transparent text-sm text-gray-300 placeholder:text-gray-500 outline-none"
            />
            <button
              onClick={() => paste(field.setter)}
              className="text-gray-400 transition-colors hover:text-[#00BCD4]"
              aria-label={`Paste ${field.key}`}
            >
              <ClipboardPaste size={18} />
            </button>
          </div>
        ))}

        <div className="border-t border-[#2A3445] p-2">
          <p className="mb-2 text-xs text-gray-500">DRM Type</p>
          <select
            value={drmType}
            onChange={(event) => setDrmType(event.target.value as "Default" | "ClearKey")}
            className="h-11 w-full rounded-xl border border-[#00BCD4]/60 bg-[#111827] px-3 text-sm font-medium text-white outline-none"
          >
            <option>Default</option>
            <option>ClearKey</option>
          </select>
        </div>
      </div>

      {isConnecting && <p className="mt-2 text-xs text-[#00BCD4]">Connecting server...</p>}
      {isBuffering && <p className="mt-1 text-xs text-[#00BCD4]">Buffering stream...</p>}

      <div className="mt-6 flex justify-center">
        <button
          disabled={isConnecting || isBuffering}
          onClick={handlePlay}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00BCD4] text-[#0B1220] shadow-lg shadow-cyan-950/50 transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Play size={26} fill="currentColor" />
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-gray-500">
        Supports direct M3U8, TS, MP4 and DASH (MPD) URLs. Optional headers and DRM fields can be added.
      </p>
    </div>
  );
}