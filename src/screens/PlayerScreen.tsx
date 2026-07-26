import { Maximize, Minimize, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { StreamPayload } from "../types";

export default function PlayerScreen({
  stream,
  initialPosition,
  onPositionSave,
}: {
  stream: StreamPayload;
  initialPosition: number;
  onPositionSave: (position: number) => void;
}) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = useMemo(() => {
    const totalSeconds = Math.floor((progress / 100) * (duration || 1));
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [progress, duration]);

  const durationLabel = useMemo(() => {
    const totalSeconds = Math.floor(duration || 0);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [duration]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = initialPosition;
    const onTime = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
      onPositionSave(video.currentTime);
    };
    const onMeta = () => {
      setDuration(video.duration || 0);
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    return () => {
      onPositionSave(video.currentTime || 0);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [initialPosition, onPositionSave]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  async function toggleFullscreen() {
    const target = screenRef.current;
    if (!target) return;
    if (!document.fullscreenElement) {
      await target.requestFullscreen();
      setFullscreen(true);
      if (screen.orientation && "lock" in screen.orientation) {
        try {
          await (screen.orientation.lock as (orientation: string) => Promise<void>)("landscape");
        } catch {
          /* orientation lock may be unavailable */
        }
      }
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  }

  return (
    <div ref={screenRef} className="px-4 pb-10 pt-4">
      <div className="overflow-hidden rounded-[20px] border border-[#2A3445] bg-[#1B2432] shadow-md">
        <div className="relative aspect-video bg-[#0c111a]">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={stream.streamUrl}
            playsInline
            controls={false}
          />
          <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3">
            <div>
              <p className="text-sm font-semibold text-white">{stream.channelName}</p>
              <p className="text-xs text-gray-300">{stream.streamType} Player</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="truncate text-sm font-semibold text-white">{stream.channelName}</p>
          <p className="truncate text-xs text-gray-500">{stream.sourceName}</p>

          <div className="mt-4 rounded-xl border border-[#2A3445] bg-[#111827] p-3">
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(event) => {
                const nextProgress = Number(event.target.value);
                setProgress(nextProgress);
                if (videoRef.current && duration > 0) {
                  videoRef.current.currentTime = (nextProgress / 100) * duration;
                }
              }}
              className="w-full accent-[#00BCD4]"
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
              <span>{current}</span>
              <span>{durationLabel}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                if (!videoRef.current) return;
                videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2A3445] bg-[#111827] text-gray-300"
            >
              <SkipBack size={18} />
            </button>
            <button
              onClick={() => setPlaying((value) => !value)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00BCD4] text-[#0B1220]"
            >
              {playing ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
            </button>
            <button
              onClick={() => {
                if (!videoRef.current) return;
                videoRef.current.currentTime = Math.min(duration || 0, videoRef.current.currentTime + 10);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2A3445] bg-[#111827] text-gray-300"
            >
              <SkipForward size={18} />
            </button>
            <button
              onClick={() => setMuted((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2A3445] bg-[#111827] text-gray-300"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2A3445] bg-[#111827] text-gray-300"
            >
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}