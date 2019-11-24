package com.example.inline;

import java.util.HashMap;

public class CourseSingletonClass {
    private static CourseSingletonClass instance;

    private String coursename;
    private String officeHourTime;
    private String hour;
    private String minute;
    private String dayOfWeek;
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

    public String getOfficeHourTime() { return officeHourTime; }
    public void setOfficeHourTime(String officeHourTime) { this.officeHourTime = officeHourTime; }

    public String getHour() { return hour; }
    public void setHour(String hour) { this.hour = hour; }

    public String getminute() { return minute; }
    public void setminute(String minute) { this.minute = minute; }

    public String getdayOfWeek() { return dayOfWeek; }
    public void setdayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

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
