package com.app.streamplayer.activities;

import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.app.streamplayer.databinding.ActivityJoinBinding;
import com.app.streamplayer.preferences.PreferencesManager;
import com.app.streamplayer.utils.UrlValidator;

public class JoinActivity extends AppCompatActivity {
    private ActivityJoinBinding binding;
    private PreferencesManager prefs;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityJoinBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        prefs = new PreferencesManager(this);

        setSupportActionBar(binding.toolbar);
        binding.toolbar.setNavigationIcon(android.R.drawable.ic_media_previous);
        binding.toolbar.setNavigationOnClickListener(v -> finish());

        boolean approved = prefs.isJoinApproved();
        binding.inputTelegram.setText(prefs.getJoinTelegram());
        binding.inputTelegram.setEnabled(!approved);
        binding.buttonApprove.setEnabled(!approved);
        if (approved) {
            binding.buttonApprove.setText("Approved");
        }

        binding.buttonApprove.setOnClickListener(v -> {
            String telegram = binding.inputTelegram.getText() == null ? "" : binding.inputTelegram.getText().toString().trim();
            if (!UrlValidator.isValidHttpUrl(telegram)) {
                Toast.makeText(this, "Invalid URL", Toast.LENGTH_SHORT).show();
                return;
            }
            prefs.saveJoinUs(telegram, true);
            binding.inputTelegram.setEnabled(false);
            binding.buttonApprove.setEnabled(false);
            binding.buttonApprove.setText("Approved");
            Toast.makeText(this, "Approved", Toast.LENGTH_SHORT).show();
        });
    }
}