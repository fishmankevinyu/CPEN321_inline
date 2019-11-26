package com.example.inline;

import androidx.appcompat.app.AppCompatActivity;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;


public class MainActivity extends AppCompatActivity {


    private OkHttpClient client = new OkHttpClient();
    private EditText username;
    private EditText password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button btnSend;

        username = (EditText) findViewById(R.id.editText1);
        password = (EditText) findViewById(R.id.editText2);



        MySingletonClass.getInstance().setName(username.getText().toString());

        FirebaseInstanceId.getInstance().getInstanceId().addOnSuccessListener(MainActivity.this, new OnSuccessListener<InstanceIdResult>() {
            @Override
            public void onSuccess(InstanceIdResult instanceIdResult) {

                String mToken = instanceIdResult.getToken();
                MySingletonClass.getInstance().setmToken(mToken);
                Log.e("HomeScreenActivity", "HERE IS OUR TOKEN");
                Log.e("Token", mToken);
            }
        });

        TextView regLink = findViewById(R.id.link_reg);
        regLink.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                navRegisterUser(view);
            }
        });

        btnSend = (Button) findViewById(R.id.button);
        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                MediaType MEDIA_TYPE = MediaType.parse("application/json");

                JSONObject postdata = new JSONObject();
                try {
                    postdata.put("username", username.getText().toString());
                    postdata.put("password", password.getText().toString());
                    Log.i("idf", "This is the firebase token " + MySingletonClass.getInstance().getmToken());
                    postdata.put("registrationToken", MySingletonClass.getInstance().getmToken());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                RequestBody body = RequestBody.create(MEDIA_TYPE, postdata.toString());

                Request request = new Request.Builder()
                        .url("http://40.117.195.60:4000/users/authenticate")
                        .post(body)
                        .header("Accept", "application/json")
                        .header("Content-Type", "application/json")
                        .build();
                new MyAsyncTaskMain().execute(request);
            }
        });

    }


    public void navRegisterUser(View view) {
        Intent intent = new Intent(this, RegistrationScreen.class);
        startActivity(intent);
    }

    public void navMainScreen() {
        Intent intent = new Intent(this, HomeScreenActivity.class);
        startActivity(intent);
    }

    class MyAsyncTaskMain extends AsyncTask<Request, Void, Response> {

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
                if (response == null) throw new IOException("Unexpected code " + response);
                if (!response.isSuccessful()){
                    showToast();
                    throw new IOException("Unexpected code " + response);
                }

                ResponseBody responseBodyCopy = response.peekBody(Long.MAX_VALUE);
                String jsonData = responseBodyCopy.string();

                //String jsonData = response.body().string();
                Log.i("idf", jsonData);
                try {

                    JSONObject Jobject = new JSONObject(jsonData);

                    String token = Jobject.getString("token");
                    MySingletonClass.getInstance().setToken(token);

                    String isTeacher = Jobject.getString("isTeacher");
                    Boolean isTeacher_bool = Boolean.parseBoolean(isTeacher);
                    MySingletonClass.getInstance().setIsteacher(isTeacher_bool);

                    String userName = Jobject.getString("username");
                    MySingletonClass.getInstance().setName(userName);

                    String userId = Jobject.getString("_id");
                    MySingletonClass.getInstance().setId(userId);

                    JSONArray classes = Jobject.getJSONArray("courses");
                    ArrayList<String> classList = new ArrayList<String>();
                    if (classes != null) {
                        int len = classes.length();
                        for (int i = 0; i < len; i++) {
                            classList.add(classes.get(i).toString());
                        }
                    }

                    MySingletonClass.getInstance().setClasses(classList);

                } catch (Exception e) {
                }

                finally{
                    response.body().close();
                    //response.close();
                    //getCourseList();
                    //navMainScreen();


                    Request request = new Request.Builder()
                            .get()
                            .url("http://40.117.195.60:4000/courses")
                            .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                            //.header("Accept", "application/json")
                            //.header("Content-Type", "application/json")
                            .build();


                    new GetCourseServiceForHomeScreen().execute(request);
                }

            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }
        }
    }



    protected void getCourseList(){

        Request request = new Request.Builder()
                .get()
                .url("http://40.117.195.60:4000/courses")
                .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .build();


        new GetCourseServiceForHomeScreen().execute(request);

    }

    public class GetCourseServiceForHomeScreen extends OkHTTPService {

        @Override
        protected void onPostExecute(Response Aresponse) {

            try {
                if (Aresponse == null) throw new IOException("Unexpected code " + Aresponse);
                if (!Aresponse.isSuccessful()) throw new IOException("Unexpected code " + Aresponse);

                //Log.i("idf", Aresponse.toString());


                ResponseBody responseBodyCopy = Aresponse.peekBody(Long.MAX_VALUE);
                String jsonData = responseBodyCopy.string();
                //String jsonData = Aresponse.body().string();

                try {
                    JSONArray mJsonArray = new JSONArray(jsonData);

                    ArrayList<String> onlyCourseList = new ArrayList<String>();


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

                finally{
                    Aresponse.body().close();
                    navMainScreen();
                }

            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }
        }
    }



    public void showToast() {
        Toast.makeText(this, "Wrong username or password!", Toast.LENGTH_LONG).show();
    }

}




