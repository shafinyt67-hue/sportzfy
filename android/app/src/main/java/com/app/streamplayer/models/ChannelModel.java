package com.app.streamplayer.models;

public class ChannelModel {
    public long id;
    public long playlistId;
    public String channelName;
    public String logo;
    public String streamUrl;
    public String groupName;
    public int favorite;

    public ChannelModel(long id, long playlistId, String channelName, String logo, String streamUrl, String groupName, int favorite) {
        this.id = id;
        this.playlistId = playlistId;
        this.channelName = channelName;
        this.logo = logo;
        this.streamUrl = streamUrl;
        this.groupName = groupName;
        this.favorite = favorite;
    }
}