package com.tutorial.evaluation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class CheckRulesApplication {

	public static void main(String[] args) {
		SpringApplication.run(CheckRulesApplication.class, args);
	}

}
