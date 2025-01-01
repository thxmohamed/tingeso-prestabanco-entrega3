import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import FileUpload from './FileUpload'; // Importamos FileUpload
import creditService from '../services/credit.service';

const CreditApplication = () => {
  const [form, setForm] = useState({
    loanType: 'Primera Vivienda',
    requestedAmount: '',
    propertyValue: '',
    yearsLimit: '',
  });

  const [monthlyFee, setMonthlyFee] = useState(null);
  const [administrationCommission, setAdministrationCommission] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);  // Estado para controlar si se ha enviado el formulario
  const [showConfirmation, setShowConfirmation] = useState(false);  // Para mostrar la pantalla de confirmación
  const [generatedCreditID, setGeneratedCreditID] = useState(null); // Estado para guardar el ID del crédito
  const navigate = useNavigate();

  const loanTypesMap = {
    "Primera Vivienda": {
      loanType: "PRIMERA_VIVIENDA",
      interestRate: Math.floor(100 * (Math.random() * (5 - 3.5) + 3.5)) / 100,
      maxYears: 30,
      maxFinancingPercentage: 0.8
    },
    "Segunda Vivienda": {
      loanType: "SEGUNDA_VIVIENDA",
      interestRate: Math.floor(100 * (Math.random() * (6 - 4) + 4)) / 100,
      maxYears: 20,
      maxFinancingPercentage: 0.7
    },
    "Propiedades Comerciales": {
      loanType: "PROPIEDADES_COMERCIALES",
      interestRate: Math.floor(100 * (Math.random() * (7 - 5) + 5)) / 100,
      maxYears: 25,
      maxFinancingPercentage: 0.6
    },
    "Remodelación": {
      loanType: "REMODELACION",
      interestRate: Math.floor(100 * (Math.random() * (6 - 4.5) + 4.5)) / 100,
      maxYears: 15,
      maxFinancingPercentage: 0.5
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const selectedLoanType = loanTypesMap[form.loanType];
    const maxFinancingAmount = selectedLoanType.maxFinancingPercentage * form.propertyValue;
    if (form.propertyValue < 1000000) {
      return 'El valor de la propiedad no puede ser inferior a 1,000,000 CLP.';
    }
    if (form.yearsLimit > selectedLoanType.maxYears) {
      return `El plazo máximo para ${form.loanType} es de ${selectedLoanType.maxYears} años.`;
    }
    if (parseFloat(form.requestedAmount) > maxFinancingAmount) {
      return `El monto máximo financiable para ${form.loanType} es $${maxFinancingAmount.toFixed(2)}, que es el ${selectedLoanType.maxFinancingPercentage * 100}% del valor de la propiedad.`;
    }
    if (parseFloat(form.requestedAmount) < form.propertyValue * 0.1) {
      return 'El monto solicitado debe ser al menos el 10% del valor de la propiedad.';
    }
    if (!form.requestedAmount || !form.yearsLimit) {
      return 'Todos los campos son obligatorios.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);

    const clientID = JSON.parse(localStorage.getItem('user')).id;
    const selectedLoanType = loanTypesMap[form.loanType];

    const creditEntity = {
      clientID: clientID,
      loanType: selectedLoanType.loanType,
      requestedAmount: form.requestedAmount,
      yearsLimit: form.yearsLimit,
      interestRate: selectedLoanType.interestRate,
      propertyValue: form.propertyValue,
      status: "E1_EN_REVISION_INICIAL"
    };

    try {
      // Simulamos el crédito para obtener la cuota mensual
      const simulateResponse = await creditService.simulate(creditEntity);
      const monthlyFee = simulateResponse.data + 0.0003 * simulateResponse.data + 20;
      const administrationCommission = creditEntity.requestedAmount * 0.01;
      setMonthlyFee(monthlyFee);
      setAdministrationCommission(administrationCommission);

      // Guardamos el crédito en la base de datos
      const creditData = {
        ...creditEntity,
        monthlyFee: monthlyFee,
        administrationCommission: administrationCommission
      };
      const saveResponse = await creditService.save(creditData);
      const creditID = saveResponse.data.id;
      setGeneratedCreditID(creditID);
      setShowConfirmation(true);  // Mostramos la pantalla de confirmación
    } catch (error) {
      console.error("Error en la simulación o guardado del crédito:", error);
      setError('Ocurrió un error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setIsSubmitted(true);
    setShowConfirmation(false);
  };

  const handleBack = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="credit-application-container">
      <h1>Solicitud de Crédito</h1>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="credit-form">
          <div className="form-group">
            <label>Tipo de Préstamo</label>
            <select
              name="loanType"
              value={form.loanType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Primera Vivienda">Primera Vivienda</option>
              <option value="Segunda Vivienda">Segunda Vivienda</option>
              <option value="Propiedades Comerciales">Propiedades Comerciales</option>
              <option value="Remodelación">Remodelación</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monto Solicitado ($)</label>
            <input
              type="number"
              name="requestedAmount"
              value={form.requestedAmount}
              onChange={handleChange}
              required
              placeholder="Ej. 100000"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>Valor de la Propiedad ($)</label>
            <input
              type="number"
              name="propertyValue"
              value={form.propertyValue}
              onChange={handleChange}
              required
              placeholder="Ej. 150000"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>Plazo (años)</label>
            <input
              type="number"
              name="yearsLimit"
              value={form.yearsLimit}
              onChange={handleChange}
              required
              placeholder="Ej. 15"
              className="input-field"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Procesando...' : 'Adjuntar Archivos'}
          </button>

          <button className="logout-button" onClick={() => navigate('/home')}>
            Atrás
          </button>

          {monthlyFee && (
            <p className="success">
              La cuota mensual a pagar es de ${monthlyFee}
            </p>
          )}
        </form>
      ) : (
        <FileUpload creditID={generatedCreditID} loanType={form.loanType} />
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h2>Confirmación de Crédito</h2>
            <p><strong>Tipo de Préstamo:</strong> {form.loanType}</p>
            <p><strong>Monto Solicitado:</strong> ${form.requestedAmount}</p>
            <p><strong>Valor de la Propiedad:</strong> ${form.propertyValue}</p>
            <p><strong>Plazo:</strong> {form.yearsLimit} años</p>
            <p><strong>Tasa de interés:</strong> {}</p>
            <p><strong>Cuota Mensual:</strong> ${monthlyFee.toFixed(0)}</p>
            <p><strong>Comisión de Administración:</strong> ${administrationCommission.toFixed(0)}</p>

            <p><strong>Una vez pulses en continuar, no podrás volver atrás. ¿Estás seguro que quieres continuar?</strong></p>

            <button onClick={handleBack} className="logout-button">Volver</button>
            <button onClick={handleContinue} className="button">Continuar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditApplication;
