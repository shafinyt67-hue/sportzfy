package com.app.streamplayer.activities;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.app.streamplayer.databinding.ActivityAboutBinding;
import com.app.streamplayer.preferences.PreferencesManager;
import com.app.streamplayer.utils.UrlValidator;

public class AboutActivity extends AppCompatActivity {
    private ActivityAboutBinding binding;
    private PreferencesManager prefs;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAboutBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        prefs = new PreferencesManager(this);

        setSupportActionBar(binding.toolbar);
        binding.toolbar.setNavigationIcon(android.R.drawable.ic_media_previous);
        binding.toolbar.setNavigationOnClickListener(v -> finish());

        binding.inputUpdateUrl.setText(prefs.getUpdateUrl());
        boolean approved = prefs.isUpdateApproved();
        binding.inputUpdateUrl.setEnabled(!approved);
        binding.buttonApproveUpdate.setEnabled(!approved);
        if (approved) {
            binding.buttonApproveUpdate.setText("Approved");
        }

        binding.buttonApproveUpdate.setOnClickListener(v -> {
            String url = binding.inputUpdateUrl.getText() == null ? "" : binding.inputUpdateUrl.getText().toString().trim();
            if (!UrlValidator.isValidHttpUrl(url)) {
                Toast.makeText(this, "Invalid URL", Toast.LENGTH_SHORT).show();
                return;
            }
            prefs.saveUpdateUrl(url, true);
            binding.inputUpdateUrl.setEnabled(false);
            binding.buttonApproveUpdate.setEnabled(false);
            binding.buttonApproveUpdate.setText("Approved");
            Toast.makeText(this, "Approved", Toast.LENGTH_SHORT).show();
        });

        binding.buttonOpenUpdate.setOnClickListener(v -> {
            String url = prefs.getUpdateUrl();
            if (url == null || url.isEmpty()) {
                Toast.makeText(this, "Update URL not configured", Toast.LENGTH_SHORT).show();
                return;
            }
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        });
    }
}