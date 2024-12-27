package com.tutorial.simulate.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SimulateEntity {

    private int requestedAmount;
    private int yearsLimit;
    private double interestRate;
}
