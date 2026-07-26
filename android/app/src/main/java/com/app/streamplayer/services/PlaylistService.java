package com.app.streamplayer.services;

import android.content.Context;

import com.app.streamplayer.repository.StreamRepository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class PlaylistService {
    private final StreamRepository repository;

    public PlaylistService(Context context) {
        repository = new StreamRepository(context);
    }

    public long addRemoteApproved(String name, String url, String format) throws IOException {
        return repository.addRemotePlaylistApproved(name, url, format);
    }

    public long addLocalApproved(String name, String fileName, InputStream inputStream) throws IOException {
        StringBuilder builder = new StringBuilder();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        while ((line = reader.readLine()) != null) {
            builder.append(line).append('\n');
        }
        return repository.addLocalPlaylistApproved(name, "local://" + fileName, builder.toString());
    }
}