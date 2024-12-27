package com.tutorial.evaluation.repository;

import com.tutorial.evaluation.entity.CheckRulesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CheckRulesRepository extends JpaRepository<CheckRulesEntity, Long> {
    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule1 = :rule1 WHERE c.id = :id")
    void updateRule1(@Param("id") Long id, @Param("rule1") boolean rule1);

    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule2 = :rule2 WHERE c.id = :id")
    void updateRule2(@Param("id") Long id, @Param("rule2") boolean rule2);

    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule3 = :rule3 WHERE c.id = :id")
    void updateRule3(@Param("id") Long id, @Param("rule3") boolean rule3);

    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule4 = :rule4 WHERE c.id = :id")
    void updateRule4(@Param("id") Long id, @Param("rule4") boolean rule4);

    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule6 = :rule6 WHERE c.id = :id")
    void updateRule6(@Param("id") Long id, @Param("rule6") boolean rule6);

    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule71 = :rule71 WHERE c.id = :id")
    void updateRule71(@Param("id") Long id, @Param("rule71") boolean rule71);

    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule72 = :rule72 WHERE c.id = :id")
    void updateRule72(@Param("id") Long id, @Param("rule72") boolean rule72);

    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule73 = :rule73 WHERE c.id = :id")
    void updateRule73(@Param("id") Long id, @Param("rule73") boolean rule73);

    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule74 = :rule74 WHERE c.id = :id")
    void updateRule74(@Param("id") Long id, @Param("rule74") boolean rule74);

    @Modifying
    @Query("UPDATE CheckRulesEntity c SET c.rule75 = :rule75 WHERE c.id = :id")
    void updateRule75(@Param("id") Long id, @Param("rule75") boolean rule75);

    Optional<CheckRulesEntity> findByCreditID(Long id);


}
