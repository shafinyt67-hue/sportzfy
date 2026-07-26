import { streamPlayerDb } from "../database/streamPlayerDb";

export const settingsStorage = {
  getAll() {
    return streamPlayerDb.getSettings();
  },
  patch(values: Partial<ReturnType<typeof streamPlayerDb.getSettings>>) {
    const current = streamPlayerDb.getSettings();
    streamPlayerDb.saveSettings({ ...current, ...values });
  },
};