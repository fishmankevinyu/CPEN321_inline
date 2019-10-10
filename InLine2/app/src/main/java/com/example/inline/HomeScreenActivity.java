package com.example.inline;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.util.ArrayList;


public class HomeScreenActivity extends AppCompatActivity {

    //Have a global array that receives the course
    //info for the registered user

    public JSONArray classList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_screen);

        /*Dummy data*/

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

        ArrayAdapter adapter = new ArrayAdapter<String>(this,
                R.layout.activity_listview, classListNames);

        ListView listView = (ListView) findViewById(R.id.mobile_list);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                getCourseInfo(position);
            }
        });

    }

    public String getCourseInfo(int position) {
        try {

            JSONObject classInformation = classList.getJSONObject(position);
            String courseName = classInformation.getString("id");
            String courseID = classInformation.getString("section");
            String navigateTo = courseName + courseID;
            Toast.makeText(getApplicationContext(),
                    "CourseName is " + navigateTo, Toast.LENGTH_LONG)
                    .show();

            return navigateTo;

            //Here we search the backend for this course information with the course name
            //We send the request to the backend for course info

        } catch (JSONException e) {
            return null;
        }
    }
}
