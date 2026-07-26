package com.app.streamplayer.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.app.streamplayer.R;
import com.app.streamplayer.models.PlaylistModel;

import java.util.ArrayList;
import java.util.List;

public class PlaylistAdapter extends RecyclerView.Adapter<PlaylistAdapter.VH> {
    public interface OnPlaylistClickListener {
        void onClick(PlaylistModel playlist);
    }

    private final OnPlaylistClickListener listener;
    private final List<PlaylistModel> items = new ArrayList<>();

    public PlaylistAdapter(OnPlaylistClickListener listener) {
        this.listener = listener;
    }

    public void submit(List<PlaylistModel> data) {
        items.clear();
        items.addAll(data);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_playlist, parent, false);
        return new VH(view);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        PlaylistModel item = items.get(position);
        holder.name.setText(item.playlistName);
        holder.url.setText(item.playlistUrl);
        holder.itemView.setOnClickListener(v -> listener.onClick(item));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        TextView name;
        TextView url;

        VH(@NonNull View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.textPlaylistName);
            url = itemView.findViewById(R.id.textPlaylistUrl);
        }
    }
}