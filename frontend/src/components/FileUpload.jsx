import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import checkrulesService from '../services/checkrules.service';
import documentService from '../services/document.service'; 

const FileUpload = ({ creditID, loanType }) => {
  const [files, setFiles] = useState({
    incomeProof: null,
    appraisalCertificate: null,
    creditHistory: null,
    firstHouseDeed: null,
    businessFinancialStatement: null,
    businessPlan: null,
    renovationBudget: null
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  
  // Definir los documentos requeridos para cada tipo de préstamo
  const requiredDocuments = {
    "Primera Vivienda": ['incomeProof', 'appraisalCertificate', 'creditHistory'],
    "Segunda Vivienda": ['incomeProof', 'appraisalCertificate', 'firstHouseDeed', 'creditHistory'],
    "Propiedades Comerciales": ['businessFinancialStatement', 'incomeProof', 'appraisalCertificate', 'businessPlan'],
    "Remodelación": ['incomeProof', 'renovationBudget', 'appraisalCertificate']
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prevFiles => ({
      ...prevFiles,
      [name]: files[0]
    }));
  };

  const validateFiles = () => {
    const requiredFields = requiredDocuments[loanType];
    
    for (let field of requiredFields) {
      if (!files[field]) {
        return `Debes subir el archivo: ${field}`;
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = requiredDocuments[loanType];
    const validationError = validateFiles();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Subir los archivos uno por uno
      for (const field of requiredFields) {
        const formData = new FormData();
        formData.append('file', files[field]);
        formData.append('creditID', creditID);
        
        // Llamar al servicio para guardar el archivo
        await documentService.save(formData);
      }

      const clientID = JSON.parse(localStorage.getItem('user')).id;

      // creacion de la evaluacion
      const checkRulesData = {
        clientID: clientID,
        creditID: creditID,
        rule1: false,
        rule2: false,
        rule3: false,
        rule4: false,
        rule6: false,
        rule71: false,
        rule72: false,
        rule73: false,
        rule74: false,
        rule75: false
      };
      
      await checkrulesService.createEvaluation(checkRulesData);
      
      alert('Todos los archivos se subieron correctamente.');
      
      // Redirigir a /home después de la subida exitosa
      navigate('/home');
      
    } catch (err) {
      console.error("Error al subir archivos:", err);
      setError('Ocurrió un error al subir los archivos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Subida de Archivos para {loanType}</h2>
      <form onSubmit={handleSubmit}>

        {requiredDocuments[loanType].includes('incomeProof') && (
          <div className="form-group">
            <label>Comprobante de Ingresos (PDF)</label>
            <input type="file" name="incomeProof" accept="application/pdf" onChange={handleFileChange} />
          </div>
        )}

        {requiredDocuments[loanType].includes('appraisalCertificate') && (
          <div className="form-group">
            <label>Certificado de Avalúo (PDF)</label>
            <input type="file" name="appraisalCertificate" accept="application/pdf" onChange={handleFileChange} />
          </div>
        )}

        {requiredDocuments[loanType].includes('creditHistory') && (
          <div className="form-group">
            <label>Historial Crediticio (PDF)</label>
            <input type="file" name="creditHistory" accept="application/pdf" onChange={handleFileChange} />
          </div>
        )}

        {requiredDocuments[loanType].includes('firstHouseDeed') && (
          <div className="form-group">
            <label>Escritura de la Primera Vivienda (PDF)</label>
            <input type="file" name="firstHouseDeed" accept="application/pdf" onChange={handleFileChange} />
          </div>
        )}

        {requiredDocuments[loanType].includes('businessFinancialStatement') && (
          <div className="form-group">
            <label>Estado Financiero del Negocio (PDF)</label>
            <input type="file" name="businessFinancialStatement" accept="application/pdf" onChange={handleFileChange} />
          </div>
        )}

        {requiredDocuments[loanType].includes('businessPlan') && (
          <div className="form-group">
            <label>Plan de Negocios (PDF)</label>
            <input type="file" name="businessPlan" accept="application/pdf" onChange={handleFileChange} />
          </div>
        )}

        {requiredDocuments[loanType].includes('renovationBudget') && (
          <div className="form-group">
            <label>Presupuesto de la Remodelación (PDF)</label>
            <input type="file" name="renovationBudget" accept="application/pdf" onChange={handleFileChange} />
          </div>
        )}

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir Archivos'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
