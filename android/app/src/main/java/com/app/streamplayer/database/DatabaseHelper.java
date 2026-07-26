package com.app.streamplayer.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.app.streamplayer.models.ChannelModel;
import com.app.streamplayer.models.PlaylistModel;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class DatabaseHelper extends SQLiteOpenHelper {
    public static final String DB_NAME = "StreamPlayer.db";
    public static final int DB_VERSION = 1;

    public DatabaseHelper(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE Playlist (id INTEGER PRIMARY KEY AUTOINCREMENT, playlist_name TEXT, playlist_url TEXT, approved INTEGER, created_date TEXT, format TEXT)");
        db.execSQL("CREATE TABLE Channels (id INTEGER PRIMARY KEY AUTOINCREMENT, playlist_id INTEGER, channel_name TEXT, logo TEXT, group_name TEXT, stream_url TEXT, favorite INTEGER DEFAULT 0)");
        db.execSQL("CREATE TABLE Links (id INTEGER PRIMARY KEY, website_link TEXT, telegram_link TEXT, approved INTEGER)");
        db.execSQL("CREATE TABLE Settings (id INTEGER PRIMARY KEY, video_quality TEXT, floating_player INTEGER, theme TEXT)");
        db.execSQL("INSERT INTO Links (id, website_link, telegram_link, approved) VALUES (1, '', '', 0)");
        db.execSQL("INSERT INTO Settings (id, video_quality, floating_player, theme) VALUES (1, 'Auto', 0, 'dark')");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS Playlist");
        db.execSQL("DROP TABLE IF EXISTS Channels");
        db.execSQL("DROP TABLE IF EXISTS Links");
        db.execSQL("DROP TABLE IF EXISTS Settings");
        onCreate(db);
    }

    public long insertPlaylist(String name, String url, String format, int approved) {
        ContentValues values = new ContentValues();
        values.put("playlist_name", name);
        values.put("playlist_url", url);
        values.put("approved", approved);
        values.put("created_date", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(new Date()));
        values.put("format", format);
        return getWritableDatabase().insert("Playlist", null, values);
    }

    public List<PlaylistModel> getAllPlaylists() {
        List<PlaylistModel> list = new ArrayList<>();
        Cursor c = getReadableDatabase().rawQuery("SELECT id, playlist_name, playlist_url, approved, created_date, format FROM Playlist ORDER BY id DESC", null);
        while (c.moveToNext()) {
            list.add(new PlaylistModel(
                    c.getLong(0),
                    c.getString(1),
                    c.getString(2),
                    c.getInt(3),
                    c.getString(4),
                    c.getString(5)
            ));
        }
        c.close();
        return list;
    }

    public void replaceChannels(long playlistId, List<ChannelModel> channels) {
        SQLiteDatabase db = getWritableDatabase();
        db.delete("Channels", "playlist_id=?", new String[]{String.valueOf(playlistId)});
        for (ChannelModel channel : channels) {
            ContentValues values = new ContentValues();
            values.put("playlist_id", playlistId);
            values.put("channel_name", channel.channelName);
            values.put("logo", channel.logo);
            values.put("group_name", channel.groupName);
            values.put("stream_url", channel.streamUrl);
            values.put("favorite", channel.favorite);
            db.insert("Channels", null, values);
        }
    }

    public List<ChannelModel> getChannelsByPlaylist(long playlistId) {
        List<ChannelModel> list = new ArrayList<>();
        Cursor c = getReadableDatabase().rawQuery(
                "SELECT id, playlist_id, channel_name, logo, stream_url, group_name, favorite FROM Channels WHERE playlist_id=? ORDER BY channel_name COLLATE NOCASE",
                new String[]{String.valueOf(playlistId)}
        );
        while (c.moveToNext()) {
            list.add(new ChannelModel(
                    c.getLong(0),
                    c.getLong(1),
                    c.getString(2),
                    c.getString(3),
                    c.getString(4),
                    c.getString(5),
                    c.getInt(6)
            ));
        }
        c.close();
        return list;
    }

    public void setChannelFavorite(long channelId, boolean favorite) {
        ContentValues values = new ContentValues();
        values.put("favorite", favorite ? 1 : 0);
        getWritableDatabase().update("Channels", values, "id=?", new String[]{String.valueOf(channelId)});
    }

    public void saveLinks(String website, String telegram, boolean approved) {
        ContentValues values = new ContentValues();
        values.put("website_link", website);
        values.put("telegram_link", telegram);
        values.put("approved", approved ? 1 : 0);
        getWritableDatabase().update("Links", values, "id=1", null);
    }

    public Cursor getLinks() {
        return getReadableDatabase().rawQuery("SELECT website_link, telegram_link, approved FROM Links WHERE id=1", null);
    }

    public void saveSettings(String quality, boolean floating, String theme) {
        ContentValues values = new ContentValues();
        values.put("video_quality", quality);
        values.put("floating_player", floating ? 1 : 0);
        values.put("theme", theme);
        getWritableDatabase().update("Settings", values, "id=1", null);
    }

    public Cursor getSettings() {
        return getReadableDatabase().rawQuery("SELECT video_quality, floating_player, theme FROM Settings WHERE id=1", null);
    }
}