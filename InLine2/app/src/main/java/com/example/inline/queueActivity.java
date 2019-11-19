package com.example.inline;

import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import org.json.JSONArray;

import java.io.IOException;
import java.util.HashMap;

import androidx.appcompat.app.AppCompatActivity;
import okhttp3.Response;

public class queueActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_queue);
        TextView courseTextView = (TextView) findViewById(R.id.enqueCourseName);
        courseTextView.setText(MySingletonClass.getInstance().getCourseQueue());
    }

    public class getCourseService extends OkHTTPService {

        @Override
        protected void onPostExecute(Response response) {

            try {
                if (response == null) throw new IOException("Unexpected code " + response);
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

                String jsonData = response.body().string();

                try {

                    /*
                    JSONArray mJsonArray = new JSONArray(jsonData);

                    courseListAddCourse = new HashMap<String, String>();

                    for (int i = 0; i < mJsonArray.length(); i++) {

                        String teacherName = mJsonArray.getJSONObject(i).getString("teachers");
                        String courseName = mJsonArray.getJSONObject(i).getString("coursename");
                        String courseId = mJsonArray.getJSONObject(i).getString("id");

                        courseListAddCourse.put(courseName, courseId);
                    }*/
                } catch (Exception e) {
                }

            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }
        }
    }

    //No need to parse response body after registering for course
    //Maybe show success message here
    public class registerCourseService extends OkHTTPService {
        @Override
        protected void onPostExecute(Response response) {
            try {
                if(response == null) throw new IOException("Unexpected code " + response);
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
                String jsonData = response.body().string();
                Log.i("idf",jsonData);
            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());

            }
        }
    }
}
