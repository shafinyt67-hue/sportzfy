package com.app.streamplayer.activities;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.app.streamplayer.R;
import com.app.streamplayer.adapters.PlaylistAdapter;
import com.app.streamplayer.databinding.ActivityPlaylistBinding;
import com.app.streamplayer.models.PlaylistModel;
import com.app.streamplayer.preferences.PreferencesManager;
import com.app.streamplayer.repository.StreamRepository;
import com.app.streamplayer.services.PlaylistService;
import com.app.streamplayer.utils.UrlValidator;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.textfield.TextInputEditText;

import java.io.InputStream;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class PlaylistActivity extends AppCompatActivity {
    private ActivityPlaylistBinding binding;
    private PlaylistAdapter adapter;
    private StreamRepository repository;
    private PlaylistService playlistService;
    private PreferencesManager prefs;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    private final ActivityResultLauncher<Intent> filePickerLauncher =
            registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
                if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                    Uri uri = result.getData().getData();
                    if (uri != null) {
                        importLocalPlaylist(uri);
                    }
                }
            });

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityPlaylistBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        repository = new StreamRepository(this);
        playlistService = new PlaylistService(this);
        prefs = new PreferencesManager(this);

        setSupportActionBar(binding.toolbar);
        binding.toolbar.setNavigationIcon(android.R.drawable.ic_media_previous);
        binding.toolbar.setNavigationOnClickListener(v -> finish());

        adapter = new PlaylistAdapter(this::openChannels);
        binding.recyclerPlaylists.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerPlaylists.setAdapter(adapter);

        binding.swipeRefresh.setOnRefreshListener(this::refreshAllPlaylists);
        binding.fabAddPlaylist.setOnClickListener(v -> showAddPlaylistDialog());

        loadPlaylists();
    }

    private void loadPlaylists() {
        List<PlaylistModel> playlists = repository.getPlaylists();
        adapter.submit(playlists);
        binding.swipeRefresh.setRefreshing(false);
    }

    private void openChannels(PlaylistModel playlist) {
        prefs.setLastOpenedPlaylist(playlist.id);
        startActivity(new Intent(this, ChannelActivity.class)
                .putExtra("playlistId", playlist.id)
                .putExtra("playlistName", playlist.playlistName)
                .putExtra("playlistUrl", playlist.playlistUrl));
    }

    private void showAddPlaylistDialog() {
        View view = LayoutInflater.from(this).inflate(R.layout.dialog_add_playlist, null, false);
        TextInputEditText inputName = view.findViewById(R.id.inputPlaylistName);
        TextInputEditText inputUrl = view.findViewById(R.id.inputPlaylistUrl);

        new MaterialAlertDialogBuilder(this)
                .setTitle("Add Playlist")
                .setView(view)
                .setNeutralButton("Import Local", (d, w) -> pickLocalFile())
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Approved", (d, w) -> {
                    String name = inputName.getText() == null ? "" : inputName.getText().toString().trim();
                    String url = inputUrl.getText() == null ? "" : inputUrl.getText().toString().trim();
                    if (name.isEmpty()) {
                        toast("Playlist name required");
                        return;
                    }
                    if (!UrlValidator.isPlaylistUrl(url)) {
                        toast(url.isEmpty() ? "Please Enter Playlist URL" : "Invalid Playlist URL");
                        return;
                    }
                    addRemotePlaylist(name, url);
                })
                .show();
    }

    private void addRemotePlaylist(String name, String url) {
        binding.swipeRefresh.setRefreshing(true);
        executor.execute(() -> {
            try {
                String format = url.toLowerCase().contains(".m3u8") ? "M3U8" : "M3U";
                playlistService.addRemoteApproved(name, url, format);
                runOnUiThread(() -> {
                    loadPlaylists();
                    toast("Playlist approved and saved");
                });
            } catch (Exception e) {
                runOnUiThread(() -> {
                    binding.swipeRefresh.setRefreshing(false);
                    toast(e.getMessage() == null ? "Connection Failed" : e.getMessage());
                });
            }
        });
    }

    private void pickLocalFile() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        String[] types = {"audio/x-mpegurl", "application/vnd.apple.mpegurl", "text/plain"};
        intent.putExtra(Intent.EXTRA_MIME_TYPES, types);
        filePickerLauncher.launch(intent);
    }

    private void importLocalPlaylist(Uri uri) {
        binding.swipeRefresh.setRefreshing(true);
        executor.execute(() -> {
            try {
                InputStream input = getContentResolver().openInputStream(uri);
                if (input == null) {
                    throw new IllegalStateException("Unsupported Playlist Format");
                }
                String name = "Local Playlist";
                playlistService.addLocalApproved(name, "imported.m3u", input);
                runOnUiThread(() -> {
                    loadPlaylists();
                    toast("Local playlist approved and imported");
                });
            } catch (Exception e) {
                runOnUiThread(() -> {
                    binding.swipeRefresh.setRefreshing(false);
                    toast(e.getMessage() == null ? "Unsupported Playlist Format" : e.getMessage());
                });
            }
        });
    }

    private void refreshAllPlaylists() {
        executor.execute(() -> {
            try {
                List<PlaylistModel> playlists = repository.getPlaylists();
                for (PlaylistModel playlist : playlists) {
                    repository.refreshPlaylistChannels(playlist);
                }
                runOnUiThread(() -> {
                    binding.swipeRefresh.setRefreshing(false);
                    loadPlaylists();
                });
            } catch (Exception e) {
                runOnUiThread(() -> {
                    binding.swipeRefresh.setRefreshing(false);
                    toast("Connection Failed");
                });
            }
        });
    }

    private void toast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        executor.shutdownNow();
    }
}