export function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

export function isPlaylistUrl(value: string): boolean {
  const lower = value.trim().toLowerCase();
  return isHttpUrl(value) && (lower.includes(".m3u") || lower.includes(".m3u8"));
}