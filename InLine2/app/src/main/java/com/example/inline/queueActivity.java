package com.example.inline;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import androidx.appcompat.app.AppCompatActivity;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class queueActivity extends AppCompatActivity {

    private Button enqueCourseButton;
    private Button dequeCourseButton;

    private TextView courseName;
    private TextView estimatedTime;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_queue);

        TextView courseTextView = (TextView) findViewById(R.id.enqueCourseName);
        TextView waitTimeTextView = (TextView) findViewById(R.id.courseWaitTime);

        //courseTextView.setText(MySingletonClass.getInstance().getCourseQueue());

        courseTextView.setText(CourseSingletonClass.getInstance().getCourse());
        waitTimeTextView.setText("Please Enque");

        enqueCourseButton = (Button) findViewById(R.id.enqueButton);
        enqueCourseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                    MediaType MEDIA_TYPE = MediaType.parse("application/json");

                    JSONObject postEnqueue = new JSONObject();
                    try {
                        postEnqueue.put("coursename", CourseSingletonClass.getInstance().getCourse());
                        postEnqueue.put("username", MySingletonClass.getInstance().getName());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    RequestBody body = RequestBody.create(MEDIA_TYPE, postEnqueue.toString());
                    Request request = new Request.Builder()
                            .url("http://40.117.195.60:4000/queue/enque")
                            .post(body)
                            .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                            .header("Accept", "application/json")
                            .header("Content-Type", "application/json")
                            .build();

                    new enqueCourseService().execute(request);
                }

        });

    }

    //No need to parse response body after registering for course
    //Maybe show success message here
    public class enqueCourseService extends OkHTTPService {

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
