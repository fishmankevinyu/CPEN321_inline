package com.example.inline;

import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class setOfficeTime extends AppCompatActivity {
    private OkHttpClient client = new OkHttpClient();
    private String coursename;
    private EditText minute, hour, dayOfWeek;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_course_time);
        Button btnSetTime;

        coursename = MySingletonClass.getInstance().getCourseSettime();
        minute = (EditText)findViewById(R.id.edit_coursetime_minute);
        hour = (EditText)findViewById(R.id.edit_coursetime_hour);
        dayOfWeek = (EditText)findViewById(R.id.edit_coursetime_day);

        btnSetTime = (Button) findViewById(R.id.setCourseTimeButton);
        btnSetTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.e("setOfficeTime","Response setOfficeHour");
                MediaType MEDIA_TYPE = MediaType.parse("application/json");
                JSONObject postdata1 = new JSONObject();
                try {
                    postdata1.put("coursename", coursename);
                    postdata1.put("minute", minute.getText().toString());
                    postdata1.put("hour", hour.getText().toString());
                    postdata1.put("dayOfWeek", dayOfWeek.getText().toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                Log.e("setOfficeTime","After Set String");

                RequestBody body = RequestBody.create(MEDIA_TYPE, postdata1.toString());

                Request request = new Request.Builder()
                        .url("http://40.117.195.60:4000/time/add")
                        .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                        .post(body)
                        .header("Accept", "application/json")
                        .header("Content-Type", "application/json")
                        .build();

                Log.i("setOfficeTime","Response setOfficeHour");
                new MyAsyncTask().execute(request);
            }
        });
    }

    class MyAsyncTask extends AsyncTask<Request, Void, Response> {

        @Override
        protected Response doInBackground(Request... requests) {
            Response response = null;
            try {
                response = client.newCall(requests[0]).execute();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return response;
        }

        @Override
        protected void onPostExecute(Response response) {
            try {
                if(response == null) throw new IOException("Unexpected code " + response);
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

                Log.i("idf", "Set time response is successful");
                String jsonData = response.body().string();
                Log.i("idf", jsonData);
                try{
                    JSONObject Jobject = new JSONObject(jsonData);
                }
                catch(Exception e){
                }
            }
            catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }
        }
    }
}