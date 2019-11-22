package com.example.inline;

import java.util.HashMap;

public class CourseSingletonClass {
    private static CourseSingletonClass instance;

    private String coursename;
    //private HashMap<String, String> lat;
    //private HashMap<String, String> lng;

    public static CourseSingletonClass getInstance() {
        if (instance == null)
            instance = new CourseSingletonClass();
        return instance;
    }

    private CourseSingletonClass() {
    }


    public String getCourse() { return coursename; }
    public void setCourse(String coursename) { this.coursename = coursename; }

    /*
    public String getCourseLat(String coursename) {
        return lat.get(coursename);
    }
    public void setCourseLat (String coursename, double courseLat) {
        lat.put(coursename, String.valueOf(courseLat));
    }

    public String getCourseLng(String coursename) {
        return lng.get(coursename);
    }
    public void setCourseLng (String coursename, double courseLng) {
        lng.put(coursename, String.valueOf(courseLng));
    }
    */
}
