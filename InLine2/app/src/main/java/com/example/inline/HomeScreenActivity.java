package com.example.inline;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.widget.Toast;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class HomeScreenActivity extends AppCompatActivity {

    //Have a global array that receives the course
    //info for the registered user

    public JSONArray classList;
    private ActionBar toolbar;

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

    private void loadFragment(Fragment fragment) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.container, fragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

}
