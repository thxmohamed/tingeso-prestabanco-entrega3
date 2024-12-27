package com.tutorial.userservice.controller;

import com.tutorial.userservice.entity.UserEntity;
import com.tutorial.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/")
    public ResponseEntity<List<UserEntity>> listUsers(){
        List<UserEntity> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Long id){
        UserEntity user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody UserEntity user){
        try {
            UserEntity userDB = userService.getByEmail(user.getEmail());
            if(userDB != null){
                return ResponseEntity.badRequest().body("Email already exists");
            }
            UserEntity createdUser = userService.registerUser(user);
            return ResponseEntity.ok().body("user successfully registered");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error registering user: " + e.getMessage());
        }
    }

    @PostMapping(path = "/login")
    public ResponseEntity<?> login(@RequestBody UserEntity customer){
        UserEntity customerDB = userService.login(customer);
        if (customerDB != null) {
            return ResponseEntity.ok(customerDB);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect credentials");
        }
    }

}
