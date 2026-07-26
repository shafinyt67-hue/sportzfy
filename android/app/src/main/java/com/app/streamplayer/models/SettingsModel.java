package com.app.streamplayer.models;

public class SettingsModel {
    public String videoQuality;
    public String theme;
    public boolean floatingPlayer;

    public SettingsModel(String videoQuality, String theme, boolean floatingPlayer) {
        this.videoQuality = videoQuality;
        this.theme = theme;
        this.floatingPlayer = floatingPlayer;
    }
}