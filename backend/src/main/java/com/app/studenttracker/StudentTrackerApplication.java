package com.app.studenttracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class StudentTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentTrackerApplication.class, args);
    }

}
