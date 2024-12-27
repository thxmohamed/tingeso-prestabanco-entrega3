import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../App.css";
import checkrulesService from '../services/checkrules.service';
import creditService from '../services/credit.service';

const CreditEvaluationP2 = () => {
  const navigate = useNavigate();
  const { creditID } = useParams();

  const [evaluationData, setEvaluationData] = useState({
    quoteIncomeRatioCheck: false,
    creditHistoryCheck: false,
    employmentStabilityCheck: false,
    minimumBalanceCheck: false,
    savingHistoryCheck: false,
    periodicDepositsCheck: false,
    balanceYearsAgoCheck: false,
    recentWithdrawalsCheck: false,
    currentDebtCheck: false,
    applicantAgeCheck: false,
    currentDebt: 0.0,
  });

  const [calculatedChecks, setCalculatedChecks] = useState({
    installmentIncomeRatio: false,
    currentDebt: false,
    applicationAge: false,
  });

  const calculateCurrentDebt = async (clientID) => {
    try {
      const response = await creditService.getByClientID(clientID);
      const credits = response.data;
  
      // Filtrar créditos que no deben ser contabilizados
      const validCredits = credits.filter(credit => 
        credit.status === "E6_APROBADA" || credit.status === "E9_EN_DESEMBOLSO"
      );
  
      // Calcular la deuda total solo con créditos válidos
      const totalDebt = validCredits.reduce((sum, credit) => sum + credit.monthlyFee, 0);
      
      return totalDebt;
    } catch (error) {
      console.error("Error al calcular currentDebt:", error);
      return 0;
    }
  };

  const calculateQuotaIncome = async () => {
    try {
      const result = await checkrulesService.calculateQuotaIncome(creditID);
      if (result.data) {
        setCalculatedChecks((prev) => ({ ...prev, installmentIncomeRatio: true }));
      }
    } catch (error) {
      console.error("Error al calcular relación cuota/ingreso:", error);
    }
  };

  const calculateDebtIncome = async () => {
    try {
      const response = await checkrulesService.getById(creditID);
      const debt = await calculateCurrentDebt(response.data.clientID);
      const result = await checkrulesService.calculateDebtIncome(creditID, debt);
      if (result.data) {
        setCalculatedChecks((prev) => ({ ...prev, currentDebt: true }));
      }
    } catch (error) {
      console.error("Error al calcular deuda actual:", error);
    }
  };

  const calculateApplicationAge = async () => {
    try {
      const result = await checkrulesService.calculateApplicationAge(creditID);
      if (result.data) {
        setCalculatedChecks((prev) => ({ ...prev, applicationAge: true }));
      }
    } catch (error) {
      console.error("Error al calcular edad de postulación:", error);
    }
  };

  const toggleCheck = (checkName) => {
    setEvaluationData((prevData) => ({
      ...prevData,
      [checkName]: !prevData[checkName],
    }));
  };

  const handleEvaluation = async () => {
    try {
      const response = await checkrulesService.getByCreditID(creditID);
      const checkid = response.data?.id;
      const clientID = response.data?.clientID;
  
      if (!checkid) {
        alert("Error: No se pudo encontrar un checkid válido.");
        return;
      }
  
      const currentDebt = await calculateCurrentDebt(clientID);
      setEvaluationData((prevData) => ({
        ...prevData,
        currentDebt: currentDebt,
      }));
  
      const result = await checkrulesService.creditEvaluation(checkid, {
        ...evaluationData,
        currentDebt: currentDebt,
      });
  
      const checkRulesResponse = await checkrulesService.getById(checkid);
      const creditResponse = await creditService.getByID(creditID);
      const checkRulesEntity = checkRulesResponse.data;
  
      // Reglas críticas
      const criticalRules = {
        rule1: "relación cuota/ingreso",
        rule2: "historial crediticio del cliente",
        rule3: "antigüedad laboral y estabilidad",
        rule4: "relación deuda/ingreso",
        rule6: "edad del solicitante",
      };
  
      let criticalObservation = "";
      for (const [rule, description] of Object.entries(criticalRules)) {
        if (!checkRulesEntity[rule]) {
          criticalObservation = `Se rechazó la solicitud por no cumplir con ${description}.`;
          break;
        }
      }
  
      if (criticalObservation) {
        await creditService.updateStatus(creditID, "E7_RECHAZADA");
        await creditService.updateObservations(creditID, criticalObservation);
        alert("El crédito ha sido rechazado. Motivo: " + criticalObservation);
        return;
      }
  
      // Reglas opcionales
      const optionalRules = {
        rule71: "saldo mínimo requerido",
        rule72: "historial de ahorro consistente",
        rule73: "depósitos periódicos",
        rule74: "relación saldo/años de antigüedad",
        rule75: "retiros recientes",
      };
  
      const failedOptionalRules = Object.entries(optionalRules).filter(
        ([rule]) => !checkRulesEntity[rule]
      );
  
      const failedOptionalRulesCount = failedOptionalRules.length;
      let optionalObservation = "";
  
      if (failedOptionalRulesCount > 0) {
        optionalObservation = `El crédito no cumplió con ${failedOptionalRulesCount} reglas opcionales.`;
      }
  
      if (failedOptionalRulesCount === 0) {
        await creditService.updateStatus(creditID, "E4_PRE_APROBADA");
        await creditService.updateObservations(creditID, "");
        alert("El crédito ha sido pre-aprobado.");
      } else if (failedOptionalRulesCount <= 2) {
        await creditService.updateStatus(creditID, "E2_PENDIENTE_DOCUMENTACION");
        await creditService.updateObservations(creditID, optionalObservation);
        alert("El crédito está pendiente de documentación adicional.");
      } else {
        await creditService.updateStatus(creditID, "E7_RECHAZADA");
        await creditService.updateObservations(creditID, optionalObservation);
        alert("El crédito ha sido rechazado. Motivo: " + optionalObservation);
      }
  
      if (result.success) {
        alert('Evaluación enviada');
      } else {
        alert('Hubo un error en la evaluación');
      }
    } catch (error) {
      console.error("Error en la evaluación de crédito:", error);
      alert('Error al enviar la evaluación');
    }
  };

  return (
    <div className="credit-evaluation-container">
      <h2>Evaluación de Crédito</h2>

      <button className="go-back-button" onClick={() => navigate(-1)}>
        Atrás
      </button>

      <div className="credit-evaluation">
        {[
          { label: "Historial Crediticio", key: "creditHistoryCheck" },
          { label: "Antigüedad Laboral y Estabilidad", key: "employmentStabilityCheck" },
          { label: "Saldo Mínimo Requerido", key: "minimumBalanceCheck" },
          { label: "Historial de Ahorro Consistente", key: "savingHistoryCheck" },
          { label: "Depósitos Periódicos", key: "periodicDepositsCheck" },
          { label: "Relación Saldo/Años Antigüedad", key: "balanceYearsAgoCheck" },
          { label: "Retiros Recientes", key: "recentWithdrawalsCheck" },
        ].map(({ label, key }) => (
          <div className="rule" key={key}>
            <p>{label}</p>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={evaluationData[key]}
                onChange={() => toggleCheck(key)}
              />
              <span className="checkmark"></span>
            </label>
          </div>
        ))}

        {/* Nuevas verificaciones con botón Calcular */}
        <div className="additional-verifications">
          {[
            {
              label: "Relación Cuota/Ingreso",
              key: "quoteIncomeRatioCheck",
              onClick: calculateQuotaIncome,
              calculatedKey: "installmentIncomeRatio",
            },
            {
              label: "Deuda Actual",
              key: "currentDebtCheck",
              onClick: calculateDebtIncome,
              calculatedKey: "currentDebt",
            },
            {
              label: "Edad de Postulación",
              key: "applicantAgeCheck",
              onClick: calculateApplicationAge,
              calculatedKey: "applicationAge",
            },
          ].map(({ label, key, onClick, calculatedKey }) => (
            <div className="verification-item" key={key}>
              <p>{label}</p>
              <div className="verification-controls">
                <button
                  className={calculatedChecks[calculatedKey] ? "btn-calculate-success" : "btn-calculate"}
                  onClick={onClick}
                  disabled={calculatedChecks[calculatedKey]}
                >
                  Calcular
                </button>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={evaluationData[key]}
                    onChange={() => toggleCheck(key)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleEvaluation} className="btn-submit">Enviar Evaluación</button>
      </div>
    </div>
  );
};

export default CreditEvaluationP2;
