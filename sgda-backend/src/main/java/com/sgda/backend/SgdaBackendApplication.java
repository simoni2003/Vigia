package com.sgda.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SgdaBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SgdaBackendApplication.class, args);
    }
}
