import type { ChannelEntity } from "../models/entities";

export function parseM3uPlaylist(playlistId: string, rawText: string): ChannelEntity[] {
  const lines = rawText.split(/\r?\n/);
  const parsed: ChannelEntity[] = [];
  let pendingName = "";
  let pendingLogo = "";
  let pendingGroup = "";

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF:")) {
      pendingName = line.includes(",") ? line.slice(line.lastIndexOf(",") + 1).trim() : `Channel ${parsed.length + 1}`;
      pendingLogo = line.match(/tvg-logo="([^"]+)"/i)?.[1] ?? "";
      pendingGroup = line.match(/group-title="([^"]+)"/i)?.[1] ?? "";
      continue;
    }

    if (!line.startsWith("#") && /^https?:\/\//i.test(line)) {
      parsed.push({
        id: `${playlistId}-${parsed.length + 1}`,
        playlist_id: playlistId,
        channel_name: pendingName || `Channel ${parsed.length + 1}`,
        logo_url: pendingLogo,
        stream_url: line,
        group_name: pendingGroup,
      });
      pendingName = "";
      pendingLogo = "";
      pendingGroup = "";
    }
  }

  return parsed;
}