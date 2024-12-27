package com.tutorial.evaluation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditModel {
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
    private float requestedAmount;
    private int yearsLimit;
    private float interestRate;
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

    private int propertyValue;
    private float monthlyFee;
    private float administrationCommission;
    private String observations;
}

