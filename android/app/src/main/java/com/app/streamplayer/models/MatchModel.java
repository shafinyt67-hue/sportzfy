package com.app.streamplayer.models;

public class MatchModel {
    public String tournament;
    public String date;
    public String time;
    public String homeTeam;
    public String awayTeam;
    public String status;

    public MatchModel(String tournament, String date, String time, String homeTeam, String awayTeam, String status) {
        this.tournament = tournament;
        this.date = date;
        this.time = time;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.status = status;
    }
}