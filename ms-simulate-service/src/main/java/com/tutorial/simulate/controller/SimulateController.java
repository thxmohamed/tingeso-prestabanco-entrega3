package com.tutorial.simulate.controller;

import com.tutorial.simulate.entity.SimulateEntity;
import com.tutorial.simulate.service.SimulateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/simulate")
public class SimulateController {

    @Autowired
    SimulateService simulateService;

    @PostMapping("")
    public ResponseEntity<Integer> simulateCredit(@RequestBody SimulateEntity credit) {
        int monthlyPayment = simulateService.creditSimulate(credit);
        return ResponseEntity.ok(monthlyPayment);
    }
}
