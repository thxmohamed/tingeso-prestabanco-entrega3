package com.tutorial.tracking.clients;

import com.tutorial.tracking.configurations.FeignClientConfig;
import com.tutorial.tracking.entity.CreditEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-request-service", path = "/request", configuration = {FeignClientConfig.class})
public interface CreditClient {
    @GetMapping("/credit/find/{id}")
    CreditEntity getCreditById(@PathVariable Long id);

    @GetMapping("/credit/{id}")
    List<CreditEntity> getCreditByUserId(@PathVariable Long id);
}
