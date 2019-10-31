package com.example.inline;

import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

import androidx.fragment.app.Fragment;

import static android.app.Activity.RESULT_OK;

public class user_fragment extends Fragment {
    private static final int SELECT_PICTURE = 0;
    private ImageView imageView;

    public user_fragment() {
    }

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
        Intent intent = new Intent(getActivity(), create_course.class);
        startActivity(intent);
    }
}
