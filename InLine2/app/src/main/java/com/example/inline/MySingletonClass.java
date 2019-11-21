package com.example.inline;

import java.util.ArrayList;

public class MySingletonClass {
    private static MySingletonClass instance;

    private String username;
    private String mToken; //This is for push notificaitons
    private String token;
    private ArrayList<String> classes;
    private ArrayList<String> allClasses;
    private boolean isteacher;
    private String userId;

    public static MySingletonClass getInstance() {
        if (instance == null)
            instance = new MySingletonClass();
        return instance;
    }

    private MySingletonClass() {
    }

    public String getName() { return username;}
    public void setName(String username) { this.username = username;}

    public boolean getIsteacher() {return this.isteacher;}
    public void setIsteacher(boolean isteacher) {this.isteacher = isteacher;}

    public void setmToken(String mtoken){ this.mToken = mtoken;} //For push notifications
    public String getmToken(){return this.mToken;}

    public void setToken(String token){ this.token = token;} //userId
    public String getToken(){return this.token;}

    public void setId(String id){ this.userId = id;} //userId
    public String getId(){return this.userId;}

    public void setClasses(ArrayList<String> classes){ this.classes = classes;}
    public ArrayList<String> getClasses(){return this.classes;}

    ////////////////Course Operation///////////////////////////
    private String coursename_queue;
    public void setCourseQueue(String coursename_queue) { this.coursename_queue = coursename_queue;}
    public String getCourseQueue(){return this.coursename_queue;}

    private String coursename_settime;
    public void setCourseSettime(String coursename_settime) { this.coursename_settime = coursename_settime;}
    public String getCourseSettime(){return this.coursename_settime;}

    public void setAllClasses(ArrayList<String> allClasses){ this.allClasses = allClasses;}
    public ArrayList<String> getAllClasses(){return this.allClasses;}
}