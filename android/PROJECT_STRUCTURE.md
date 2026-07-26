# Android Blueprint Structure

Package: `com.app.streamplayer`

```
com.app.streamplayer
├── activities
├── adapters
├── database
├── models
├── parser
├── network
├── player
├── repository
├── services
├── fragments
├── utils
├── preferences
├── drawable
├── layouts
└── values
```

Activities
- SplashActivity
- MainActivity
- PlayerActivity
- NetworkStreamActivity
- PlaylistActivity
- ChannelActivity
- SettingsActivity
- NoticeActivity
- JoinActivity
- AboutActivity

Fragments
- HomeFragment
- CategoriesFragment
- HighlightsFragment

Core DB Tables (`StreamPlayer.db`, v1)
- Playlist(id, playlist_name, playlist_url, approved, created_date)
- Links(id, website_link, telegram_link, approved)
- Settings(id, video_quality, floating_player, theme)

SharedPreferences Keys
- video_quality
- theme
- floating_player
- last_opened_playlist

Approved Lock Rule
- Any approved item becomes read-only and non-deletable.
