package com.app.streamplayer.activities;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.app.streamplayer.R;
import com.app.streamplayer.adapters.DrawerAdapter;
import com.app.streamplayer.fragments.CategoriesFragment;
import com.app.streamplayer.fragments.HighlightsFragment;
import com.app.streamplayer.fragments.HomeFragment;
import com.app.streamplayer.models.DrawerItemModel;
import com.app.streamplayer.preferences.PreferencesManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    private DrawerLayout drawerLayout;
    private PreferencesManager prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        prefs = new PreferencesManager(this);

        drawerLayout = findViewById(R.id.drawerLayout);
        RecyclerView drawerRecycler = findViewById(R.id.recyclerDrawer);
        drawerRecycler.setLayoutManager(new LinearLayoutManager(this));

        DrawerAdapter drawerAdapter = new DrawerAdapter(this::handleDrawerItem);
        drawerRecycler.setAdapter(drawerAdapter);
        drawerAdapter.submit(buildDrawerItems());

        androidx.appcompat.widget.Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        toolbar.setNavigationIcon(android.R.drawable.ic_menu_sort_by_size);
        toolbar.setNavigationOnClickListener(v -> drawerLayout.openDrawer(GravityCompat.START));
        toolbar.setOnMenuItemClickListener(item -> {
            if (item.getItemId() == R.id.action_search) {
                startActivity(new Intent(this, PlaylistActivity.class));
                return true;
            }
            if (item.getItemId() == R.id.action_favorite) {
                startActivity(new Intent(this, ChannelActivity.class).putExtra("playlistId", prefs.getLastOpenedPlaylist()));
                return true;
            }
            return false;
        });

        BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setOnItemSelectedListener(item -> {
            if (item.getItemId() == R.id.nav_home) {
                switchFragment(new HomeFragment());
                return true;
            }
            if (item.getItemId() == R.id.nav_categories) {
                switchFragment(new CategoriesFragment());
                return true;
            }
            if (item.getItemId() == R.id.nav_highlights) {
                switchFragment(new HighlightsFragment());
                return true;
            }
            return false;
        });
        bottomNav.setSelectedItemId(R.id.nav_home);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
                    drawerLayout.closeDrawer(GravityCompat.START);
                } else {
                    showExitDialog();
                }
            }
        });
    }

    private void switchFragment(Fragment fragment) {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit();
    }

    private List<DrawerItemModel> buildDrawerItems() {
        List<DrawerItemModel> items = new ArrayList<>();
        items.add(new DrawerItemModel("Network Stream", android.R.drawable.ic_menu_upload));
        items.add(new DrawerItemModel("Playlists", android.R.drawable.ic_menu_agenda));
        items.add(new DrawerItemModel("Floating Player", android.R.drawable.ic_menu_crop));
        items.add(new DrawerItemModel("Video Quality Setting", android.R.drawable.ic_menu_manage));
        items.add(new DrawerItemModel("Crash Log Dialog", android.R.drawable.ic_menu_info_details));
        items.add(new DrawerItemModel("Notice", android.R.drawable.ic_dialog_info));
        items.add(new DrawerItemModel("Join Us", android.R.drawable.ic_menu_send));
        items.add(new DrawerItemModel("Copyright", android.R.drawable.ic_menu_info_details));
        items.add(new DrawerItemModel("Share Our App", android.R.drawable.ic_menu_share));
        items.add(new DrawerItemModel("Email", android.R.drawable.ic_dialog_email));
        items.add(new DrawerItemModel("Update App", android.R.drawable.ic_popup_sync));
        items.add(new DrawerItemModel("Exit", android.R.drawable.ic_lock_power_off));
        return items;
    }

    private void handleDrawerItem(@NonNull DrawerItemModel item) {
        drawerLayout.closeDrawer(GravityCompat.START);
        switch (item.title) {
            case "Network Stream":
                startActivity(new Intent(this, NetworkStreamActivity.class));
                break;
            case "Playlists":
                startActivity(new Intent(this, PlaylistActivity.class));
                break;
            case "Floating Player":
                boolean enabled = !prefs.isFloatingPlayerEnabled();
                prefs.setFloatingPlayer(enabled);
                Toast.makeText(this, enabled ? "Floating Player Enabled" : "Floating Player Disabled", Toast.LENGTH_SHORT).show();
                break;
            case "Video Quality Setting":
                startActivity(new Intent(this, SettingsActivity.class));
                break;
            case "Crash Log Dialog":
                showCrashLogDialog();
                break;
            case "Notice":
                startActivity(new Intent(this, NoticeActivity.class));
                break;
            case "Join Us":
                startActivity(new Intent(this, JoinActivity.class));
                break;
            case "Copyright":
                startActivity(new Intent(this, AboutActivity.class));
                break;
            case "Share Our App":
                Intent share = new Intent(Intent.ACTION_SEND);
                share.setType("text/plain");
                share.putExtra(Intent.EXTRA_TEXT, "Download StreamPlayer: https://example.com");
                startActivity(Intent.createChooser(share, "Share App"));
                break;
            case "Email":
                Intent email = new Intent(Intent.ACTION_SENDTO);
                email.setData(Uri.parse("mailto:support@streamplayer.app?subject=Support"));
                startActivity(email);
                break;
            case "Update App":
                openUpdateUrl();
                break;
            case "Exit":
                showExitDialog();
                break;
            default:
                break;
        }
    }

    private void showCrashLogDialog() {
        AlertDialog dialog = new MaterialAlertDialogBuilder(this)
                .setTitle("Crash Log")
                .setMessage("No critical crash logs available.")
                .setPositiveButton("Close", null)
                .create();
        dialog.show();
    }

    private void openUpdateUrl() {
        String updateUrl = prefs.getUpdateUrl();
        if (updateUrl == null || updateUrl.isEmpty()) {
            Toast.makeText(this, "Update URL not configured", Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(updateUrl)));
        } catch (ActivityNotFoundException ex) {
            Toast.makeText(this, "No browser found", Toast.LENGTH_SHORT).show();
        }
    }

    private void showExitDialog() {
        new MaterialAlertDialogBuilder(this)
                .setTitle("Exit Application?")
                .setMessage("Are you sure you want to exit?")
                .setPositiveButton("Yes", (d, w) -> finishAffinity())
                .setNegativeButton("No", null)
                .show();
    }
}