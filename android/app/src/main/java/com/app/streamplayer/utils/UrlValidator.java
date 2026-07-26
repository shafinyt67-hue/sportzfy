package com.app.streamplayer.utils;

import android.util.Patterns;

public class UrlValidator {
    public static boolean isValidHttpUrl(String value) {
        return value != null && (value.startsWith("http://") || value.startsWith("https://")) && Patterns.WEB_URL.matcher(value).matches();
    }

    public static boolean isPlaylistUrl(String value) {
        if (!isValidHttpUrl(value)) return false;
        String lower = value.toLowerCase();
        return lower.contains(".m3u") || lower.contains(".m3u8");
    }

    public static boolean isPlayableStream(String value) {
        if (!isValidHttpUrl(value)) return false;
        String lower = value.toLowerCase();
        return lower.contains(".m3u8") || lower.contains(".ts") || lower.contains(".mp4") || lower.contains(".mpd");
    }
}