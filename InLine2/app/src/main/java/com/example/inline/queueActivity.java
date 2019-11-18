package com.example.inline;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class queueActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_queue);
        TextView courseTextView = (TextView) findViewById(R.id.enqueCourseName);
        courseTextView.setText(MySingletonClass.getInstance().getCourseQueue());
    }
}
