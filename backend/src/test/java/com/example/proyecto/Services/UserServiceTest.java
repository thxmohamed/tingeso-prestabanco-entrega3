package com.example.proyecto.Services;

import com.example.proyecto.Repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.example.proyecto.Entities.UserEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;


    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void whenRegisterUser_ThenCorrect(){
        UserEntity user = new UserEntity();
        user.setEmail("test@gmail.com");
        user.setPassword("12345");
        UserEntity registered = userService.registerUser(user);

        assertThat(registered).isNotNull();
        assertThat(registered.getEmail()).isEqualTo("test@gmail.com");

        UserEntity userDB = userService.getUserById(registered.getId());
        assertThat(userDB.getEmail()).isEqualTo("test@gmail.com");
    }

    @Test void whenRegisterUser_ThenCorrect2(){
        UserEntity user = new UserEntity();
        user.setEmail("test@gmail.com");
        user.setAge(30);
        user.setName("Test");
        user.setLastName("Oyprobando");
        user.setPassword("12345");

        UserEntity registered = userService.registerUser(user);

        assertThat(registered).isNotNull();
        assertThat(registered.getName()).isEqualTo("Test");
        assertThat(registered.getLastName()).isEqualTo("Oyprobando");
    }

    @Test
    void whenRegisterExistingEmail_ThenThrowException() {
        UserEntity user = new UserEntity();
        user.setEmail("test@gmail.com");
        user.setPassword("12345");
        userService.registerUser(user);

        UserEntity duplicateUser = new UserEntity();
        duplicateUser.setEmail("test@gmail.com");
        duplicateUser.setPassword("67890");

        assertThatThrownBy(() -> userService.registerUser(duplicateUser))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("El email ya está registrado.");
    }
    @Test
    void whenGetUserList_ThenCorrect(){
        UserEntity user1 = new UserEntity();
        user1.setEmail("test1@example.com");
        userRepository.save(user1);

        UserEntity user2 = new UserEntity();
        user2.setEmail("test2@example.com");
        userRepository.save(user2);

        ArrayList<UserEntity> users = userService.getUsers();
        assertThat(users).hasSize(2);
    }

    @Test
    void whenGetEmail_ThenCorrect(){
        UserEntity user = new UserEntity();
        user.setEmail("test@gmail.com");
        userService.registerUser(user);

        UserEntity userTest = userService.getByEmail("test@gmail.com");
        assertThat(userTest.getEmail()).isEqualTo("test@gmail.com");
    }

    @Test
    void whenGetUserByID_ThenCorrect(){
        UserEntity user = new UserEntity();
        user.setEmail("test@gmail.com");
        userService.registerUser(user);

        UserEntity userFound = userService.getUserById(user.getId());

        assertThat(userFound).isNotNull();
        assertThat(userFound.getId()).isEqualTo(user.getId());
    }
    @Test
    void whenLogin_ThenCorrect(){
        UserEntity user = new UserEntity();
        user.setEmail("test@gmail.com");
        user.setPassword("12345");
        userService.registerUser(user);

        UserEntity loginAttempt = new UserEntity();
        loginAttempt.setEmail("test@gmail.com");
        loginAttempt.setPassword("12345");

        UserEntity logged = userService.login(loginAttempt);
        assertThat(logged).isNotNull();
        assertThat(logged.getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    void whenGetNonExistingUserById_ThenThrowException() {
        Long nonExistingId = 999L;

        assertThatThrownBy(() -> userService.getUserById(nonExistingId))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessageContaining("Usuario no encontrado para el ID: " + nonExistingId);
    }

    @Test
    void whenLoginWithNonExistingEmail_ThenThrowException() {
        UserEntity loginAttempt = new UserEntity();
        loginAttempt.setEmail("nonexistent@example.com");
        loginAttempt.setPassword("12345");

        assertThatThrownBy(() -> userService.login(loginAttempt))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("El email no está registrado.");
    }

    @Test
    void whenLoginWithIncorrectPassword_ThenThrowException() {
        UserEntity user = new UserEntity();
        user.setEmail("test@gmail.com");
        user.setPassword("12345");
        userService.registerUser(user);

        UserEntity loginAttempt = new UserEntity();
        loginAttempt.setEmail("test@gmail.com");
        loginAttempt.setPassword("wrongpassword");

        assertThatThrownBy(() -> userService.login(loginAttempt))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Contraseña incorrecta.");
    }



}
