package com.app.streamplayer.models;

public class HighlightModel {
    public String tournament;
    public String date;
    public String teamA;
    public String teamB;

    public HighlightModel(String tournament, String date, String teamA, String teamB) {
        this.tournament = tournament;
        this.date = date;
        this.teamA = teamA;
        this.teamB = teamB;
    }
}