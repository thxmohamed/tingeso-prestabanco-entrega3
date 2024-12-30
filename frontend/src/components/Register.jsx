import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import userService from '../services/user.service';
import "../App.css";

function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rut: '',
    edad: 18, 
    salario: ''
  });

  const [errors, setErrors] = useState({
    rut: '',
    salario: ''
  });

  const navigate = useNavigate(); // Inicializamos useNavigate

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

    // Formatear el RUT automáticamente
  const formatRut = (value) => {
    const cleanValue = value.replace(/[^\dkK]/g, ''); // Solo números y K/k
    const rut = cleanValue.slice(0, -1);
    const dv = cleanValue.slice(-1).toUpperCase();

    const rutWithFormat = rut
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.') // Agregar puntos cada 3 dígitos
      .concat('-', dv); // Agregar guion y dígito verificador

    return rutWithFormat;
  };

  const handleRutInput = (e) => {
    const formattedValue = formatRut(e.target.value);
    setForm({ ...form, rut: formattedValue });

    if (!validateRut(formattedValue)) {
      setErrors({ ...errors, rut: 'El RUT no es válido' });
    } else {
      setErrors({ ...errors, rut: '' });
    }
  };

  // Validar formato del RUT
  const validateRut = (rut) => {
    const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9Kk]{1}$/; // Formato 12.345.678-9
    return rutRegex.test(rut);
  };

  // Validar salario solo números
  const validateSalario = (salario) => {
    const salarioRegex = /^[0-9]+$/; // Solo acepta números
    return salarioRegex.test(salario);
  };

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'salario' && isNaN(value)) {
      setErrors({ ...errors, salario: 'El salario debe ser un número' });
    } else {
      setErrors({ ...errors, salario: '' });
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    const customerData = {
      name: form.nombre,
      lastName: form.apellido,
      email: form.email,
      password: form.password,
      rut: form.rut,
      age: form.edad,
      income: form.salario,
      rol: 'CUSTOMER'
    };
    try {
      await userService.register(customerData);
      alert('¡Registro exitoso!');
      navigate('/login'); // Redirigir al login
    } catch (error) {
      alert('Error: ' + error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Mostrar la pantalla de confirmación
  };

  // Función para volver al login
  const goToLogin = () => {
    navigate('/login'); // Redirigir a la página de login
  };

  return (
      <div style={styles.registerContainer}>
      {showConfirmation && (
        <>
          <div className="confirmationOverlay"></div>
          <div className="confirmationContainer">
            <h2>Confirma tus datos</h2>
            <ul>
              <li><strong>Nombre:</strong> {form.nombre}</li>
              <li><strong>Apellido:</strong> {form.apellido}</li>
              <li><strong>Email:</strong> {form.email}</li>
              <li><strong>RUT:</strong> {form.rut}</li>
              <li><strong>Edad:</strong> {form.edad}</li>
              <li><strong>Salario:</strong> {form.salario}</li>
            </ul>
            <button onClick={() => setShowConfirmation(false)} className="backButton">Atrás</button>
            <button onClick={handleConfirm} className="submitButton" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Confirmar Registro'}
            </button>
          </div>
        </>
      )}
      
      ) : (
        <>
          <h2 style={styles.heading}>Registro de Usuario</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
  
            <div style={styles.formGroup}>
              <label>Apellido:</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
  
            <div style={styles.formGroup}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
  
            <div style={styles.formGroup}>
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
  
            <div style={styles.formGroup}>
              <label>RUT:</label>
              <input
                type="text"
                name="rut"
                value={form.rut}
                onChange={handleRutInput}
                required
                style={styles.input}
              />
              {errors.rut && <p style={styles.error}>{errors.rut}</p>}
            </div>
  
            <div style={styles.formGroup}>
              <label>Edad:</label>
              <select
                name="edad"
                value={form.edad}
                onChange={handleChange}
                required
                style={styles.input}
              >
                {[...Array(43)].map((_, index) => {
                  const edad = index + 18;
                  return (
                    <option key={edad} value={edad}>
                      {edad}
                    </option>
                  );
                })}
              </select>
            </div>
  
            <div style={styles.formGroup}>
              <label>Salario:</label>
              <input
                type="text"
                name="salario"
                value={form.salario}
                onChange={handleChange}
                required
                style={styles.input}
              />
              {errors.salario && <p style={styles.error}>{errors.salario}</p>}
            </div>
  
            <button type="submit" style={styles.submitButton}>
              Registrarse
            </button>
          </form>
  
          <button onClick={goToLogin} style={styles.loginButton}>
            Volver al Login
          </button>
        </>
      )
    </div>
  );
}  

const styles = {
  registerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '300px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  loginButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
};

export default Register;
