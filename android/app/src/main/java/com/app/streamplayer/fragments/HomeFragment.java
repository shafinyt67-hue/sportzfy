package com.app.streamplayer.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.app.streamplayer.R;
import com.app.streamplayer.activities.NetworkStreamActivity;
import com.app.streamplayer.adapters.MatchAdapter;
import com.app.streamplayer.models.MatchModel;

import java.util.ArrayList;
import java.util.List;

public class HomeFragment extends Fragment {
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        RecyclerView recycler = view.findViewById(R.id.recyclerMatches);
        recycler.setLayoutManager(new LinearLayoutManager(requireContext()));
        MatchAdapter adapter = new MatchAdapter();
        recycler.setAdapter(adapter);

        List<MatchModel> list = new ArrayList<>();
        list.add(new MatchModel("Live Match", "Today", "20:30", "Team A", "Team B", "Live"));
        list.add(new MatchModel("Upcoming Match", "Tomorrow", "18:00", "Team C", "Team D", "Upcoming"));
        adapter.submit(list);

        recycler.addOnItemTouchListener(new RecyclerItemClickListener(requireContext(), recycler, new RecyclerItemClickListener.OnItemClickListener() {
            @Override
            public void onItemClick(View v, int position) {
                startActivity(new Intent(requireContext(), NetworkStreamActivity.class));
            }

            @Override
            public void onLongItemClick(View v, int position) {
            }
        }));
    }
}