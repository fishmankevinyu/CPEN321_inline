package com.example.inline;

public class CourseSingletonClass {
    private static CourseSingletonClass instance;

    private String coursename;

    public static CourseSingletonClass getInstance() {
        if (instance == null)
            instance = new CourseSingletonClass();
        return instance;
    }

    private CourseSingletonClass() {
    }


    public String getCourse() { return coursename; }

    public void setCourse(String coursename) { this.coursename = coursename; }
}
