import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user.service';
import Button from "@mui/material/Button";
import "../App.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await userService.login(email, password);

      if (response.status === 200) {
        onLogin();
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        // Verificar si el error es por una contraseña incorrecta (401) o email incorrecto (404)
        if (error.response.status === 500) {
          setError('Credenciales incorrectas.');
        } else {
          setError('Hubo un error al iniciar sesión. Intenta nuevamente.');
        }
      } else {
        // En caso de error de red o problemas con la conexión al servidor
        setError('No se pudo conectar con el servidor. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className="button"
        >
          Iniciar Sesión
        </Button>

        <button className="logout-button" onClick={goToRegister}>
          Registrarse
        </button>

      </form>
    </div>
  );
};

export default Login;