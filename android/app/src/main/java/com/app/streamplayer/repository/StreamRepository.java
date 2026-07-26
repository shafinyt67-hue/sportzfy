package com.app.streamplayer.repository;

import android.content.Context;
import android.database.Cursor;

import com.app.streamplayer.database.DatabaseHelper;
import com.app.streamplayer.models.ChannelModel;
import com.app.streamplayer.models.PlaylistModel;
import com.app.streamplayer.network.NetworkClient;
import com.app.streamplayer.parser.M3uParser;
import com.app.streamplayer.utils.UrlValidator;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StreamRepository {
    private final DatabaseHelper db;
    private final NetworkClient networkClient;

    public StreamRepository(Context context) {
        this.db = new DatabaseHelper(context);
        this.networkClient = new NetworkClient();
    }

    public List<PlaylistModel> getPlaylists() {
        return db.getAllPlaylists();
    }

    public long addRemotePlaylistApproved(String name, String url, String format) throws IOException {
        if (!UrlValidator.isPlaylistUrl(url)) {
            throw new IOException("Invalid Playlist URL");
        }
        Map<String, String> headers = new HashMap<>();
        String raw = networkClient.downloadText(url, headers);
        List<ChannelModel> channels = M3uParser.parse(-1, raw);
        if (channels.isEmpty()) {
            throw new IOException("Unsupported Playlist Format");
        }

        long playlistId = db.insertPlaylist(name, url, format, 1);
        for (ChannelModel channel : channels) {
            channel.playlistId = playlistId;
        }
        db.replaceChannels(playlistId, channels);
        return playlistId;
    }

    public long addLocalPlaylistApproved(String name, String localRef, String rawText) throws IOException {
        List<ChannelModel> channels = M3uParser.parse(-1, rawText);
        if (channels.isEmpty()) {
            throw new IOException("Unsupported Playlist Format");
        }
        long playlistId = db.insertPlaylist(name, localRef, "M3U", 1);
        for (ChannelModel channel : channels) {
            channel.playlistId = playlistId;
        }
        db.replaceChannels(playlistId, channels);
        return playlistId;
    }

    public List<ChannelModel> getChannels(long playlistId) {
        return db.getChannelsByPlaylist(playlistId);
    }

    public void refreshPlaylistChannels(PlaylistModel playlist) throws IOException {
        if (!playlist.playlistUrl.startsWith("http://") && !playlist.playlistUrl.startsWith("https://")) {
            return;
        }
        String raw = networkClient.downloadText(playlist.playlistUrl, new HashMap<>());
        List<ChannelModel> channels = M3uParser.parse(playlist.id, raw);
        db.replaceChannels(playlist.id, channels);
    }

    public void setFavorite(long channelId, boolean favorite) {
        db.setChannelFavorite(channelId, favorite);
    }

    public void saveLinks(String website, String telegram, boolean approved) {
        db.saveLinks(website, telegram, approved);
    }

    public Cursor getLinks() {
        return db.getLinks();
    }

    public void saveSettings(String quality, boolean floating, String theme) {
        db.saveSettings(quality, floating, theme);
    }

    public Cursor getSettings() {
        return db.getSettings();
    }
}