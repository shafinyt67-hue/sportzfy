package com.app.streamplayer.parser;

import com.app.streamplayer.models.ChannelModel;

import java.util.ArrayList;
import java.util.List;

public class M3uParser {

    public static List<ChannelModel> parse(long playlistId, String rawText) {
        List<ChannelModel> channels = new ArrayList<>();
        String[] lines = rawText.split("\\r?\\n");
        String name = "";
        String logo = "";
        String group = "";

        for (String rawLine : lines) {
            String line = rawLine.trim();
            if (line.isEmpty()) {
                continue;
            }
            if (line.startsWith("#EXTINF:")) {
                int commaIndex = line.lastIndexOf(',');
                if (commaIndex >= 0 && commaIndex + 1 < line.length()) {
                    name = line.substring(commaIndex + 1).trim();
                } else {
                    name = "Channel";
                }
                logo = extractAttr(line, "tvg-logo");
                group = extractAttr(line, "group-title");
                continue;
            }
            if (!line.startsWith("#") && (line.startsWith("http://") || line.startsWith("https://"))) {
                channels.add(new ChannelModel(
                        0,
                        playlistId,
                        name.isEmpty() ? "Channel" : name,
                        logo,
                        line,
                        group,
                        0
                ));
                name = "";
                logo = "";
                group = "";
            }
        }

        return channels;
    }

    private static String extractAttr(String line, String key) {
        String token = key + "=\"";
        int start = line.indexOf(token);
        if (start < 0) return "";
        start += token.length();
        int end = line.indexOf('"', start);
        if (end < 0) return "";
        return line.substring(start, end);
    }
}