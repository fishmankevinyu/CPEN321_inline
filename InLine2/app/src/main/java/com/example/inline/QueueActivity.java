package com.example.inline;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import androidx.appcompat.app.AppCompatActivity;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import xdroid.toaster.Toaster;
import java.util.Calendar;

public class QueueActivity extends AppCompatActivity {

    private OkHttpClient client = new OkHttpClient();
    private Button enqueCourseButton;

    public TextView courseTextView;
    public TextView waitTimeTextView;
    public TextView officeHourTimeView;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_queue);

        Button dequeCourseButton;
        Button deleteCourseButton;

        onCreateInitialization();

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

        //For self deque
        dequeCourseButton = (Button) findViewById(R.id.dequeButton);
        dequeCourseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                MediaType MEDIA_TYPE = MediaType.parse("application/json");

                Log.i("idf",CourseSingletonClass.getInstance().getCourse());

                Log.i("idf", MySingletonClass.getInstance().getName());

                JSONObject postEnqueue = new JSONObject();
                try {
                    postEnqueue.put("coursename", CourseSingletonClass.getInstance().getCourse());
                    postEnqueue.put("username", MySingletonClass.getInstance().getName());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                RequestBody body = RequestBody.create(MEDIA_TYPE, postEnqueue.toString());
                Request request = new Request.Builder()
                        .url("http://40.117.195.60:4000/queue/selfdeque")
                        .put(body)
                        .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                        .header("Accept", "application/json")
                        .header("Content-Type", "application/json")
                        .build();

                new dequeCourseService().execute(request);
            }

        });

        deleteCourseButton = (Button) findViewById(R.id.deleteCourseButton);
        deleteCourseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                MediaType MEDIA_TYPE = MediaType.parse("application/json");

                JSONObject postdata2 = new JSONObject();
                try {
                    postdata2.put("coursename", CourseSingletonClass.getInstance().getCourse() );
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

                new QueueActivity.DeleteAsyncTask().execute(request);
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
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response + response.message());
                String jsonData = response.body().string();


                Log.i("idf",jsonData);

                try{
                    JSONObject Jobject = new JSONObject(jsonData);
                    String estimatedTimeString = String.valueOf(Jobject.getInt("EST")/60000) + " Min. estimated wait time";
                    waitTimeTextView.setText(estimatedTimeString);
                }
                catch(Exception e){
                }
            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());

            }
        }
    }


    //No need to parse response body after registering for course
    //Maybe show success message here
    public class dequeCourseService extends OkHTTPService {

        @Override
        protected void onPostExecute(Response response) {
            try {
                if(response == null) throw new IOException("Unexpected code " + response);
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
                String jsonData = response.body().string();


                Log.i("idf",jsonData);
                String text = "Please Enque";
                waitTimeTextView.setText(text);

                //waitTimeTextView
            } catch (IOException e) {
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

            String courseid;
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
                            .url("http://40.117.195.60:4000/courses/drop/"+MySingletonClass.getInstance().getId()+"&"+courseid)
                            .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                            .delete(delete_body)
                            .header("Accept", "application/json")
                            .header("Content-Type", "application/json")
                            .build();
                    new QueueActivity.deleteCourseAsyncTask().execute(delete_request);
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

    class deleteCourseAsyncTask extends AsyncTask<Request, Void, Response> {

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
                    String deleteCourse = Jobject.getString("coursename");
                    ArrayList<String> tempClassList = MySingletonClass.getInstance().getClasses();
                    tempClassList.remove(deleteCourse);
                    MySingletonClass.getInstance().setClasses(tempClassList);
                    Toaster.toast("Course deleted successfully");
                    navUser();
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

    public void navUser() {
        Intent intent = new Intent(this, HomeScreenActivity.class);
        startActivity(intent);
    }

    public void onCreateInitialization(){

        courseTextView = (TextView) findViewById(R.id.enqueCourseName);
        waitTimeTextView = (TextView) findViewById(R.id.courseWaitTime);
        officeHourTimeView = (TextView) findViewById(R.id.officeHourTime) ;
        courseTextView.setText(CourseSingletonClass.getInstance().getCourse());
        officeHourTimeView.setText(CourseSingletonClass.getInstance().getOfficeHourTime());
        waitTimeTextView.setText("Please Enque");
        enqueCourseButton = (Button) findViewById(R.id.enqueButton);

        Calendar cal = Calendar.getInstance();
        Date currentTime = cal.getTime();
        String dayOfWeek = (""+currentTime.toString().charAt(0)+currentTime.toString().charAt(1)+currentTime.toString().charAt(2)).toUpperCase();
        String hourStr = ""+currentTime.toString().charAt(11)+currentTime.toString().charAt(12);
        int hour = Integer.parseInt(hourStr);
        String minuteStr = ""+currentTime.toString().charAt(14)+currentTime.toString().charAt(15);
        int minute = Integer.parseInt(minuteStr);
        int time = 60 * hour + minute;
        int ep_hour = Integer.parseInt(CourseSingletonClass.getInstance().getHour());
        int ep_minute = Integer.parseInt(CourseSingletonClass.getInstance().getminute());
        int ep_time = 60 * ep_hour + ep_minute;

        if (!dayOfWeek.equals(CourseSingletonClass.getInstance().getdayOfWeek()) || time < ep_time || time > ep_time + 60) {
            enqueCourseButton.setEnabled(false);
        }

    }
}
