package com.example.inline;

import android.content.Intent;
import android.os.AsyncTask;
import android.util.Log;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import static android.content.ContentValues.TAG;

public class queue extends AppCompatActivity {
    OkHttpClient client = new OkHttpClient();

    public void enque(View view){
        String coursename = getCourseInfo();
        //Log.e(TAG, "onItemClick: courseInfo lalala");
        registerCourse(coursename, MySingletonClass.getInstance().getName());
    }

    private String getCourseInfo() {
        String Course = CourseSingletonClass.getInstance().getCourse();
        return Course;
    }

    private void registerCourse(String coursename, String username) {
        MediaType MEDIA_TYPE = MediaType.parse("application/json");

        JSONObject postdata = new JSONObject();
        try {
            postdata.put("coursename", "CPEN321");
            Log.e(TAG, ""+coursename);
            postdata.put("username", "testusername");
        } catch(JSONException e){
            e.printStackTrace();
        }

        RequestBody body = RequestBody.create(MEDIA_TYPE, postdata.toString());
        Request request = new Request.Builder()
                .url("http://40.117.195.60:4000/queue/enque")
                .addHeader("Authorization", "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZGFkMmFlZjA0ZTEyYTA5NzU5ZTA5NTMiLCJpYXQiOjE1NzE2MzEwNTB9.ZOz7JeoiFHPcGkVysSzZO6pzf3lefcwXejHE31KnA8o")
                .post(body)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .build();

        new queue.MyAsyncTask().execute(request);
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
            //super.onPostExecute(response); what does this line do

            //TODO have a spinner when waiting for asynch wait
            try {
                if(response == null) throw new IOException("Unexpected code " + response);
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

                Log.i("idf", "Response is successful");

                Log.i("idf", response.body().string());

            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());

            }

        }

    }
}


