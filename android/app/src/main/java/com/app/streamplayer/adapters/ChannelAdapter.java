package com.app.streamplayer.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.app.streamplayer.R;
import com.app.streamplayer.models.ChannelModel;
import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.List;

public class ChannelAdapter extends RecyclerView.Adapter<ChannelAdapter.VH> {
    public interface OnChannelListener {
        void onClick(ChannelModel channel);
        void onLongClick(ChannelModel channel);
    }

    private final OnChannelListener listener;
    private final List<ChannelModel> items = new ArrayList<>();

    public ChannelAdapter(OnChannelListener listener) {
        this.listener = listener;
    }

    public void submit(List<ChannelModel> data) {
        items.clear();
        items.addAll(data);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new VH(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_channel, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        ChannelModel item = items.get(position);
        holder.name.setText(item.channelName);
        holder.group.setText(item.groupName == null || item.groupName.isEmpty() ? "Ungrouped" : item.groupName);
        if (item.logo != null && !item.logo.isEmpty()) {
            Glide.with(holder.logo.getContext()).load(item.logo).placeholder(android.R.drawable.ic_menu_gallery).into(holder.logo);
        } else {
            holder.logo.setImageResource(android.R.drawable.ic_menu_gallery);
        }
        holder.itemView.setOnClickListener(v -> listener.onClick(item));
        holder.itemView.setOnLongClickListener(v -> {
            listener.onLongClick(item);
            return true;
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        ImageView logo;
        TextView name;
        TextView group;

        VH(@NonNull View itemView) {
            super(itemView);
            logo = itemView.findViewById(R.id.imageLogo);
            name = itemView.findViewById(R.id.textChannelName);
            group = itemView.findViewById(R.id.textGroup);
        }
    }
}