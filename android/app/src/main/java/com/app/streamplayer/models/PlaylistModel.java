package com.app.streamplayer.models;

public class PlaylistModel {
    public long id;
    public String playlistName;
    public String playlistUrl;
    public int approved;
    public String createdDate;
    public String format;

    public PlaylistModel(long id, String playlistName, String playlistUrl, int approved, String createdDate, String format) {
        this.id = id;
        this.playlistName = playlistName;
        this.playlistUrl = playlistUrl;
        this.approved = approved;
        this.createdDate = createdDate;
        this.format = format;
    }
}