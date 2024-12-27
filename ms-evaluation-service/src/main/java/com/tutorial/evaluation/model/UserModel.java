package com.tutorial.evaluation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {
    private Long id;
    private String name;
    private String lastName;
    @Enumerated(EnumType.STRING)
    private Rol rol;

    public enum Rol {
        CUSTOMER,
        EXECUTIVE
    }

    @Column(unique = true)
    private String email;
    private String password;
    @Column(unique = true)
    private String rut;
    private float income;
    private int age;
}
