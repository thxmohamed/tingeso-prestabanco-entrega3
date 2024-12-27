package com.tutorial.evaluation.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "CheckRules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckRulesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long clientID;
    @Column(unique = true)
    private Long creditID;
    private boolean rule1;
    private boolean rule2;
    private boolean rule3;
    private boolean rule4;
    private boolean rule6;
    private boolean rule71;
    private boolean rule72;
    private boolean rule73;
    private boolean rule74;
    private boolean rule75;
}
