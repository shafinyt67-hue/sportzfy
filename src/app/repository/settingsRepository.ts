import { settingsStorage } from "../storage/settingsStorage";

export const settingsRepository = {
  get() {
    return settingsStorage.getAll();
  },
  setVideoQuality(video_quality: ReturnType<typeof settingsStorage.getAll>["video_quality"]) {
    settingsStorage.patch({ video_quality });
  },
  setFloatingPlayer(floating_player: boolean) {
    settingsStorage.patch({ floating_player });
  },
  setLastOpenedPlaylist(last_opened_playlist: string) {
    settingsStorage.patch({ last_opened_playlist });
  },
};