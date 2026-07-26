package com.app.streamplayer.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.app.streamplayer.R;
import com.app.streamplayer.models.HighlightModel;

import java.util.ArrayList;
import java.util.List;

public class HighlightAdapter extends RecyclerView.Adapter<HighlightAdapter.VH> {
    private final List<HighlightModel> items = new ArrayList<>();

    public void submit(List<HighlightModel> data) {
        items.clear();
        items.addAll(data);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new VH(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_match, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        HighlightModel item = items.get(position);
        holder.tournament.setText(item.tournament);
        holder.dateTime.setText(item.date);
        holder.teams.setText(item.teamA + " vs " + item.teamB);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        TextView tournament;
        TextView dateTime;
        TextView teams;

        VH(@NonNull View itemView) {
            super(itemView);
            tournament = itemView.findViewById(R.id.textTournament);
            dateTime = itemView.findViewById(R.id.textDateTime);
            teams = itemView.findViewById(R.id.textTeams);
        }
    }
}