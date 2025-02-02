import React, { useState } from 'react';
import creditService from '../services/credit.service';
import { useNavigate } from 'react-router-dom';
import "../App.css";

const CreditSimulate = () => {
  const [form, setForm] = useState({
    interestRate: '',
    yearsLimit: '',
    requestedAmount: ''
  });
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [administrationCommission, setAdministrationCommission] = useState(null);
  const [yearsLimit, setYearsLimit] = useState(null);
  const [error, setError] = useState('');

  // Maneja los cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/home');
  };

  // Enviar los datos a través del servicio de simulación de crédito
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar error previo

    // Validaciones específicas
    if (form.interestRate < 0) {
      setError('La tasa de interés debe ser un valor positivo.');
      return;
    }

    if(form.interestRate == 0){
      setError('La tasa de interés no puede ser 0.');
      return;
    }

    if(form.interestRate > 10){
      setError('La tasa de interés colocada es demasiado alta. Debe ser menor a un 10% anual.');
      return;
    }

    if (form.yearsLimit < 1) {
      setError('El plazo debe ser de al menos 1 año.');
      return;
    }

    if (form.yearsLimit > 30) {
      setError('El plazo no puede superar los 30 años.');
      return;
    }

    if(form.requestedAmount < 0){
      setError('El monto solicitado debe ser un valor positivo.');
      return;
    }

    if(form.requestedAmount > 1000000000){
      setError('El monto solicitado es demasiado alto.');
      return;
    }

    if(form.requestedAmount == 0){
      setError('El monto solicitado no puede ser 0.');
      return;
    }

    if(form.requestedAmount > 0 && form.requestedAmount < 1000000){
      setError('El monto solicitado es demasiado bajo. Debe ser al menos 1,000,000 CLP.');
      return;
    }

    try {
      const response = await creditService.simulate(form);
      setMonthlyPayment(response.data + 0.0003 * response.data + 20);
      setAdministrationCommission(form.requestedAmount * 0.01);
      setYearsLimit(form.yearsLimit);
    } catch (err) {
      setError('Hubo un error al simular el crédito. Inténtalo de nuevo.');
      console.error(err);
    }
  };

  return (
    <div className="credit-simulate-container">
      <h1>Simula tu Crédito</h1>
      <p>Ingresa los datos solicitados para simular tu crédito.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Tasa de Interés Anual (%)</label>
          <input
            type="number"
            name="interestRate"
            value={form.interestRate}
            onChange={handleChange}
            required
            step="0.01"
            placeholder="Ej. 5"
          />
        </div>

        <div>
          <label>Años de Plazo</label>
          <input
            type="number"
            name="yearsLimit"
            value={form.yearsLimit}
            onChange={handleChange}
            required
            placeholder="Ej. 5"
          />
        </div>

        <div>
          <label>Monto Solicitado ($)</label>
          <input
            type="number"
            name="requestedAmount"
            value={form.requestedAmount}
            onChange={handleChange}
            required
            placeholder="Ej. 10000"
          />
        </div>

        <button className='button'>Simular Crédito</button>
        <button className='button' onClick={handleBack} type="button">
          Atrás
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {monthlyPayment !== null && (
        <div className="result">
          <h2>La cuota mensual a pagar es de ${monthlyPayment.toFixed(2)}</h2>
          <h2>La comisión de administración a pagar es de ${administrationCommission.toFixed(2)}</h2>
          <h2>El costo total del préstamo será de ${(administrationCommission + (monthlyPayment * 12 * yearsLimit)).toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default CreditSimulate;
