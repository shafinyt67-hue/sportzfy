package com.app.streamplayer.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.app.streamplayer.R;
import com.app.streamplayer.activities.PlaylistActivity;
import com.app.streamplayer.adapters.CategoryAdapter;
import com.app.streamplayer.models.CategoryModel;

import java.util.ArrayList;
import java.util.List;

public class CategoriesFragment extends Fragment {
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_categories, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        RecyclerView recycler = view.findViewById(R.id.recyclerCategories);
        recycler.setLayoutManager(new GridLayoutManager(requireContext(), 2));
        CategoryAdapter adapter = new CategoryAdapter();
        recycler.setAdapter(adapter);

        List<CategoryModel> categories = new ArrayList<>();
        categories.add(new CategoryModel("Sports"));
        categories.add(new CategoryModel("Movies"));
        categories.add(new CategoryModel("News"));
        categories.add(new CategoryModel("Kids"));
        categories.add(new CategoryModel("Entertainment"));
        categories.add(new CategoryModel("Playlists"));
        adapter.submit(categories);

        recycler.addOnItemTouchListener(new RecyclerItemClickListener(requireContext(), recycler, new RecyclerItemClickListener.OnItemClickListener() {
            @Override
            public void onItemClick(View v, int position) {
                startActivity(new Intent(requireContext(), PlaylistActivity.class));
            }

            @Override
            public void onLongItemClick(View v, int position) {
            }
        }));
    }
}