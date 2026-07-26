import { streamPlayerDb } from "../database/streamPlayerDb";
import type { ChannelEntity, PlaylistEntity } from "../models/entities";
import { isOnline } from "../network/connectivity";
import { parseM3uPlaylist } from "../parser/m3uParser";
import { isPlaylistUrl } from "../utils/validation";
import type { StreamType } from "../../types";

export class PlaylistValidationError extends Error {}
export class PlaylistNetworkError extends Error {}
export class PlaylistFormatError extends Error {}

export const playlistsRepository = {
  getAll(): PlaylistEntity[] {
    return streamPlayerDb.getPlaylists();
  },

  createApproved(input: { id: string; name: string; url: string; format: StreamType; createdDate: number }): PlaylistEntity {
    if (!input.url.trim()) {
      throw new PlaylistValidationError("Please Enter Playlist URL");
    }
    if (!isPlaylistUrl(input.url)) {
      throw new PlaylistValidationError("Invalid Playlist URL");
    }
    const playlist: PlaylistEntity = {
      id: input.id,
      playlist_name: input.name,
      playlist_url: input.url,
      approved: true,
      created_date: input.createdDate,
      format: input.format,
    };
    streamPlayerDb.savePlaylists([playlist, ...streamPlayerDb.getPlaylists()]);
    return playlist;
  },

  createApprovedFromLocalFile(input: {
    id: string;
    name: string;
    fileName: string;
    rawText: string;
    createdDate: number;
  }): PlaylistEntity {
    const playlist: PlaylistEntity = {
      id: input.id,
      playlist_name: input.name,
      playlist_url: `local://${input.fileName}`,
      approved: true,
      created_date: input.createdDate,
      format: "M3U",
    };
    const channels = parseM3uPlaylist(input.id, input.rawText);
    if (channels.length === 0) {
      throw new PlaylistFormatError("Unsupported Playlist Format");
    }
    streamPlayerDb.savePlaylists([playlist, ...streamPlayerDb.getPlaylists()]);
    streamPlayerDb.replaceChannelsForPlaylist(input.id, channels);
    return playlist;
  },

  async parseAndStoreChannels(playlist: PlaylistEntity): Promise<ChannelEntity[]> {
    if (!isOnline()) {
      throw new PlaylistNetworkError("No Internet Connection");
    }
    const response = await fetch(playlist.playlist_url, { cache: "no-store" });
    if (!response.ok) {
      throw new PlaylistNetworkError("Connection Failed");
    }
    const rawText = await response.text();
    const channels = parseM3uPlaylist(playlist.id, rawText);
    if (channels.length === 0) {
      throw new PlaylistFormatError("Unsupported Playlist Format");
    }
    streamPlayerDb.replaceChannelsForPlaylist(playlist.id, channels);
    return channels;
  },

  getStoredChannels(playlistId: string): ChannelEntity[] {
    return streamPlayerDb.getChannelsByPlaylist(playlistId);
  },
};