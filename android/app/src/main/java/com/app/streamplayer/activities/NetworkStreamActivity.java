package com.app.streamplayer.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.media3.common.PlaybackException;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;

import com.app.streamplayer.R;
import com.app.streamplayer.player.PlayerManager;
import com.app.streamplayer.utils.UrlValidator;
import com.google.android.material.textfield.TextInputEditText;

import java.util.HashMap;
import java.util.Map;

public class NetworkStreamActivity extends AppCompatActivity {
    private TextInputEditText inputStreamUrl;
    private TextInputEditText inputCookie;
    private TextInputEditText inputReferer;
    private TextInputEditText inputOrigin;
    private TextInputEditText inputDrmLicense;
    private Spinner spinnerDrmType;
    private ProgressBar loadingBar;
    private PlayerView playerView;

    private final PlayerManager playerManager = new PlayerManager();
    private ExoPlayer player;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_network_stream);

        androidx.appcompat.widget.Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        toolbar.setNavigationIcon(android.R.drawable.ic_media_previous);
        toolbar.setNavigationOnClickListener(v -> finish());

        inputStreamUrl = findViewById(R.id.inputStreamUrl);
        inputCookie = findViewById(R.id.inputCookie);
        inputReferer = findViewById(R.id.inputReferer);
        inputOrigin = findViewById(R.id.inputOrigin);
        inputDrmLicense = findViewById(R.id.inputDrmLicense);
        spinnerDrmType = findViewById(R.id.spinnerDrmType);
        loadingBar = findViewById(R.id.loadingBar);
        playerView = findViewById(R.id.playerView);

        ArrayAdapter<String> drmAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, new String[]{"Default", "ClearKey"});
        spinnerDrmType.setAdapter(drmAdapter);

        findViewById(R.id.buttonPlay).setOnClickListener(v -> playStream());
    }

    private void playStream() {
        String streamUrl = value(inputStreamUrl);
        if (streamUrl.isEmpty()) {
            toast("Please enter stream URL");
            return;
        }
        if (!UrlValidator.isValidHttpUrl(streamUrl)) {
            toast("Invalid URL");
            return;
        }
        String lower = streamUrl.toLowerCase();
        if (!(lower.contains(".m3u8") || lower.contains(".ts") || lower.contains(".mp4") || lower.contains(".mpd"))) {
            toast("Unsupported stream");
            return;
        }

        releasePlayer();
        loadingBar.setVisibility(View.VISIBLE);

        Map<String, String> headers = new HashMap<>();
        if (!value(inputCookie).isEmpty()) headers.put("Cookie", value(inputCookie));
        if (!value(inputReferer).isEmpty()) headers.put("Referer", value(inputReferer));
        if (!value(inputOrigin).isEmpty()) headers.put("Origin", value(inputOrigin));

        try {
            player = playerManager.build(this, streamUrl, headers, value(inputDrmLicense), String.valueOf(spinnerDrmType.getSelectedItem()));
            playerView.setPlayer(player);
            player.addListener(new Player.Listener() {
                @Override
                public void onPlaybackStateChanged(int playbackState) {
                    if (playbackState == Player.STATE_BUFFERING) {
                        loadingBar.setVisibility(View.VISIBLE);
                    } else if (playbackState == Player.STATE_READY) {
                        loadingBar.setVisibility(View.GONE);
                    } else if (playbackState == Player.STATE_ENDED) {
                        loadingBar.setVisibility(View.GONE);
                    }
                }

                @Override
                public void onPlayerError(PlaybackException error) {
                    loadingBar.setVisibility(View.GONE);
                    String message = error.getMessage() == null ? "Playback Failed" : error.getMessage();
                    if (message.toLowerCase().contains("source")) {
                        toast("Unable to connect");
                    } else {
                        toast("Playback Failed");
                    }
                }
            });
        } catch (Exception e) {
            loadingBar.setVisibility(View.GONE);
            toast("Unable to connect");
        }
    }

    private String value(TextInputEditText editText) {
        return editText.getText() == null ? "" : editText.getText().toString().trim();
    }

    private void toast(String msg) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onStop() {
        super.onStop();
        releasePlayer();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        releasePlayer();
    }

    private void releasePlayer() {
        if (player != null) {
            player.release();
            player = null;
        }
        playerManager.release();
    }
}