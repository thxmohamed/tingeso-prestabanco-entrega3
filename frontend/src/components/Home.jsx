import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Home = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToApplication = () => {
    navigate('/application');
  };

  const goToSimulate = () => {
    navigate('/simulate');
  };

  const goToEvaluation = () => {
    navigate('/evaluation');
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Elimina al usuario del localStorage
    navigate('/login'); // Redirige al Login
  };

  return (
    <div className="home-container">
      <h1 className="heading">Hola, bienvenidos a Préstamos PrestaBanco</h1>
      
      <button className="button" onClick={goToSimulate}>
        Simular un crédito
      </button>
      <button className="button" onClick={goToApplication}>
        Solicitar un crédito
      </button>
      <button className="button" onClick={goToProfile}>
        Mi perfil
      </button>
      <button className="button" onClick={goToEvaluation}>
        Evaluar solicitudes (ejecutivo)
      </button>
      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;
