package com.example.inline;


import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PointOfInterest;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

public class MapFragment extends Fragment implements OnMapReadyCallback,
        GoogleMap.OnPoiClickListener,
        ActivityCompat.OnRequestPermissionsResultCallback {

    private MapView mMapView;

    //private GoogleMap mMap;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        //if(MySingletonClass.getInstance().getAllCourseCoordinates() == null) {
        getCourseLocations();
        //}
        // inflat and return the layout
        View v = inflater.inflate(R.layout.fragment_map, container, false);
        mMapView = (MapView) v.findViewById(R.id.mapView);
        mMapView.onCreate(savedInstanceState);
        mMapView.onResume();// needed to get the map to display immediately


        //fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(getActivity());
        //GetLastLocation();

        try {
            MapsInitializer.initialize(getActivity().getApplicationContext());
        } catch (Exception e) {
            e.printStackTrace();
        }

        mMapView.getMapAsync(this);
        return v;
    }
/*
    private void GetLastLocation() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[] {

            });
        }
        Task<Location> task = fusedLocationProviderClient.getLastLocation();
    }
*/
    @Override
    public void onPoiClick(PointOfInterest poi) {
        Toast.makeText(getActivity().getApplicationContext(), "Clicked: " +
                        poi.name + "\nPlace ID:" + poi.placeId +
                        "\nLatitude:" + poi.latLng.latitude +
                        " Longitude:" + poi.latLng.longitude,
                Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {

        GoogleMap mMap;
        mMap = googleMap;
        googleMap.setOnPoiClickListener(this);


        LatLng CPEN321 = new LatLng(49.261885, -123.248379);
        mMap.moveCamera(CameraUpdateFactory.newLatLng(CPEN321));
        /*
        LatLng MATH100 = new LatLng(49.266326, -123.254789);
        LatLng CHEM200 = new LatLng(49.266012, -123.253058);

        mMap.addMarker(new MarkerOptions().position(CPEN321).title("CPEN321").snippet("MCLD"));
        mMap.addMarker(new MarkerOptions().position(MATH100).title("MATH100").snippet("MATH"));
        mMap.addMarker(new MarkerOptions().position(CHEM200).title("CHEM200").snippet("CHEM"));
        */

        ArrayList<courseCoordinates> courseList = MySingletonClass.getInstance().getAllCourseCoordinates();

        if (courseList != null){

            Log.i("idf", "asdasdf");

            for(int i = 0; i < courseList.size(); i++){

                    LatLng tempCord = new LatLng(courseList.get(i).lat, courseList.get(i).lng);

                    mMap.addMarker(new MarkerOptions().position(tempCord).title(courseList.get(i).courseName));

            }

        }
    }


    @Override
    public void onResume() {
        super.onResume();
        mMapView.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        mMapView.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mMapView.onDestroy();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mMapView.onLowMemory();
    }

    protected void getCourseLocations(){

        Request request = new Request.Builder()
                .get()
                .url("http://40.117.195.60:4000/location/all/" + MySingletonClass.getInstance().getName())
                .addHeader("Authorization", "Bearer " + MySingletonClass.getInstance().getToken())
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .build();


        new getCourseLocations().execute(request);

    }

    public class getCourseLocations extends OkHTTPService {

        @Override
        protected void onPostExecute(Response Aresponse) {

            try {
                if (Aresponse == null) throw new IOException("Unexpected code " + Aresponse);
                if (!Aresponse.isSuccessful()) throw new IOException("Unexpected code " + Aresponse);



                ResponseBody responseBodyCopy = Aresponse.peekBody(Long.MAX_VALUE);
                String jsonData = responseBodyCopy.string();

                Log.i("idf", jsonData);
                //String jsonData = Aresponse.body().string();

                ArrayList<courseCoordinates> courseList = new ArrayList<courseCoordinates>();

                try {
                        JSONObject Jobject = new JSONObject(jsonData);

                        JSONArray arrayOfClassInfo = Jobject.getJSONArray("array");

                        for(int i = 0; i < arrayOfClassInfo.length(); i++){

                            Log.i("idf", arrayOfClassInfo.get(i).toString());

                            if(!arrayOfClassInfo.get(i).toString().equals("null")) {

                                Double latitude = arrayOfClassInfo.getJSONObject(i).getDouble("lat");
                                Double longitude = arrayOfClassInfo.getJSONObject(i).getDouble("lng");
                                String courseName = arrayOfClassInfo.getJSONObject(i).getString("coursename");

                                courseCoordinates temp = new courseCoordinates(latitude, longitude, courseName);

                                courseList.add(temp);
                            }
                        }

                        MySingletonClass.getInstance().setAllCourseCoordinates(courseList);


                } catch (Exception e) {
                }
            } catch (IOException e) {
                e.printStackTrace();
                Log.i("idf", e.getLocalizedMessage());
            }
        }
    }

}
