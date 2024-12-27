import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import creditService from '../services/credit.service';
import '../App.css';

// Componente para mostrar los detalles de una solicitud seleccionada
const ApplicationDetails = ({ credit, onCancel, onAccept }) => {
  if (!credit) return <p>Selecciona una solicitud para ver los detalles</p>;

  return (
    <div className="application-details">
      <h3>Detalles de la Solicitud</h3>
      <p><strong>Plazo (años):</strong> {credit.yearsLimit}</p>
      <p><strong>Tasa de Interés:</strong> {credit.interestRate}%</p>
      <p><strong>Cuota Mensual:</strong> ${credit.monthlyFee.toFixed(2)}</p>
      <p><strong>Costo Total:</strong> ${(credit.administrationCommission + (credit.monthlyFee * credit.yearsLimit * 12)).toFixed(2)}</p>
      <p><strong>Observaciones:</strong> {credit.observations}</p>
      
      {/* Botón de Cancelar */}
      <button onClick={() => onCancel(credit.id)} className="logout-button">
        Cancelar Solicitud
      </button>
      
      {/* Botón de Aceptar si el estado es E4_PRE_APROBADA */}
      {credit.status === 'E4_PRE_APROBADA' && (
        <button onClick={() => onAccept(credit.id)} className="btn-green">
          Aceptar
        </button>
      )}
    </div>
  );
};

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 1;
  const navigate = useNavigate();

  useEffect(() => {
    const clientID = JSON.parse(localStorage.getItem('user')).id;

    creditService.getByClientID(clientID)
      .then(response => {
        setApplications(response.data);
      })
      .catch(error => {
        console.error("Error al obtener las solicitudes:", error);
        setError("Hubo un error al cargar las solicitudes.");
      });
  }, []);


  const handleAccept = (id) => {
    const newStatus = 'E5_EN_APROBACION_FINAL';
    creditService.updateStatus(id, newStatus)
      .then(() => {
        // Actualiza el estado local de las solicitudes
        setApplications(applications.map(app => 
          app.id === id ? { ...app, status: 'E5_EN_APROBACION_FINAL' } : app
        ));
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      })
      .catch(error => {
        console.error("Error al aceptar la solicitud:", error);
        setError("Hubo un error al actualizar la solicitud.");
      });
  };

  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  const handleCancel = (id) => {
    const newStatus = 'E8_CANCELADA_POR_CLIENTE';
    console.log("Cancelando solicitud con ID:", id, "con datos:", newStatus);
    
    creditService.updateStatus(id, newStatus)
      .then(() => {
        // Actualizar la lista de solicitudes
        setApplications(applications.map(app => 
          app.id === id ? { ...app, status: 'E8_CANCELADA_POR_CLIENTE' } : app
        ));
        setSelectedApplication(null);
      })
      .catch(error => {
        console.error("Error al cancelar la solicitud:", error);
        setError("Hubo un error al cancelar la solicitud.");
      });
  };
  
  

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(applications.length / applicationsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goBack = () => {
    navigate('/profile');
  };

  return (
    <div className="application-history-container">
      <button className="go-back-button" onClick={goBack}>
        Atrás
      </button>

      <h1>Mis Solicitudes</h1>

      {error && <p className="error">{error}</p>}

      <div className="applications-list">
        {applications.length === 0 ? (
          <p>No tienes solicitudes de crédito.</p>
        ) : (
          <>
            <ul>
              {currentApplications.map((app) => (
                <li
                  key={app.id}
                  onClick={() => handleApplicationClick(app)}
                  className={`clickable ${selectedApplication?.id === app.id ? 'selected' : ''}`}
                >
                  <p><strong>Tipo de Préstamo:</strong> {app.loanType}</p>
                  <p><strong>Monto Solicitado:</strong> ${app.requestedAmount}</p>
                  <p><strong>Estado:</strong> {app.status}</p>
                </li>
              ))}
            </ul>

            <div className="pagination-controls">
              <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
              <span>Página {currentPage} de {Math.ceil(applications.length / applicationsPerPage)}</span>
              <button onClick={nextPage} disabled={currentPage === Math.ceil(applications.length / applicationsPerPage)}>Siguiente</button>
            </div>
          </>
        )}
      </div>

      <ApplicationDetails
        credit={selectedApplication}
        onCancel={handleCancel}
        onAccept={handleAccept}  // Nuevo prop para aceptar
      />
    </div>
  );
};

export default ApplicationHistory;
