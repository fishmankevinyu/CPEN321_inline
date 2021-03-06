package com.example.inline;

import android.content.Intent;
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
import xdroid.toaster.Toaster;

public class CreateCourse extends AppCompatActivity {
    private OkHttpClient client = new OkHttpClient();
    private EditText coursename;
    private String courseid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create);
        Button btnSend;
        Button btnSend2;

        coursename = (EditText)findViewById(R.id.edit_course_name);

        btnSend = (Button) findViewById(R.id.button_create);
        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                MediaType MEDIA_TYPE = MediaType.parse("application/json");
                JSONObject postdata1 = new JSONObject();
                try {
                    postdata1.put("coursename", coursename.getText().toString());
                    postdata1.put("teachers", MySingletonClass.getInstance().getName());
                    postdata1.put("AA", "1");
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                RequestBody body = RequestBody.create(MEDIA_TYPE, postdata1.toString());

                Request request = new Request.Builder()
                        .url("http://40.117.195.60:4000/courses/new")
                        .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                        .post(body)
                        .header("Accept", "application/json")
                        .header("Content-Type", "application/json")
                        .build();

                new MyAsyncTask().execute(request);
                navCreateCourse();
            }
        });

        btnSend2 = (Button) findViewById(R.id.button_delete);
        btnSend2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                MediaType MEDIA_TYPE = MediaType.parse("application/json");

                JSONObject postdata2 = new JSONObject();
                try {
                    Log.i("idf",  coursename.getText().toString());
                    postdata2.put("coursename", coursename.getText().toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                RequestBody body = RequestBody.create(MEDIA_TYPE, postdata2.toString());

                /* Send a request to get course id first */
                Request request = new Request.Builder()
                        .url("http://40.117.195.60:4000/courses/name")
                        .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                        .post(body)
                        .header("Accept", "application/json")
                        .header("Content-Type", "application/json")
                        .build();

                new DeleteAsyncTask().execute(request);

            }
        });
    }

    public void navCreateCourse() {
        MySingletonClass.getInstance().setCourseSettime(coursename.getText().toString());
        Intent intent = new Intent(this, SetOfficeTime.class);
        startActivity(intent);
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

                String jsonData = response.body().string();
                Log.i("idf", jsonData);
            }
            catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }

        }

    }

    class DeleteAsyncTask extends AsyncTask<Request, Void, Response> {

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
                String jsonData = response.body().string();
                Log.i("idf", jsonData);

                try{
                    JSONObject Jobject = new JSONObject(jsonData);
                    courseid = Jobject.getString("id");
                    Log.i("idf", "This is courseid: "+courseid);

                    ///////////////////////////////////////////
                    /* Send DELETE course request */
                    RequestBody delete_body = RequestBody.create(null, new byte[0]);

                    Request delete_request = new Request.Builder()
                        .url("http://40.117.195.60:4000/courses/"+courseid)
                        .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                        .delete(delete_body)
                        .header("Accept", "application/json")
                        .header("Content-Type", "application/json")
                        .build();
                    new MyAsyncTask().execute(delete_request);
                    Toaster.toast("Course deleted successfully");
                    ///////////////////////////////////////////
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
