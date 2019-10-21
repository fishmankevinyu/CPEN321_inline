package com.example.inline;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class course_list_fragment extends Fragment {
    public JSONArray classList;

    public course_list_fragment() {

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_course_list, container, false);
        JSONObject class1 = new JSONObject();
        try {
            class1.put("id", "CPEN321");
            class1.put("section", "101");
        } catch (JSONException e) {
        }

        JSONObject class2 = new JSONObject();
        try {
            class2.put("id", "CPEN331");
            class2.put("section", "102");
        } catch (JSONException e) {
        }

        classList = new JSONArray();
        classList.put(class1);
        classList.put(class2);

        JSONObject json_data;

        ArrayList<String> classListNames = new ArrayList<String>();

        for(int i=0; i < classList.length() ; i++) {
            try {
                json_data = classList.getJSONObject(i);
                String courseName = json_data.getString("id");
                classListNames.add(courseName);
            } catch (JSONException e) {
            }
        }

        ArrayAdapter adapter = new ArrayAdapter<String>(getActivity().getApplicationContext(),
                R.layout.activity_listview, classListNames);

        ListView listView = (ListView) view.findViewById(R.id.mobile_list);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                getCourseInfo(position);
            }
        });

        return view;
    }

    public String getCourseInfo(int position) {
        try {

            JSONObject classInformation = classList.getJSONObject(position);
            String courseName = classInformation.getString("id");
            String courseID = classInformation.getString("section");
            String navigateTo = courseName + courseID;

            return navigateTo;

            //Here we search the backend for this course information with the course name
            //We send the request to the backend for course info

        } catch (JSONException e) {
            return null;
        }
    }

}
