package com.example.proyecto.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.proyecto.Entities.UserEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    public UserEntity findByEmail(String email);
}
