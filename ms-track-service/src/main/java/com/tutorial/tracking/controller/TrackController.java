package com.tutorial.tracking.controller;

import com.tutorial.tracking.entity.CreditEntity;
import com.tutorial.tracking.service.TrackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/track")
public class TrackController {

    @Autowired
    TrackService trackService;

    @GetMapping("/byuser/{userId}")
    public ResponseEntity<List<CreditEntity>> getCreditByUserId(@PathVariable Long userId) {
        System.out.println(userId);
        List<CreditEntity> creditEntities = trackService.getClientCredits(userId);
        return new ResponseEntity<>(creditEntities, HttpStatus.OK);
    }

    @GetMapping("/credit/{id}")
    public ResponseEntity<CreditEntity> getCreditById(@PathVariable Long id) {
        CreditEntity creditEntity = trackService.getCreditById(id);
        return new ResponseEntity<>(creditEntity, HttpStatus.OK);
    }
}
