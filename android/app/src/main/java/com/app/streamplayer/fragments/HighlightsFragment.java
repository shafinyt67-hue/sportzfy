package com.app.streamplayer.fragments;

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
import com.app.streamplayer.adapters.HighlightAdapter;
import com.app.streamplayer.models.HighlightModel;

import java.util.ArrayList;
import java.util.List;

public class HighlightsFragment extends Fragment {
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_highlights, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        RecyclerView recycler = view.findViewById(R.id.recyclerHighlights);
        recycler.setLayoutManager(new LinearLayoutManager(requireContext()));
        HighlightAdapter adapter = new HighlightAdapter();
        recycler.setAdapter(adapter);

        List<HighlightModel> list = new ArrayList<>();
        list.add(new HighlightModel("Championship", "2026-07-11", "Norway", "England"));
        list.add(new HighlightModel("FIFA Cup", "2026-07-12", "Argentina", "Switzerland"));
        adapter.submit(list);
    }
}