export type MatchStatus = "recent" | "live" | "upcoming";

export type StreamType = "M3U" | "M3U8" | "TS" | "MP4" | "DASH";

export interface Match {
  id: string;
  tournament: string;
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  status: MatchStatus;
  countdown?: string;
  streamUrl: string;
  streamType: StreamType;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface Playlist {
  id: string;
  name: string;
  url: string;
  format: StreamType;
  approved: boolean;
  createdAt: number;
}

export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
}

export interface StreamPayload {
  channelName: string;
  streamUrl: string;
  streamType: StreamType;
  logo?: string;
  sourceName: string;
  cookie?: string;
  referer?: string;
  origin?: string;
  drmLicense?: string;
  drmType?: "Default" | "ClearKey";
}

export interface FavoriteChannel {
  id: string;
  playlistId: string;
  channelName: string;
  streamUrl: string;
  logo?: string;
  group?: string;
  addedAt: number;
}

export interface PlaybackResume {
  streamUrl: string;
  channelName: string;
  sourceName: string;
  position: number;
  savedAt: number;
}

export interface Highlight {
  id: string;
  tournament: string;
  date: string;
  teamA: string;
  teamB: string;
}

export interface BannerData {
  website: string;
  telegram: string;
  approved: boolean;
  visible: boolean;
}

export type ScreenName =
  | "home"
  | "categories"
  | "highlights"
  | "networkStream"
  | "playlists"
  | "playlistChannels"
  | "player";

export type VideoQuality = "Auto" | "240p" | "360p" | "480p" | "720p" | "1080p";

export interface JoinUsData {
  telegram: string;
  approved: boolean;
}

export interface UpdateConfig {
  url: string;
  approved: boolean;
}

export interface NoticeData {
  title: string;
  description: string;
}
