import React, { useEffect, useState } from 'react';
import creditService from '../services/credit.service';
import documentService from '../services/document.service';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ApplicationDetails = ({ credit, statusOptions, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(credit?.status || '');
  const [documents, setDocuments] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // Estado de carga para el botón "Cambiar"
  const [loadingDownloads, setLoadingDownloads] = useState({}); // Estado de carga para los botones de descarga
  const navigate = useNavigate();

  useEffect(() => {
    if (credit) {
      documentService.getByCreditID(credit.id)
        .then(response => {
          setDocuments(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los documentos:', error);
        });
    }
  }, [credit]);

  if (!credit) return <p>Selecciona una solicitud para ver los detalles</p>;

  const handleStatusSelect = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleUpdateClick = () => {
    setIsUpdatingStatus(true);
    onStatusChange(credit.id, selectedStatus)
      .then(() => {
        alert("Estado actualizado correctamente");
      })
      .catch((error) => {
        console.error("Error al actualizar el estado:", error);
        alert("Error al actualizar el estado");
      })
      .finally(() => setIsUpdatingStatus(false));
  };

  const handleDownload = (docID, filename) => {
    setLoadingDownloads(prev => ({ ...prev, [docID]: true }));
    documentService.downloadFileByID(docID)
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error al descargar el archivo:', error);
      })
      .finally(() => {
        setLoadingDownloads(prev => ({ ...prev, [docID]: false }));
      });
  };

  return (
    <div className="application-details">
      <h3>Detalles de la Solicitud</h3>
      <p><strong>Plazo (años):</strong> {credit.yearsLimit}</p>
      <p><strong>Tasa de Interés:</strong> {credit.interestRate}%</p>
      <p><strong>Cuota Mensual:</strong> ${credit.monthlyFee}</p>
      <p><strong>Estado Actual:</strong> {statusOptions.find(opt => opt.value === credit.status)?.label || credit.status}</p>

      <div className="status-update">
        <label htmlFor="status">Cambiar Estado:</label>
        <p>Selecciona "Evaluar solicitud" para pasar a la pantalla de evaluación</p>
        <select id="status" value={selectedStatus} onChange={handleStatusSelect} disabled={isUpdatingStatus}>
          {statusOptions.map((statusOption, index) => (
            <option key={index} value={statusOption.value}>{statusOption.label}</option>
          ))}
        </select>
        <button onClick={handleUpdateClick} disabled={isUpdatingStatus}>
          {isUpdatingStatus ? 'Cambiando...' : 'Cambiar'}
        </button>
      </div>

      <div className="documents-section">
        <h4>Documentos Asociados</h4>
        <p>Haz click para descargar</p>
        {documents.length > 0 ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <button
                  className="button"
                  onClick={() => handleDownload(doc.id, doc.filename)}
                  disabled={loadingDownloads[doc.id]}
                >
                  {loadingDownloads[doc.id] ? 'Cargando...' : doc.filename}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay documentos asociados.</p>
        )}
      </div>
    </div>
  );
};

const CreditEvaluation = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  const statusOptions = [
    { label: 'En revisión inicial', value: 'E1_EN_REVISION_INICIAL' },
    { label: 'Pendiente documentación', value: 'E2_PENDIENTE_DOCUMENTACION' },
    { label: 'Evaluar solicitud', value: 'E3_EN_EVALUACION' },
    { label: 'Pre-aprobada', value: 'E4_PRE_APROBADA' },
    { label: 'En aprobación final', value: 'E5_EN_APROBACION_FINAL' },
    { label: 'Aprobada', value: 'E6_APROBADA' },
    { label: 'Rechazada', value: 'E7_RECHAZADA' },
    { label: 'Cancelada por cliente', value: 'E8_CANCELADA_POR_CLIENTE' },
    { label: 'En desembolso', value: 'E9_EN_DESEMBOLSO' }
  ];

  useEffect(() => {
    creditService.getAll()
      .then(response => {
        setApplications(response.data);
        setFilteredApplications(response.data);
      })
      .catch(error => {
        console.error("Error al obtener las solicitudes:", error);
        setError("Hubo un error al cargar las solicitudes.");
      });
  }, []);

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  const handleStatusChange = (id, newStatusValue) => {
    const statusValue = statusOptions.find(option => option.value === newStatusValue)?.value;

    if (!statusValue) {
      alert("Estado no válido seleccionado");
      return;
    }

    return creditService.updateStatus(id, statusValue)
      .then(() => {
        setApplications(applications.map(app => app.id === id ? { ...app, status: statusValue } : app));
        setFilteredApplications(filteredApplications.map(app => app.id === id ? { ...app, status: statusValue } : app));

        if (statusValue === 'E3_EN_EVALUACION') {
          navigate(`/evaluation/${id}`);
        }
      });
  };

  const handleFilterStatusChange = (event) => {
    const selected = event.target.value;
    setSelectedStatus(selected);

    if (selected === '') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === selected));
    }
  };

  return (
    <div className="application-evaluation-container">
      <h1>Evaluación de Solicitudes</h1>
      <button className="logout-button" onClick={() => navigate(-1)}>Atrás</button>

      {error && <p className="error">{error}</p>}

      <div className="status-filter">
        <label htmlFor="status">Filtrar por estado:</label>
        <select id="status" value={selectedStatus} onChange={handleFilterStatusChange}>
          <option value="">Todos</option>
          {statusOptions.map((statusOption, index) => (
            <option key={index} value={statusOption.value}>{statusOption.label}</option>
          ))}
        </select>
      </div>

      <div className="applications-list">
        {filteredApplications.length === 0 ? (
          <p>No se encontraron solicitudes de crédito.</p>
        ) : (
          <ul>
            {filteredApplications.map((app) => (
              <li
                key={app.id}
                onClick={() => handleApplicationClick(app)}
                className={`clickable ${selectedApplication?.id === app.id ? 'selected' : ''}`}
              >
                <p><strong>Tipo de Préstamo:</strong> {app.loanType}</p>
                <p><strong>Monto Solicitado:</strong> ${app.requestedAmount}</p>
                <p><strong>Estado:</strong> {statusOptions.find(opt => opt.value === app.status)?.label || app.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ApplicationDetails 
        credit={selectedApplication} 
        statusOptions={statusOptions} 
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
};

export default CreditEvaluation;
