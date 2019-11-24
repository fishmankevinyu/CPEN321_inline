package com.example.inline;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import android.os.Bundle;
import com.google.android.material.bottomnavigation.BottomNavigationView;



public class HomeScreenActivity extends AppCompatActivity {

    //Have a global array that receives the course
    //info for the registered user

    //private ActionBar toolbar;

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_screen);

        //this.toolbar = getSupportActionBar();

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

    private void loadFragment(Fragment fragment) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.container, fragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

}
