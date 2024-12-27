package com.tutorial.evaluation.clients;

import com.tutorial.evaluation.configurations.FeignClientConfig;
import com.tutorial.evaluation.model.CreditModel;
import com.tutorial.evaluation.model.DocumentModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-request-service", path = "/request", configuration = {FeignClientConfig.class})
public interface RequestClient {
    @GetMapping("/credit/find/{id}")
    CreditModel getCreditById(@PathVariable Long id);

    @GetMapping("/file/{id}")
    List<DocumentModel>getDocumentsByCreditId(@PathVariable Long id);

    @GetMapping("file/download/{id}")
    byte[] downloadFile(@PathVariable Long id);
}
