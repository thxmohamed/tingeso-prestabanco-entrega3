package com.tutorial.simulate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class SimulateApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimulateApplication.class, args);
	}

}
