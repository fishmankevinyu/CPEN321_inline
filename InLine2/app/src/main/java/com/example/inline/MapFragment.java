package com.example.inline;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import com.google.android.gms.common.wrappers.PackageManagerWrapper;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PointOfInterest;
import com.google.android.gms.tasks.Task;

public class MapFragment extends Fragment implements OnMapReadyCallback,
        GoogleMap.OnPoiClickListener,
        ActivityCompat.OnRequestPermissionsResultCallback {

    private MapView mMapView;
    FusedLocationProviderClient fusedLocationProviderClient;
    //private GoogleMap mMap;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
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
        LatLng MATH100 = new LatLng(49.266326, -123.254789);
        LatLng CHEM200 = new LatLng(49.266012, -123.253058);

        mMap.addMarker(new MarkerOptions().position(CPEN321).title("CPEN321").snippet("MCLD"));
        mMap.addMarker(new MarkerOptions().position(MATH100).title("MATH100").snippet("MATH"));
        mMap.addMarker(new MarkerOptions().position(CHEM200).title("CHEM200").snippet("CHEM"));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(CPEN321));
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
}
