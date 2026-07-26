package com.app.streamplayer.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.media3.common.PlaybackException;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;

import com.app.streamplayer.R;
import com.app.streamplayer.player.PlayerManager;
import com.app.streamplayer.preferences.PreferencesManager;

import java.util.HashMap;

public class PlayerActivity extends AppCompatActivity {
    public static final String EXTRA_CHANNEL_NAME = "channelName";
    public static final String EXTRA_STREAM_URL = "streamUrl";
    public static final String EXTRA_COOKIE = "cookie";
    public static final String EXTRA_REFERER = "referer";
    public static final String EXTRA_ORIGIN = "origin";
    public static final String EXTRA_DRM_LICENSE = "drmLicense";
    public static final String EXTRA_DRM_TYPE = "drmType";

    private final PlayerManager playerManager = new PlayerManager();
    private ExoPlayer player;
    private ProgressBar loadingBar;
    private PlayerView playerView;
    private PreferencesManager prefs;
    private String streamUrl;
    private String channelName;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_player);
        loadingBar = findViewById(R.id.loadingBar);
        playerView = findViewById(R.id.playerView);
        prefs = new PreferencesManager(this);

        streamUrl = getIntent().getStringExtra(EXTRA_STREAM_URL);
        channelName = getIntent().getStringExtra(EXTRA_CHANNEL_NAME);
        if (streamUrl == null || streamUrl.isEmpty()) {
            Toast.makeText(this, "Invalid URL", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        loadingBar.setVisibility(View.VISIBLE);

        HashMap<String, String> headers = new HashMap<>();
        putIfNotEmpty(headers, "Cookie", getIntent().getStringExtra(EXTRA_COOKIE));
        putIfNotEmpty(headers, "Referer", getIntent().getStringExtra(EXTRA_REFERER));
        putIfNotEmpty(headers, "Origin", getIntent().getStringExtra(EXTRA_ORIGIN));

        player = playerManager.build(
                this,
                streamUrl,
                headers,
                getIntent().getStringExtra(EXTRA_DRM_LICENSE),
                getIntent().getStringExtra(EXTRA_DRM_TYPE)
        );
        playerView.setPlayer(player);

        long lastPosition = prefs.getLastPlaybackPosition(streamUrl);
        if (lastPosition > 0) {
            player.seekTo(lastPosition);
        }

        player.addListener(new Player.Listener() {
            @Override
            public void onPlaybackStateChanged(int playbackState) {
                if (playbackState == Player.STATE_BUFFERING) {
                    loadingBar.setVisibility(View.VISIBLE);
                } else {
                    loadingBar.setVisibility(View.GONE);
                }
            }

            @Override
            public void onPlayerError(PlaybackException error) {
                loadingBar.setVisibility(View.GONE);
                Toast.makeText(PlayerActivity.this, "Playback Failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void putIfNotEmpty(HashMap<String, String> map, String key, String value) {
        if (value != null && !value.trim().isEmpty()) {
            map.put(key, value.trim());
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (player != null) {
            prefs.saveLastPlayback(channelName == null ? "" : channelName, streamUrl, player.getCurrentPosition());
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (player != null) {
            prefs.saveLastPlayback(channelName == null ? "" : channelName, streamUrl, player.getCurrentPosition());
        }
        playerManager.release();
    }
}