package com.app.streamplayer.activities;

import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.app.streamplayer.databinding.ActivityNoticeBinding;
import com.app.streamplayer.preferences.PreferencesManager;

public class NoticeActivity extends AppCompatActivity {
    private ActivityNoticeBinding binding;
    private PreferencesManager prefs;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityNoticeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        prefs = new PreferencesManager(this);

        setSupportActionBar(binding.toolbar);
        binding.toolbar.setNavigationIcon(android.R.drawable.ic_media_previous);
        binding.toolbar.setNavigationOnClickListener(v -> finish());

        binding.inputTitle.setText(prefs.getNoticeTitle());
        binding.inputDescription.setText(prefs.getNoticeDescription());

        binding.buttonSave.setOnClickListener(v -> {
            String title = binding.inputTitle.getText() == null ? "" : binding.inputTitle.getText().toString().trim();
            String desc = binding.inputDescription.getText() == null ? "" : binding.inputDescription.getText().toString().trim();
            prefs.saveNotice(title, desc);
            Toast.makeText(this, "Notice saved", Toast.LENGTH_SHORT).show();
        });
    }
}