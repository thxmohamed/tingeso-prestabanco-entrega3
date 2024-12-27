package com.tutorial.userservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "user")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
