package com.app.streamplayer.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.app.streamplayer.adapters.ChannelAdapter;
import com.app.streamplayer.databinding.ActivityChannelBinding;
import com.app.streamplayer.models.ChannelModel;
import com.app.streamplayer.models.PlaylistModel;
import com.app.streamplayer.repository.StreamRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ChannelActivity extends AppCompatActivity {
    private ActivityChannelBinding binding;
    private StreamRepository repository;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private ChannelAdapter adapter;
    private List<ChannelModel> allChannels = new ArrayList<>();
    private long playlistId;
    private String playlistName;
    private String playlistUrl;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityChannelBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        repository = new StreamRepository(this);

        playlistId = getIntent().getLongExtra("playlistId", -1);
        playlistName = getIntent().getStringExtra("playlistName");
        playlistUrl = getIntent().getStringExtra("playlistUrl");
        if (playlistName == null) {
            playlistName = "Channels";
        }

        setSupportActionBar(binding.toolbar);
        binding.toolbar.setNavigationIcon(android.R.drawable.ic_media_previous);
        binding.toolbar.setNavigationOnClickListener(v -> finish());
        binding.toolbar.setTitle(playlistName == null ? "Channels" : playlistName);

        adapter = new ChannelAdapter(new ChannelAdapter.OnChannelListener() {
            @Override
            public void onClick(ChannelModel channel) {
                Intent intent = new Intent(ChannelActivity.this, PlayerActivity.class);
                intent.putExtra(PlayerActivity.EXTRA_CHANNEL_NAME, channel.channelName);
                intent.putExtra(PlayerActivity.EXTRA_STREAM_URL, channel.streamUrl);
                startActivity(intent);
            }

            @Override
            public void onLongClick(ChannelModel channel) {
                repository.setFavorite(channel.id, true);
                Toast.makeText(ChannelActivity.this, "Added to favorites", Toast.LENGTH_SHORT).show();
            }
        });

        binding.recyclerChannels.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerChannels.setAdapter(adapter);

        binding.swipeRefresh.setOnRefreshListener(this::refreshPlaylist);
        binding.inputSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterChannels(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        loadChannels();
    }

    private void loadChannels() {
        executor.execute(() -> {
            allChannels = repository.getChannels(playlistId);
            runOnUiThread(() -> {
                adapter.submit(allChannels);
                binding.swipeRefresh.setRefreshing(false);
                if (allChannels.isEmpty()) {
                    Toast.makeText(this, "No Channels Available", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }

    private void filterChannels(String query) {
        String lower = query.toLowerCase().trim();
        if (lower.isEmpty()) {
            adapter.submit(allChannels);
            return;
        }
        List<ChannelModel> filtered = new ArrayList<>();
        for (ChannelModel channel : allChannels) {
            String group = channel.groupName == null ? "" : channel.groupName;
            if (channel.channelName.toLowerCase().contains(lower) || group.toLowerCase().contains(lower) || playlistName.toLowerCase().contains(lower)) {
                filtered.add(channel);
            }
        }
        adapter.submit(filtered);
    }

    private void refreshPlaylist() {
        if (playlistId < 0 || playlistUrl == null) {
            binding.swipeRefresh.setRefreshing(false);
            return;
        }

        executor.execute(() -> {
            try {
                repository.refreshPlaylistChannels(new PlaylistModel(playlistId, playlistName, playlistUrl, 1, "", "M3U"));
                allChannels = repository.getChannels(playlistId);
                runOnUiThread(() -> {
                    adapter.submit(allChannels);
                    binding.swipeRefresh.setRefreshing(false);
                });
            } catch (Exception e) {
                runOnUiThread(() -> {
                    binding.swipeRefresh.setRefreshing(false);
                    Toast.makeText(this, "Connection Failed", Toast.LENGTH_SHORT).show();
                });
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        executor.shutdownNow();
    }
}