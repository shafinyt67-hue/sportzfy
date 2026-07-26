import { streamPlayerDb } from "../database/streamPlayerDb";

export const linksRepository = {
  getLinks() {
    return streamPlayerDb.getLinks();
  },
  approve(websiteLink: string, telegramLink: string) {
    const current = streamPlayerDb.getLinks();
    streamPlayerDb.saveLinks({
      ...current,
      website_link: websiteLink,
      telegram_link: telegramLink,
      approved: true,
    });
  },
};