package com.example.inline;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.fragment.app.Fragment;


public class UserFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_user, container, false);

        TextView userName = (TextView)view.findViewById(R.id.info_userName);
        userName.setText(MySingletonClass.getInstance().getName());

        //Button for navigating to create and delete course page
        Button create_button = (Button) view.findViewById(R.id.create_delete_course);
        if (!MySingletonClass.getInstance().getIsteacher()) {
            create_button.setEnabled(false);
        }
        create_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navCreateCourse();
            }
        });

        //Button for navigating to register and deregister course page
        Button register_button = (Button) view.findViewById(R.id.reguster_deregister_course);
        if (MySingletonClass.getInstance().getIsteacher()) {
            register_button.setEnabled(false);
        }
        register_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navRegisterCourse();
            }
        });

        Button logoutBtn = (Button) view.findViewById(R.id.logout_button);
        logoutBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navLogin();
            }
        });
        return view;
    }

    public void navCreateCourse() {
        Intent intent = new Intent(getActivity(), CreateCourse.class);
        startActivity(intent);
    }


    public void navRegisterCourse() {
        Intent intent = new Intent(getActivity(), AddCourse.class);
        startActivity(intent);
    }

    public void navLogin() {
        //MySingletonClass.getInstance().setAllCourseCoordinates(null);
        Intent intent = new Intent(getActivity(), MainActivity.class);
        startActivity(intent);
    }
}
