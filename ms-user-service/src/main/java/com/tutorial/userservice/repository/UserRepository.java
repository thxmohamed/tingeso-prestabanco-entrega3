package com.tutorial.userservice.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.tutorial.userservice.entity.UserEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    public UserEntity findByEmail(String email);
}

