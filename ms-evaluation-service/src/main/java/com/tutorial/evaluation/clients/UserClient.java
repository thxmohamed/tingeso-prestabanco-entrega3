package com.tutorial.evaluation.clients;

import com.tutorial.evaluation.model.UserModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.FeignClientProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "ms-user-service", path = "/user", configuration = {FeignClientProperties.FeignClientConfiguration.class})
public interface UserClient {
    @GetMapping("/{id}")
    UserModel getUserById(@PathVariable("id") Long id);
}
