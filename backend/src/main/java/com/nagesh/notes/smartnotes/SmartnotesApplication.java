package com.nagesh.notes.smartnotes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@EnableAsync         // enables async methods with @Async
@EnableScheduling    // enables scheduled tasks with @Scheduled
public class SmartnotesApplication {

    private static final Logger logger = LoggerFactory.getLogger(SmartnotesApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SmartnotesApplication.class, args);
        logger.info("🚀 Smart Notes Application started successfully!");
    }
}
