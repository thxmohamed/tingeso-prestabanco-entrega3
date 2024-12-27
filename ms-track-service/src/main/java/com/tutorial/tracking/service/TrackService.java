package com.tutorial.tracking.service;

import com.tutorial.tracking.clients.CreditClient;
import com.tutorial.tracking.entity.CreditEntity;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Data
@Service
public class TrackService {
    @Autowired
    CreditClient creditClient;

    public List<CreditEntity> getClientCredits(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Client ID cannot be null");
        }

        System.out.println("Consultando créditos para el usuario con ID: " + id);

        List<CreditEntity> creditEntities = creditClient.getCreditByUserId(id);

        if (creditEntities == null) {
            throw new IllegalStateException("No se encontraron créditos para el usuario con ID: " + id);
        }
        return creditEntities;
    }


    public CreditEntity getCreditById(Long id) {
        return creditClient.getCreditById(id);
    }

}

