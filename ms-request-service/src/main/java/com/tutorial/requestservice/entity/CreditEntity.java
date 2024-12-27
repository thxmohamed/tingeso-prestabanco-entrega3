package com.tutorial.requestservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "Credit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long clientID;
    @Enumerated(EnumType.STRING)
    private LoanType loanType;
    public enum LoanType {
        PRIMERA_VIVIENDA,
        SEGUNDA_VIVIENDA,
        PROPIEDADES_COMERCIALES,
        REMODELACION
    }
    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status{
        E1_EN_REVISION_INICIAL,
        E2_PENDIENTE_DOCUMENTACION,
        E3_EN_EVALUACION,
        E4_PRE_APROBADA,
        E5_EN_APROBACION_FINAL,
        E6_APROBADA,
        E7_RECHAZADA,
        E8_CANCELADA_POR_CLIENTE,
        APPROVED, E9_EN_DESEMBOLSO
    };
    private float requestedAmount;
    private int yearsLimit;
    private float interestRate;
    private int propertyValue;
    private float monthlyFee;
    private float insurance;
    private float administrationCommission;
    private String observations;
}
