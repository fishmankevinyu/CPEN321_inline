package com.example.inline;

import androidx.appcompat.app.AppCompatActivity;

import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;

import okhttp3.RequestBody;
import okhttp3.Response;



import java.io.IOException;

import android.view.SurfaceHolder.Callback;

import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.RequestQueue;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.UnsupportedEncodingException;


public class RegistrationScreen extends AppCompatActivity {

    OkHttpClient client = new OkHttpClient();
    Button btnSend;

    EditText username;
    EditText password;
    EditText firstName;
    EditText lastName;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registration_screen);

        firstName = (EditText)findViewById(R.id.firstName);
        lastName = (EditText)findViewById(R.id.lastName);

        username = (EditText)findViewById(R.id.userName);
        password = (EditText)findViewById(R.id.passWord);

        btnSend = (Button) findViewById(R.id.button);
        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                MediaType MEDIA_TYPE = MediaType.parse("application/json");

                JSONObject postdata = new JSONObject();
                try {
                    postdata.put("firstName", firstName.getText().toString());
                    postdata.put("lastName", lastName.getText().toString());
                    postdata.put("username", username.getText().toString());
                    postdata.put("password", password.getText().toString());
                    postdata.put("isTeacher", MySingletonClass.getInstance().getIsteacher());
                } catch(JSONException e){
                    e.printStackTrace();
                }

                RequestBody body = RequestBody.create(MEDIA_TYPE, postdata.toString());

                /*
                RequestBody requestBody = new MultipartBody.Builder()
                        .setType(MultipartBody.FORM)
                        .addFormDataPart("firstName", "test3")
                        .addFormDataPart("lastName", "yasdf")
                        .addFormDataPart("username", "your-email@email.com")
                        .addFormDataPart("password", "your-email@email.com")
                        .build();

                        This code does not post correctly in json format
                        */


                Request request = new Request.Builder()
                        .url("http://40.117.195.60:4000/users/register")
                        .post(body)
                        .header("Accept", "application/json")
                        .header("Content-Type", "application/json")
                        .build();

                //  .url("http://40.117.195.60:8080/users/register")
                //  .url("https://reqres.in/api/users")
                //https://reqres.in/ for testing
                new MyAsyncTask().execute(request);
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
            //super.onPostExecute(response); what does this line do

            //TODO have a spinner when waiting for asynch wait
            try {
                if(response == null) throw new IOException("Unexpected code " + response);
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

                Log.i("idf", "Response is successful");

                Log.i("idf", response.body().string());

                /* Extra code for debugging
                Headers responseHeaders = response.headers();
                for (int i = 0; i < responseHeaders.size(); i++) {
                    System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    Log.i("idf", responseHeaders.name(i) + ": " + responseHeaders.value(i));
                }*/
            } catch (IOException e) {
               e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());

            }


        }

    }

    public void onCheckboxClicked(View view) {
        // Is the view now checked?
        boolean checked = ((CheckBox) view).isChecked();

        // Check which checkbox was clicked
        switch(view.getId()) {
            case R.id.checkbox_meat:
                if (checked) {MySingletonClass.getInstance().setIsteacher(true);}
                else
                    MySingletonClass.getInstance().setIsteacher(false);
                break;
        }
    }

}

