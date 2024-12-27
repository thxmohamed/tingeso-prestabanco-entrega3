package com.tutorial.userservice.service;

import com.tutorial.userservice.repository.UserRepository;
import com.tutorial.userservice.entity.UserEntity;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.NoSuchElementException;

@Data
@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public ArrayList<UserEntity> getUsers() {
        return (ArrayList<UserEntity>) userRepository.findAll();
    }

    public UserEntity getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserEntity registerUser(UserEntity user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("El email ya está registrado.");
        }
        return userRepository.save(user);
    }

    public UserEntity getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Usuario no encontrado para el ID: " + id));
    }

    public UserEntity login(UserEntity user) {
        UserEntity userDB = userRepository.findByEmail(user.getEmail());
        if (userDB == null) {
            throw new NoSuchElementException("El email no está registrado.");
        }
        if (userDB.getPassword().equals(user.getPassword())) {
            return userDB;
        } else {
            throw new IllegalArgumentException("Contraseña incorrecta.");
        }
    }
}

