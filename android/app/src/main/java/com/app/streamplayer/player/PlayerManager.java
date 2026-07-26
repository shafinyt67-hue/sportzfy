package com.app.streamplayer.player;

import android.content.Context;
import android.net.Uri;

import androidx.media3.common.C;
import androidx.media3.common.MediaItem;
import androidx.media3.common.MimeTypes;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.datasource.DefaultHttpDataSource;
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory;

import java.util.HashMap;
import java.util.Map;

public class PlayerManager {
    private ExoPlayer player;

    public ExoPlayer build(Context context, String url, Map<String, String> headers, String drmLicense, String drmType) {
        DefaultHttpDataSource.Factory dataSourceFactory = new DefaultHttpDataSource.Factory();
        if (headers != null) {
            dataSourceFactory.setDefaultRequestProperties(headers);
        }

        player = new ExoPlayer.Builder(context)
                .setMediaSourceFactory(new DefaultMediaSourceFactory(dataSourceFactory))
                .build();

        String lower = url.toLowerCase();
        String mimeType;
        if (lower.contains(".m3u8")) {
            mimeType = MimeTypes.APPLICATION_M3U8;
        } else if (lower.contains(".mpd")) {
            mimeType = MimeTypes.APPLICATION_MPD;
        } else if (lower.contains(".mp4")) {
            mimeType = MimeTypes.VIDEO_MP4;
        } else {
            mimeType = MimeTypes.VIDEO_MP2T;
        }

        MediaItem.Builder itemBuilder = new MediaItem.Builder()
                .setUri(Uri.parse(url))
                .setMimeType(mimeType);

        if ("ClearKey".equalsIgnoreCase(drmType) && drmLicense != null && !drmLicense.isEmpty()) {
            itemBuilder.setDrmConfiguration(
                    new MediaItem.DrmConfiguration.Builder(C.CLEARKEY_UUID)
                            .setLicenseUri(drmLicense)
                            .setForceDefaultLicenseUri(false)
                            .build()
            );
        }

        player.setMediaItem(itemBuilder.build());
        player.prepare();
        player.setPlayWhenReady(true);
        return player;
    }

    public void release() {
        if (player != null) {
            player.release();
            player = null;
        }
    }
}