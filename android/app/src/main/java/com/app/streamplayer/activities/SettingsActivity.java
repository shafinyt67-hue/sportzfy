package com.app.streamplayer.activities;

import android.database.Cursor;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.app.streamplayer.databinding.ActivitySettingsBinding;
import com.app.streamplayer.preferences.PreferencesManager;
import com.app.streamplayer.repository.StreamRepository;

public class SettingsActivity extends AppCompatActivity {
    private ActivitySettingsBinding binding;
    private PreferencesManager prefs;
    private StreamRepository repository;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySettingsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        prefs = new PreferencesManager(this);
        repository = new StreamRepository(this);

        setSupportActionBar(binding.toolbar);
        binding.toolbar.setNavigationIcon(android.R.drawable.ic_media_previous);
        binding.toolbar.setNavigationOnClickListener(v -> finish());

        String[] qualities = {"Auto", "240p", "360p", "480p", "720p", "1080p"};
        binding.spinnerQuality.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, qualities));

        String current = prefs.getVideoQuality();
        for (int i = 0; i < qualities.length; i++) {
            if (qualities[i].equals(current)) {
                binding.spinnerQuality.setSelection(i);
                break;
            }
        }
        binding.switchFloating.setChecked(prefs.isFloatingPlayerEnabled());

        binding.spinnerQuality.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(android.widget.AdapterView<?> parent, android.view.View view, int position, long id) {
                String q = qualities[position];
                prefs.setVideoQuality(q);
                repository.saveSettings(q, binding.switchFloating.isChecked(), prefs.getTheme());
            }

            @Override
            public void onNothingSelected(android.widget.AdapterView<?> parent) {
            }
        });

        binding.switchFloating.setOnCheckedChangeListener((buttonView, isChecked) -> {
            prefs.setFloatingPlayer(isChecked);
            repository.saveSettings(prefs.getVideoQuality(), isChecked, prefs.getTheme());
            Toast.makeText(this, isChecked ? "Floating player enabled" : "Floating player disabled", Toast.LENGTH_SHORT).show();
        });

        Cursor c = repository.getSettings();
        if (c.moveToFirst()) {
            String q = c.getString(0);
            boolean floating = c.getInt(1) == 1;
            prefs.setVideoQuality(q);
            prefs.setFloatingPlayer(floating);
        }
        c.close();
    }
}