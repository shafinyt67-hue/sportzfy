import type { ChannelEntity, LinkEntity, PlaylistEntity, SettingsEntity } from "../models/entities";

export const DB_NAME = "StreamPlayer.db";
export const DB_VERSION = 1;

type Tables = {
  playlists: PlaylistEntity[];
  links: LinkEntity[];
  settings: SettingsEntity[];
  channels: ChannelEntity[];
};

const STORAGE_KEY = `${DB_NAME}.v${DB_VERSION}`;

const defaultData: Tables = {
  playlists: [],
  links: [{ id: 1, website_link: "", telegram_link: "", approved: false }],
  settings: [
    {
      id: 1,
      video_quality: "Auto",
      floating_player: false,
      theme: "dark",
      last_opened_playlist: "",
    },
  ],
  channels: [],
};

function readDb(): Tables {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? ({ ...defaultData, ...JSON.parse(raw) } as Tables) : defaultData;
  } catch {
    return defaultData;
  }
}

function writeDb(data: Tables): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const streamPlayerDb = {
  getPlaylists(): PlaylistEntity[] {
    return readDb().playlists;
  },
  savePlaylists(playlists: PlaylistEntity[]): void {
    const db = readDb();
    db.playlists = playlists;
    writeDb(db);
  },
  getLinks(): LinkEntity {
    return readDb().links[0] ?? defaultData.links[0];
  },
  saveLinks(links: LinkEntity): void {
    const db = readDb();
    db.links = [links];
    writeDb(db);
  },
  getSettings(): SettingsEntity {
    return readDb().settings[0] ?? defaultData.settings[0];
  },
  saveSettings(settings: SettingsEntity): void {
    const db = readDb();
    db.settings = [settings];
    writeDb(db);
  },
  getChannelsByPlaylist(playlistId: string): ChannelEntity[] {
    return readDb().channels.filter((channel) => channel.playlist_id === playlistId);
  },
  replaceChannelsForPlaylist(playlistId: string, channels: ChannelEntity[]): void {
    const db = readDb();
    db.channels = db.channels.filter((channel) => channel.playlist_id !== playlistId).concat(channels);
    writeDb(db);
  },
};