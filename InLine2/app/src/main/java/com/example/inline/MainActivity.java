package com.example.inline;

import androidx.appcompat.app.AppCompatActivity;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import java.io.IOException;
import java.util.ArrayList;


public class MainActivity extends AppCompatActivity {


    OkHttpClient client = new OkHttpClient();

    EditText username;
    EditText password;

    Button btnSend;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        username = (EditText)findViewById(R.id.editText1);
        password = (EditText)findViewById(R.id.editText2);

        MySingletonClass.getInstance().setName(username.getText().toString());

        FirebaseInstanceId.getInstance().getInstanceId().addOnSuccessListener( MainActivity.this,  new OnSuccessListener<InstanceIdResult>() {
            @Override
            public void onSuccess(InstanceIdResult instanceIdResult) {

                String mToken = instanceIdResult.getToken();
                MySingletonClass.getInstance().setmToken(mToken);
                Log.e("HomeScreenActivity","HERE IS OUR TOKEN");
                Log.e("Token",mToken);
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


                } catch(JSONException e){
                    e.printStackTrace();
                }

                RequestBody body = RequestBody.create(MEDIA_TYPE, postdata.toString());

                Request request = new Request.Builder()
                        .url("http://40.117.195.60:4000/users/authenticate")
                        .post(body)
                        .header("Accept", "application/json")
                        .header("Content-Type", "application/json")
                        .build();

                //  .url("http://40.117.195.60:8080/users/register")
                //  .url("https://reqres.in/api/users")
                //https://reqres.in/ for testing
                new MyAsyncTaskMain().execute(request);
            }
        });

    }


    public void navRegisterUser(View view) {
        Intent intent = new Intent(this, RegistrationScreen.class);
        startActivity(intent);
        // Do something in response to button
    }

    public void navMainScreen(){


        Intent intent = new Intent(this, HomeScreenActivity.class);
        startActivity(intent);

        //try {
            //String token = jsonObject.getString("token");
            /*
            Boolean isTeacher = jsonObject.getBoolean("isTeacher");
            JSONArray coursesArray = jsonObject.getJSONArray("courses");

            MySingletonClass.getInstance().setName(username.getText().toString());

            for (int i = 0; i < coursesArray.length(); i++) {
                JSONObject object = coursesArray.getJSONObject(i);

                Log.i("idf", object.toString());
            }

            Log.i("idf", token);

            */


        //} catch (Exception e){

        //}
    }

    class MyAsyncTaskMain extends AsyncTask<Request, Void, Response> {

        @Override
        protected okhttp3.Response doInBackground(Request... requests) {
            okhttp3.Response response = null;
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




                //try {
                //String token = jsonObject.getString("token");
            /*
            Boolean isTeacher = jsonObject.getBoolean("isTeacher");
            JSONArray coursesArray = jsonObject.getJSONArray("courses");

            MySingletonClass.getInstance().setName(username.getText().toString());

            for (int i = 0; i < coursesArray.length(); i++) {
                JSONObject object = coursesArray.getJSONObject(i);

                Log.i("idf", object.toString());
            }*/

                try{

                    JSONObject Jobject = new JSONObject(jsonData);
                    String token = Jobject.getString("token");
                    MySingletonClass.getInstance().setToken(token);
                    Log.i("idf", token);

//                    String isTeacher = Jobject.getString("isTeacher");
//                    Boolean isTeacher_bool = Boolean.parseBoolean(isTeacher);
//                    MySingletonClass.getInstance().setIsteacher(isTeacher_bool);
//                    Log.i("idf", token);

                    String userName = Jobject.getString("username");
                    MySingletonClass.getInstance().setName(userName);
                    Log.i("idf", userName);

                    JSONArray classes = Jobject.getJSONArray("courses");

                    ArrayList<String> classList = new ArrayList<String>();
                    if (classes != null) {
                        int len = classes.length();
                        for (int i=0;i<len;i++){
                            classList.add(classes.get(i).toString());
                        }
                    }

                    MySingletonClass.getInstance().setClasses(classList);


                    navMainScreen();

                } catch(Exception e){

                }

            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());

            }


        }

    }

}
