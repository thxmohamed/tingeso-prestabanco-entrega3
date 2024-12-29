package com.example.proyecto.Repositories;

import com.example.proyecto.Entities.CreditEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Repository
public interface CreditRepository extends JpaRepository<CreditEntity, Long>{
    public ArrayList<CreditEntity> findByClientID(Long clientID);
    @Modifying
    @Transactional
    @Query("UPDATE CreditEntity c SET c.status = ?2 WHERE c.id = ?1")
    void updateCreditStatus(Long id, CreditEntity.Status status);
    @Modifying
    @Transactional
    @Query("UPDATE CreditEntity c SET c.observations = :observations WHERE c.id = :id")
    int updateObservations(Long id, String observations);
}
