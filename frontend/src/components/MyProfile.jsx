import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../App.css";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      console.log("No se encontró ningún usuario loggeado.");
    }
  }, []);

  const handleBack = () => {
    navigate('/home'); // Redirige al Home
  };

  if (!user) {
    return <div className="no-user-message">No estás loggeado.</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mi Perfil</h1>
      <div className="profile-card">
        <Link to="/profile/history" className="btn">
          Mis Solicitudes
        </Link>
        <div className="profile-item">
          <strong>Nombre:</strong> {user.name}
        </div>
        <div className="profile-item">
          <strong>Apellido:</strong> {user.lastName}
        </div>
        <div className="profile-item">
          <strong>Rut:</strong> {user.rut}
        </div>
        <div className="profile-item">
          <strong>Correo:</strong> {user.email}
        </div>
        <div className="profile-item">
          <strong>Rol:</strong> {user.rol}
        </div>
        <div className="profile-item">
          <strong>Salario:</strong> $ {user.income}
        </div>
        <div className="profile-item">
          <strong>Edad:</strong> {user.age}
        </div>
      </div>
      <button className="go-back-button" onClick={handleBack}>
        Atrás
      </button>
    </div>
    
  );
};

export default MyProfile;
