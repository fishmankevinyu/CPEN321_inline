package com.example.inline;

import androidx.test.espresso.intent.Intents;
import androidx.test.rule.ActivityTestRule;
import androidx.test.runner.AndroidJUnit4;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.Espresso.pressBack;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.matcher.ViewMatchers.isChecked;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withSpinnerText;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.core.IsNot.not;

@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {

    private String createCourseString;
    private String userNameString;
    private String firstNameString;
    private String lastNameString;
    private String passwordString;
    private String addCourseName;

    private String stuUsername;
    private String stuPassword;
    private String teaUsername;
    private String teaPassword;

    @Rule
    public ActivityTestRule<MainActivity> activityRule
            = new ActivityTestRule<>(MainActivity.class);

    @Before
    public void initValidString() {
        createCourseString = "CPEN331";
        firstNameString = "Bob";
        lastNameString = "Smith";
        userNameString = "Batman";
        passwordString = "12345678";
        addCourseName = "MATH100";

        stuUsername = "test1";
        stuPassword = "test1p";
        teaUsername = "test2";
        teaPassword = "test2p";
        Intents.init();
    }

    @Test
    public void loginTest() {
        onView(withId(R.id.editText1)).perform(typeText(stuUsername), closeSoftKeyboard());
        onView(withId(R.id.editText2)).perform(typeText(stuPassword), closeSoftKeyboard());
        onView(withId(R.id.button)).perform(click());
        intended(hasComponent(HomeScreenActivity.class.getName()));
    }

    @Test
    public void navBarTest() {
        onView(withId(R.id.editText1)).perform(typeText(stuUsername), closeSoftKeyboard());
        onView(withId(R.id.editText2)).perform(typeText(stuPassword), closeSoftKeyboard());
        onView(withId(R.id.button)).perform(click());
        // goto user fragment
        onView(withId(R.id.navigation_user)).perform(click());
        onView(withId(R.id.info_userImage)).check(matches(isDisplayed()));
        onView(withId(R.id.info_userName)).check(matches(isDisplayed()));
        onView(withId(R.id.create_delete_course)).check(matches(isDisplayed()));
        onView(withId(R.id.reguster_deregister_course)).check(matches(isDisplayed()));
        onView(withId(R.id.logout_button)).check(matches(isDisplayed()));

        // goto course list fragment
        onView(withId(R.id.navigation_course_list)).perform(click());
        onView(withId(R.id.mobile_list)).check(matches(isDisplayed()));

        // goto map fragment
        onView(withId(R.id.navigation_map)).perform(click());
        onView(withId(R.id.mapView)).check(matches(isDisplayed()));
    }

    @Test
    public void regTest() {
        /* test text input in registration interface */
        onView(withId(R.id.link_reg)).perform(click());
        intended(hasComponent(RegistrationScreen.class.getName()));

        onView(withId(R.id.firstName)).perform(typeText("Bob"), closeSoftKeyboard());
        onView(withId(R.id.firstName)).check(matches(withText(firstNameString)));

        onView(withId(R.id.lastName)).perform(typeText("Smith"), closeSoftKeyboard());
        onView(withId(R.id.lastName)).check(matches(withText(lastNameString)));

        onView(withId(R.id.userName)).perform(typeText("Batman"), closeSoftKeyboard());
        onView(withId(R.id.userName)).check(matches(withText(userNameString)));

        onView(withId(R.id.passWord)).perform(typeText("12345678"), closeSoftKeyboard());
        onView(withId(R.id.passWord)).check(matches(withText(passwordString)));

        onView(withId(R.id.checkbox_meat)).perform(click());
        onView(withId(R.id.checkbox_meat)).check(matches((isChecked())));
        onView(withId(R.id.checkbox_meat)).perform(click());
        onView(withId(R.id.checkbox_meat)).check(matches(not(isChecked())));
    }

    @Test
    public void addCourseTest() {
        /* Login */
        onView(withId(R.id.editText1)).perform(typeText(stuUsername), closeSoftKeyboard());
        onView(withId(R.id.editText2)).perform(typeText(stuPassword), closeSoftKeyboard());
        onView(withId(R.id.button)).perform(click());

        /* Go to user's fragment */
        onView(withId(R.id.navigation_user)).perform(click());

        /* Test add course */
        onView(withId(R.id.reguster_deregister_course)).perform(click());

        onView(withId(R.id.add_course_spinner)).perform(click());
        onData(anything()).atPosition(0).perform(click());
        onView(withId(R.id.add_course_spinner)).check(matches(withSpinnerText(containsString(addCourseName))));
    }

    @Test
    public void createCourseTest() {
        /* Login */
        onView(withId(R.id.editText1)).perform(typeText(teaUsername), closeSoftKeyboard());
        onView(withId(R.id.editText2)).perform(typeText(teaPassword), closeSoftKeyboard());
        onView(withId(R.id.button)).perform(click());

        /* Go to user's fragment */
        onView(withId(R.id.navigation_user)).perform(click());

        /* Test create course */
        onView(withId(R.id.create_delete_course)).perform(click());
        onView(withId(R.id.edit_course_name)).perform(typeText("CPEN331"), closeSoftKeyboard());
        onView(withId(R.id.edit_course_name)).check(matches(withText(createCourseString)));
    }

    @Test
    public void listViewTest() {
        /* Login */
        onView(withId(R.id.editText1)).perform(typeText(stuUsername), closeSoftKeyboard());
        onView(withId(R.id.editText2)).perform(typeText(stuPassword), closeSoftKeyboard());
        onView(withId(R.id.button)).perform(click());

        onData(anything()).inAdapterView(withId(R.id.mobile_list)).atPosition(0).perform(click());
        intended(hasComponent(queueActivity.class.getName()));
        onView(withId(R.id.enqueCourseName)).check(matches(isDisplayed()));
        onView(withId(R.id.officeHourTime)).check(matches(isDisplayed()));
        onView(withId(R.id.courseWaitTime)).check(matches(isDisplayed()));
        onView(withId(R.id.enqueButton)).check(matches(isDisplayed()));
        onView(withId(R.id.dequeButton)).check(matches(isDisplayed()));
    }


    /////////////////////////////////Test for non functional req/////////////////////////////////
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