package com.example.inline;

import android.app.TimePickerDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TimePicker;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class setOfficeTime extends AppCompatActivity {
    private OkHttpClient client = new OkHttpClient();
    private String coursename;
   // private EditText minute, hour, dayOfWeek;

    private TimePicker picker;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_course_time);
        Button btnSetTime;

        picker = findViewById(R.id.time_picker);
        picker.setIs24HourView(true);

        coursename = MySingletonClass.getInstance().getCourseSettime();


        Spinner day_spinner = (Spinner) findViewById(R.id.edit_coursetime_day);
        List<String> dayList = new ArrayList<String>();
        dayList.add("MON");
        dayList.add("TUE");
        dayList.add("WED");
        dayList.add("THU");
        dayList.add("FRI");
        dayList.add("SAT");
        dayList.add("SUN");
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_spinner_item, dayList);
        dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        day_spinner.setAdapter(dataAdapter);


        Spinner spinner = (Spinner) findViewById(R.id.course_address_spinner);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.address_array, android.R.layout.simple_spinner_item);
        spinner.setAdapter(adapter);

        btnSetTime = (Button) findViewById(R.id.setCourseTimeButton);
        btnSetTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String hour = String.valueOf(picker.getHour());
                String minute = String.valueOf(picker.getMinute());

                String dayOfWeek = "";
                switch (String.valueOf(day_spinner.getSelectedItem())) {
                    case "MON":
                        dayOfWeek = String.valueOf(1);
                        break;
                    case "TUE":
                        dayOfWeek = String.valueOf(2);
                        break;
                    case "WED":
                        dayOfWeek = String.valueOf(3);
                        break;
                    case "THU":
                        dayOfWeek = String.valueOf(4);
                        break;
                    case "FRI":
                        dayOfWeek = String.valueOf(5);
                        break;
                    case "SAT":
                        dayOfWeek = String.valueOf(6);
                        break;
                    case "SUN":
                        dayOfWeek = String.valueOf(7);
                        break;
                    default: break;
                }
                MediaType MEDIA_TYPE = MediaType.parse("application/json");
                JSONObject postdata1 = new JSONObject();
                try {
                    postdata1.put("coursename", coursename);
                    postdata1.put("minute", minute);
                    postdata1.put("hour", hour);
                    postdata1.put("dayOfWeek", dayOfWeek);
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
                navUser();
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
                showToast();
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

    public void showToast() {
        Toast.makeText(this, "set successfully", Toast.LENGTH_LONG).show();
    }

    public void navUser() {
        Intent intent = new Intent(this, HomeScreenActivity.class);
        startActivity(intent);
    }
}