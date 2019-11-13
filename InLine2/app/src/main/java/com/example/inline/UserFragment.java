package com.example.inline;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import androidx.fragment.app.Fragment;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class UserFragment extends Fragment {
    private OkHttpClient client = new OkHttpClient();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_user, container, false);
        Button create_button = (Button) view.findViewById(R.id.create_delete_course);
        create_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                Request getuser_request = new Request.Builder()
//                        .url("http://40.117.195.60:4000/users/current")
//                        .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
//                        .header("Accept", "application/json")
//                        .header("Content-Type", "application/json")
//                        .build();
//
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
