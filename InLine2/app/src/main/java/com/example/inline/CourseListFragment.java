package com.example.inline;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.fragment.app.Fragment;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CourseListFragment extends Fragment {
    private OkHttpClient client = new OkHttpClient();
    public JSONArray classList;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_course_list, container, false);

        /*
        JSONObject class1 = new JSONObject();
        try {
            class1.put("id", "CPEN321");
        } catch (JSONException e) {
        }

        JSONObject class2 = new JSONObject();
        try {
            class2.put("id", "CPEN331");
        } catch (JSONException e) {
        }

        classList = new JSONArray();
        classList.put(class1);
        classList.put(class2);*/

        classList = new JSONArray();
        ArrayList<String> classes = MySingletonClass.getInstance().getClasses();

        for (String courses : classes){
            try {
                JSONObject tempObj = new JSONObject();
                tempObj.put("id", courses);
                classList.put(tempObj);
            } catch (JSONException e) {
            }
        }

        //getCourseList();

        JSONObject json_data;

        ArrayList<String> classListNames = new ArrayList<String>();

        for(int i=0; i < classList.length() ; i++) {
            try {
                json_data = classList.getJSONObject(i);
                String courseName = json_data.getString("id");
                classListNames.add(courseName);
            } catch (JSONException e) {
            }
        }

        ArrayAdapter adapter = new ArrayAdapter<String>(getActivity().getApplicationContext(),
                R.layout.activity_listview, classListNames);

        ListView listView = (ListView) view.findViewById(R.id.mobile_list);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                String coursename = getCourseInfo(position);
                CourseSingletonClass.getInstance().setCourse(coursename);

                MediaType MEDIA_TYPE = MediaType.parse("application/json");
                JSONObject postdata1 = new JSONObject();
                try {
                    postdata1.put("coursename", coursename);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                RequestBody body = RequestBody.create(MEDIA_TYPE, postdata1.toString());

                Request request = new Request.Builder()
                        .url("http://40.117.195.60:4000/time/get")
                        .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                        .post(body)
                        .header("Accept", "application/json")
                        .header("Content-Type", "application/json")
                        .build();

                new CourseListFragment.MyAsyncTask().execute(request);


                /*
                Intent intent = new Intent(CourseListFragment.this.getActivity(), QueueActivity.class);
                startActivity(intent);*/

                //String coursename = getCourseInfo(position);
                //Log.e(TAG, "onItemClick: courseInfo lalala");
                //registerCourse(coursename, MySingletonClass.getInstance().getName());
                //Log.e(TAG, "onItemClick: registerCourse lalala" + MySingletonClass.getInstance().getName());
            }
        });
        return view;
    }

    private String getCourseInfo(int position) {
        try {
            JSONObject classInformation = classList.getJSONObject(position);
            String courseName = classInformation.getString("id");
            return courseName;

            //Here we search the backend for this course information with the course name
            //We send the request to the backend for course info
        } catch (JSONException e) {
            return null;
        }
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
                String jsonData = response.body().string();
                Log.i("idf", jsonData);

                try{
                    JSONObject Jobject = new JSONObject(jsonData);
                    String hour = Jobject.getString("hour");
                    String minite = Jobject.getString("minute");
                    String day = Jobject.getString("dayOfWeek");
                    String dayOfWeek = "";
                    switch (day) {
                        case "1":
                            dayOfWeek = "MON";
                            break;
                        case "2":
                            dayOfWeek = "TUE";
                            break;
                        case "3":
                            dayOfWeek = "WED";
                            break;
                        case "4":
                            dayOfWeek = "THU";
                            break;
                        case "5":
                            dayOfWeek = "FRI";
                            break;
                        case "6":
                            dayOfWeek = "SAT";
                            break;
                        case "0":
                            dayOfWeek = "SUN";
                            break;
                        default:break;
                    }
                    if(minite.length() < 2){ //For case where minute are a single digit
                        minite = "0" + minite;
                    }
                    String officeHourTime = hour+":"+minite+" "+dayOfWeek;
                    CourseSingletonClass.getInstance().setdayOfWeek(dayOfWeek);
                    CourseSingletonClass.getInstance().setHour(hour);
                    CourseSingletonClass.getInstance().setminute(minite);
                    CourseSingletonClass.getInstance().setOfficeHourTime(officeHourTime);
                }
                catch(Exception e){
                }

                finally{
                    Intent intent = new Intent(CourseListFragment.this.getActivity(), QueueActivity.class);
                    startActivity(intent);
                }
            }
            catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }
        }

    }

}
