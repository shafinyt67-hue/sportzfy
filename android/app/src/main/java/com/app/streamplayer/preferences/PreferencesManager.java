package com.app.streamplayer.preferences;

import android.content.Context;
import android.content.SharedPreferences;

public class PreferencesManager {
    private static final String PREFS = "stream_player_prefs";
    public static final String KEY_VIDEO_QUALITY = "video_quality";
    public static final String KEY_THEME = "theme";
    public static final String KEY_FLOATING_PLAYER = "floating_player";
    public static final String KEY_LAST_OPENED_PLAYLIST = "last_opened_playlist";
    public static final String KEY_LAST_CHANNEL_NAME = "last_channel_name";
    public static final String KEY_LAST_STREAM_URL = "last_stream_url";
    public static final String KEY_LAST_STREAM_POSITION = "last_stream_position";
    public static final String KEY_NOTICE_TITLE = "notice_title";
    public static final String KEY_NOTICE_DESC = "notice_desc";
    public static final String KEY_JOIN_TELEGRAM = "join_telegram";
    public static final String KEY_JOIN_APPROVED = "join_approved";
    public static final String KEY_UPDATE_URL = "update_url";
    public static final String KEY_UPDATE_APPROVED = "update_approved";

    private final SharedPreferences prefs;

    public PreferencesManager(Context context) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public void setVideoQuality(String value) {
        prefs.edit().putString(KEY_VIDEO_QUALITY, value).apply();
    }

    public String getVideoQuality() {
        return prefs.getString(KEY_VIDEO_QUALITY, "Auto");
    }

    public void setTheme(String value) {
        prefs.edit().putString(KEY_THEME, value).apply();
    }

    public String getTheme() {
        return prefs.getString(KEY_THEME, "dark");
    }

    public void setFloatingPlayer(boolean enabled) {
        prefs.edit().putBoolean(KEY_FLOATING_PLAYER, enabled).apply();
    }

    public boolean isFloatingPlayerEnabled() {
        return prefs.getBoolean(KEY_FLOATING_PLAYER, false);
    }

    public void setLastOpenedPlaylist(long playlistId) {
        prefs.edit().putLong(KEY_LAST_OPENED_PLAYLIST, playlistId).apply();
    }

    public long getLastOpenedPlaylist() {
        return prefs.getLong(KEY_LAST_OPENED_PLAYLIST, -1);
    }

    public void saveLastPlayback(String channelName, String streamUrl, long position) {
        prefs.edit()
                .putString(KEY_LAST_CHANNEL_NAME, channelName)
                .putString(KEY_LAST_STREAM_URL, streamUrl)
                .putLong(KEY_LAST_STREAM_POSITION, position)
                .apply();
    }

    public long getLastPlaybackPosition(String streamUrl) {
        String lastUrl = prefs.getString(KEY_LAST_STREAM_URL, "");
        if (lastUrl != null && lastUrl.equals(streamUrl)) {
            return prefs.getLong(KEY_LAST_STREAM_POSITION, 0);
        }
        return 0;
    }

    public void saveNotice(String title, String description) {
        prefs.edit().putString(KEY_NOTICE_TITLE, title).putString(KEY_NOTICE_DESC, description).apply();
    }

    public String getNoticeTitle() {
        return prefs.getString(KEY_NOTICE_TITLE, "");
    }

    public String getNoticeDescription() {
        return prefs.getString(KEY_NOTICE_DESC, "");
    }

    public void saveJoinUs(String telegram, boolean approved) {
        prefs.edit().putString(KEY_JOIN_TELEGRAM, telegram).putBoolean(KEY_JOIN_APPROVED, approved).apply();
    }

    public String getJoinTelegram() {
        return prefs.getString(KEY_JOIN_TELEGRAM, "");
    }

    public boolean isJoinApproved() {
        return prefs.getBoolean(KEY_JOIN_APPROVED, false);
    }

    public void saveUpdateUrl(String url, boolean approved) {
        prefs.edit().putString(KEY_UPDATE_URL, url).putBoolean(KEY_UPDATE_APPROVED, approved).apply();
    }

    public String getUpdateUrl() {
        return prefs.getString(KEY_UPDATE_URL, "");
    }

    public boolean isUpdateApproved() {
        return prefs.getBoolean(KEY_UPDATE_APPROVED, false);
    }
}