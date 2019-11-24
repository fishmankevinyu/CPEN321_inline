package com.example.inline;

import androidx.appcompat.app.AppCompatActivity;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.Toast;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class addCourse extends AppCompatActivity {

    //private OkHttpClient client = new OkHttpClient();
    //private EditText courseName;
    private String courseName;
    private Button addCourseButton;
    ArrayList<String> unRegCourse;

    HashMap<String, String> courseListAddCourse; //courseList hashmap

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_course);

        unRegCourse = new ArrayList<String>();
        for (int k = 0; k < MySingletonClass.getInstance().getAllClasses().size(); k++) {
            if (!MySingletonClass.getInstance().getClasses().contains(MySingletonClass.getInstance().getAllClasses().get(k))){
                unRegCourse.add(MySingletonClass.getInstance().getAllClasses().get(k));
            }
        }
        MySingletonClass.getInstance().setUnRegClasses(unRegCourse);

        //getCourseList(); //Get all the courses in the DB on starting the activity

        Spinner spinner = (Spinner) findViewById(R.id.add_course_spinner);
        ArrayList<String> options = MySingletonClass.getInstance().getUnRegClasses();

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item,options);
        spinner.setAdapter(adapter);

        //courseName = findViewById(R.id.courseName);
        //courseName = String.valueOf(spinner.getSelectedItem());

        //On click register for the course
        addCourseButton = (Button) findViewById(R.id.addCourseButton);
        addCourseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                courseName = String.valueOf(spinner.getSelectedItem());

                Boolean hasCourse = false;
                String courseToRegisterId = "";

                //Iterate through courses to find match
                Iterator it = MySingletonClass.getInstance().getAllClassHashMap().entrySet().iterator();


                while (it.hasNext()) {
                    Map.Entry pair = (Map.Entry)it.next();
                    if(pair.getKey().toString().toUpperCase().trim().equals(courseName.toString().toUpperCase().trim())){
                        hasCourse = true;
                        courseToRegisterId = pair.getValue().toString();
                    }
                }


                /*
                ArrayList<String> allClasses = MySingletonClass.getInstance().getAllClasses();

                for(int i = 0; i < allClasses.size(); i++){
                    if(allClasses.get(i).toUpperCase().trim().equals(courseName.toString().toUpperCase().trim())){
                        hasCourse = true;
                        courseTo
                    }
                }*/

                if(hasCourse == true){

                    MediaType MEDIA_TYPE = MediaType.parse("application/json");
                    //Null request body because no info needs to be posted
                    RequestBody reqbody = RequestBody.create(null, new byte[0]);
                    Request request = new Request.Builder()
                            .url("http://40.117.195.60:4000/courses/add/" + MySingletonClass.getInstance().getId() + "&" + courseToRegisterId)
                            .post(reqbody)
                            .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                            .header("Accept", "application/json")
                            .header("Content-Type", "application/json")
                            .build();
                    new registerCourseService().execute(request);
                }
            }
        });

    }


    //Function to get course list from db

    /*
    protected void getCourseList(){

        Request request = new Request.Builder()
                .get()
                .url("http://40.117.195.60:4000/courses")
                .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .build();

        new getCourseService().execute(request);

    }


    public class getCourseService extends OkHTTPService {

        @Override
        protected void onPostExecute(Response response) {

            try {
                if (response == null) throw new IOException("Unexpected code " + response);
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

                String jsonData = response.body().string();

                try {
                    JSONArray mJsonArray = new JSONArray(jsonData);

                    courseListAddCourse = new HashMap<String, String>();

                    for (int i = 0; i < mJsonArray.length(); i++) {

                        String teacherName = mJsonArray.getJSONObject(i).getString("teachers");
                        String courseName = mJsonArray.getJSONObject(i).getString("coursename");
                        String courseId = mJsonArray.getJSONObject(i).getString("id");

                        courseListAddCourse.put(courseName, courseId);
                    }
                } catch (Exception e) {
                }

            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }
        }
    }*/

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

                try{
                    JSONObject Jobject = new JSONObject(jsonData);
                    String newCourse = Jobject.getString("coursename");
                    ArrayList<String> tempClassList = MySingletonClass.getInstance().getClasses();
                    tempClassList.add(newCourse);
                    MySingletonClass.getInstance().setClasses(tempClassList);
                    //showToast();
                }
                catch(Exception e){
                }

                finally{
                    //MySingletonClass.getInstance().setAllCourseCoordinates(null);
                    navUser();
                }
            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }
        }
    }

    public void showToast() {
        Toast.makeText(this, "Add successfully", Toast.LENGTH_LONG).show();
    }

    public void navUser() {
        Intent intent = new Intent(this, HomeScreenActivity.class);
        startActivity(intent);
    }
}
