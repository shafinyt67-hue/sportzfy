import type { MatchStatus, StreamType, VideoQuality } from "../../types";

export interface PlaylistEntity {
  id: string;
  playlist_name: string;
  playlist_url: string;
  approved: boolean;
  created_date: number;
  format: StreamType;
}

export interface LinkEntity {
  id: number;
  website_link: string;
  telegram_link: string;
  approved: boolean;
}

export interface SettingsEntity {
  id: number;
  video_quality: VideoQuality;
  floating_player: boolean;
  theme: "dark";
  last_opened_playlist: string;
}

export interface ChannelEntity {
  id: string;
  playlist_id: string;
  channel_name: string;
  logo_url: string;
  stream_url: string;
  group_name: string;
}

export interface MatchEntity {
  id: string;
  tournament: string;
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  status: MatchStatus;
  countdown?: string;
  stream_url: string;
  stream_type: StreamType;
}