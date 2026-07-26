import { linksRepository } from "../repository/linksRepository";
import { playlistsRepository } from "../repository/playlistsRepository";
import { settingsRepository } from "../repository/settingsRepository";

export function loadAppBootstrapData() {
  return {
    settings: settingsRepository.get(),
    playlists: playlistsRepository.getAll(),
    links: linksRepository.getLinks(),
  };
}