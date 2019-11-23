package com.example.inline;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.widget.Toast;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import okhttp3.Request;
import okhttp3.Response;


public class HomeScreenActivity extends AppCompatActivity {

    OkHTTPService client = new OkHTTPService();

    //Have a global array that receives the course
    //info for the registered user

    public JSONArray classList;
    private ActionBar toolbar;
    ArrayList<String> onlyCourseList;

    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = (item) -> {
        switch (item.getItemId()) {
            case R.id.navigation_course_list:
                loadFragment (new CourseListFragment());
                return true;
            case R.id.navigation_map:
                loadFragment (new MapFragment());
                return true;
            case R.id.navigation_user:
                loadFragment (new UserFragment());
                return true;
            default:
                return false;
        }
    };

    public void navigateService() {
        Intent intent = new Intent(this, HomeScreenActivity.class);
        startActivity(intent);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_screen);




        toolbar = getSupportActionBar();
        BottomNavigationView navigation = findViewById(R.id.nav_view);
        if (MySingletonClass.getInstance().getIsteacher()){
            navigation.inflateMenu(R.menu.bottom_nav_menu_teacher);
        }
        else {
            navigation.inflateMenu(R.menu.bottom_nav_menu);
        }
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);

        loadFragment(new CourseListFragment());

        //getCourseList();
    }

    public String getCourseInfo(int position) {
        try {

            JSONObject classInformation = classList.getJSONObject(position);
            String courseName = classInformation.getString("id");
            String courseID = classInformation.getString("section");
            String navigateTo = courseName + courseID;

            /*
            Toast.makeText(getApplicationContext(),
                    "CourseName is " + navigateTo, Toast.LENGTH_LONG)
                    .show();*/

            return navigateTo;

            //Here we search the backend for this course information with the course name
            //We send the request to the backend for course info

        } catch (JSONException e) {
            return null;
        }
    }

    private void loadFragment(Fragment fragment) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.container, fragment);
        transaction.addToBackStack(null);
        transaction.commit();
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


        new getCourseServiceForHomeScreen().execute(request);

    }

    public class getCourseServiceForHomeScreen extends OkHTTPService {

        @Override
        protected void onPostExecute(Response Aresponse) {

            try {
                if (Aresponse == null) throw new IOException("Unexpected code " + Aresponse);
                if (!Aresponse.isSuccessful()) throw new IOException("Unexpected code " + Aresponse);

                Log.i("idf", Aresponse.toString());

                String jsonData = Aresponse.body().string();

                try {
                    JSONArray mJsonArray = new JSONArray(jsonData);

                    onlyCourseList = new ArrayList<String>();


                    HashMap<String,String> courseListAddCourse = new HashMap<String, String>();


                    for (int i = 0; i < mJsonArray.length(); i++) {
                        String courseName = mJsonArray.getJSONObject(i).getString("coursename");
                        onlyCourseList.add(courseName);
                        String courseId = mJsonArray.getJSONObject(i).getString("id");
                        courseListAddCourse.put(courseName, courseId);
                    }


                    MySingletonClass.getInstance().setAllClasses(onlyCourseList);
                    MySingletonClass.getInstance().setAllClassHashMap(courseListAddCourse);
                } catch (Exception e) {
                }

            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }
        }
    }*/

}
