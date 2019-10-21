package com.example.inline;

public class MySingletonClass {
    private static MySingletonClass instance;

    public static MySingletonClass getInstance() {
        if (instance == null)
            instance = new MySingletonClass();
        return instance;
    }

    private MySingletonClass() {
    }

    private String username;

    public String getName() {
        return username;
    }

    public void setName(String username) {
        this.username = username;
    }
}