package com.example.inline;

import android.util.Log;

import androidx.test.espresso.action.ViewActions;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;
import androidx.test.runner.AndroidJUnit4;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import androidx.test.espresso.action.ViewActions;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.Espresso.pressBack;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isChecked;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.core.IsNot.not;

@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {

    private String addCourseString;
    private String createCourseString;
    private String userNameString;
    private String firstNameString;
    private String lastNameString;
    private String passwordString;

    @Rule
    public ActivityTestRule<MainActivity> activityRule
            = new ActivityTestRule<>(MainActivity.class);

    @Before
    public void initValidString() {
        addCourseString = "CPEN321";
        createCourseString = "CPEN331";
        firstNameString = "Bob";
        lastNameString = "Smith";
        userNameString = "Batman";
        passwordString = "12345678";
    }

    @Test
    public void loginTest() {
        onView(withId(R.id.editText1)).perform(typeText("stu"), closeSoftKeyboard());
        onView(withId(R.id.editText2)).perform(typeText("stu"), closeSoftKeyboard());
        onView(withId(R.id.button)).perform(click());
    }

    @Test
    public void navBarTest() {
        onView(withId(R.id.editText1)).perform(typeText("stu"), closeSoftKeyboard());
        onView(withId(R.id.editText2)).perform(typeText("stu"), closeSoftKeyboard());
        onView(withId(R.id.button)).perform(click());

        for (int i = 0; i < 10; i++) {
            onView(withId(R.id.navigation_user)).perform(click());
            onView(withId(R.id.navigation_course_list)).perform(click());
            onView(withId(R.id.navigation_map)).perform(click());
        }
    }

    @Test
    public void textViewTest() {
        /* test text input in registration interface */
        onView(withId(R.id.button2)).perform(click());

        onView(withId(R.id.firstName)).perform(typeText("Bob"), closeSoftKeyboard());
        onView(withId(R.id.firstName)).check(matches(withText(firstNameString)));

        onView(withId(R.id.lastName)).perform(typeText("Smith"), closeSoftKeyboard());
        onView(withId(R.id.lastName)).check(matches(withText(lastNameString)));

        onView(withId(R.id.userName)).perform(typeText("Batman"), closeSoftKeyboard());
        onView(withId(R.id.userName)).check(matches(withText(userNameString)));

        onView(withId(R.id.passWord)).perform(typeText("12345678"), closeSoftKeyboard());
        onView(withId(R.id.passWord)).check(matches(withText(passwordString)));

        pressBack();

        /* Login */
        onView(withId(R.id.editText1)).perform(typeText("stu"), closeSoftKeyboard());
        onView(withId(R.id.editText2)).perform(typeText("stu"), closeSoftKeyboard());
        onView(withId(R.id.button)).perform(click());

        /* Go to user's fragment */
        onView(withId(R.id.navigation_user)).perform(click());

        /* Test add course */
        onView(withId(R.id.reguster_deregister_course)).perform(click());
        onView(withId(R.id.courseName)).perform(typeText("CPEN321"), closeSoftKeyboard());
        onView(withId(R.id.courseName)).check(matches(withText(addCourseString)));
        pressBack();

        /* Test create course */
        onView(withId(R.id.create_delete_course)).perform(click());
        onView(withId(R.id.edit_course_name)).perform(typeText("CPEN331"), closeSoftKeyboard());
        onView(withId(R.id.edit_course_name)).check(matches(withText(createCourseString)));
        pressBack();
    }

    @Test
    public void checkboxTest() {
        onView(withId(R.id.button2)).perform(click());
        onView(withId(R.id.checkbox_meat)).perform(click());
        onView(withId(R.id.checkbox_meat)).check(matches((isChecked())));
        onView(withId(R.id.checkbox_meat)).perform(click());
        onView(withId(R.id.checkbox_meat)).check(matches(not(isChecked())));
    }

    @Test
    public void responseTimeTest() {
        onView(withId(R.id.editText1)).perform(typeText("stu"), closeSoftKeyboard());
        onView(withId(R.id.editText2)).perform(typeText("stu"), closeSoftKeyboard());

        long start = System.nanoTime();

        onView(withId(R.id.button)).perform(click());

        for (int i=0; i < 10; i++){
            onView(withId(R.id.navigation_map)).perform(click());
            onView(withId(R.id.navigation_course_list)).perform(click());
            onView(withId(R.id.navigation_user)).perform(click());
        }

        for(int i=0; i < 10; i++) {
            onView(withId(R.id.reguster_deregister_course)).perform(click());
            pressBack();
            onView(withId(R.id.create_delete_course)).perform(click());
            pressBack();
        }

        long elapsedTime = System.nanoTime() - start;
        System.out.println("Total Respond Time: "+elapsedTime);
    }
}