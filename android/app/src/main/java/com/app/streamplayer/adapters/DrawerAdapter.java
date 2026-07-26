package com.app.streamplayer.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.app.streamplayer.R;
import com.app.streamplayer.models.DrawerItemModel;

import java.util.ArrayList;
import java.util.List;

public class DrawerAdapter extends RecyclerView.Adapter<DrawerAdapter.VH> {
    public interface OnItemClick {
        void onClick(DrawerItemModel item);
    }

    private final List<DrawerItemModel> items = new ArrayList<>();
    private final OnItemClick onItemClick;

    public DrawerAdapter(OnItemClick onItemClick) {
        this.onItemClick = onItemClick;
    }

    public void submit(List<DrawerItemModel> data) {
        items.clear();
        items.addAll(data);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new VH(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_drawer, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        DrawerItemModel item = items.get(position);
        holder.text.setText(item.title);
        holder.icon.setImageResource(item.iconRes);
        holder.itemView.setOnClickListener(v -> onItemClick.onClick(item));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        ImageView icon;
        TextView text;

        VH(@NonNull View itemView) {
            super(itemView);
            icon = itemView.findViewById(R.id.icon);
            text = itemView.findViewById(R.id.text);
        }
    }
}