package com.app.streamplayer.network;

import java.io.IOException;
import java.util.Map;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class NetworkClient {
    private final OkHttpClient client = new OkHttpClient();

    public String downloadText(String url, Map<String, String> headers) throws IOException {
        Request.Builder builder = new Request.Builder().url(url);
        if (headers != null) {
            for (Map.Entry<String, String> entry : headers.entrySet()) {
                if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                    builder.addHeader(entry.getKey(), entry.getValue());
                }
            }
        }
        try (Response response = client.newCall(builder.build()).execute()) {
            if (!response.isSuccessful() || response.body() == null) {
                throw new IOException("Request failed: " + response.code());
            }
            return response.body().string();
        }
    }
}