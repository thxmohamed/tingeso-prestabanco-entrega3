package com.example.proyecto.Entities;

import jakarta.persistence.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String lastName;
    @Enumerated(EnumType.STRING)
    private Rol rol;
    public enum Rol{
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
