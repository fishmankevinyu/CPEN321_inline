package com.example.inline;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import androidx.fragment.app.Fragment;

public class UserFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_user, container, false);
        Button create_button = (Button) view.findViewById(R.id.create_delete_course);
        create_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navCreateCourse();
            }
        });
        return view;
    }

    public void navCreateCourse() {
        Intent intent = new Intent(getActivity(), CreateCourse.class);
        startActivity(intent);
    }
}
