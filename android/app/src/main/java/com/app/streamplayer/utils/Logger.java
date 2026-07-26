package com.app.streamplayer.utils;

import android.util.Log;

public class Logger {
    private static final String TAG = "StreamPlayer";

    public static void d(String message) {
        Log.d(TAG, message);
    }

    public static void e(String message, Throwable throwable) {
        Log.e(TAG, message, throwable);
    }
}