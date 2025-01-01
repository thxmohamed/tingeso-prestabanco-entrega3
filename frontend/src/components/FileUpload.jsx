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
  
  // Mapeo de campos a nombres legibles por el usuario
  const documentLabels = {
    incomeProof: "Comprobante de Ingresos",
    appraisalCertificate: "Certificado de Avalúo",
    creditHistory: "Historial Crediticio",
    firstHouseDeed: "Escritura de la Primera Vivienda",
    businessFinancialStatement: "Estado Financiero del Negocio",
    businessPlan: "Plan de Negocios",
    renovationBudget: "Presupuesto de la Remodelación"
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prevFiles => ({
      ...prevFiles,
      [name]: files[0]
    }));
  };

  const handleFileDelete = (field) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [field]: null
    }));
  };

  const validateFiles = () => {
    const requiredFields = requiredDocuments[loanType];
    
    for (let field of requiredFields) {
      if (!files[field]) {
        return `Debes subir el archivo: ${documentLabels[field]}`;
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
        if (files[field]) { // Asegurarse de que solo subimos los archivos que están presentes
          const formData = new FormData();
          formData.append('file', files[field]);
          formData.append('creditID', creditID);
          
          // Llamar al servicio para guardar el archivo
          await documentService.save(formData);
        }
      }

      const clientID = JSON.parse(localStorage.getItem('user')).id;

      // Creación de la evaluación
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
            <label>{documentLabels.incomeProof} (PDF)</label>
            <input type="file" name="incomeProof" accept="application/pdf" onChange={handleFileChange} />
            {files.incomeProof && (
                <button type="button" onClick={() => handleFileDelete('incomeProof')} title="Eliminar archivo" className="delete-button">
                  &#10006;
                </button>
            )}
          </div>
        )}

        {requiredDocuments[loanType].includes('appraisalCertificate') && (
          <div className="form-group">
            <label>{documentLabels.appraisalCertificate} (PDF)</label>
            <input type="file" name="appraisalCertificate" accept="application/pdf" onChange={handleFileChange} />
            {files.appraisalCertificate && (
                <button type="button" onClick={() => handleFileDelete('appraisalCertificate')} title="Eliminar archivo" className="delete-button">
                  &#10006;
                </button>
            )}
          </div>
        )}

        {requiredDocuments[loanType].includes('creditHistory') && (
          <div className="form-group">
            <label>{documentLabels.creditHistory} (PDF)</label>
            <input type="file" name="creditHistory" accept="application/pdf" onChange={handleFileChange} />
            {files.creditHistory && (
                <button type="button" onClick={() => handleFileDelete('creditHistory')} title="Eliminar archivo" className="delete-button">
                  &#10006;
                </button>
            )}
          </div>
        )}

        {requiredDocuments[loanType].includes('firstHouseDeed') && (
          <div className="form-group">
            <label>{documentLabels.firstHouseDeed} (PDF)</label>
            <input type="file" name="firstHouseDeed" accept="application/pdf" onChange={handleFileChange} />
            {files.firstHouseDeed && (
                <button type="button" onClick={() => handleFileDelete('firstHouseDeed')} title="Eliminar archivo" className="delete-button">
                  &#10006;
                </button>
            )}
          </div>
        )}

        {requiredDocuments[loanType].includes('businessFinancialStatement') && (
          <div className="form-group">
            <label>{documentLabels.businessFinancialStatement} (PDF)</label>
            <input type="file" name="businessFinancialStatement" accept="application/pdf" onChange={handleFileChange} />
            {files.businessFinancialStatement && (
                <button type="button" onClick={() => handleFileDelete('businessFinancialStatement')} title="Eliminar archivo" className="delete-button">
                  &#10006;
                </button>
            )}
          </div>
        )}

        {requiredDocuments[loanType].includes('businessPlan') && (
          <div className="form-group">
            <label>{documentLabels.businessPlan} (PDF)</label>
            <input type="file" name="businessPlan" accept="application/pdf" onChange={handleFileChange} />
            {files.businessPlan && (
                <button type="button" onClick={() => handleFileDelete('businessPlan')} title="Eliminar archivo" className="delete-button">
                  &#10006;
                </button>
            )}
          </div>
        )}

        {requiredDocuments[loanType].includes('renovationBudget') && (
          <div className="form-group">
            <label>{documentLabels.renovationBudget} (PDF)</label>
            <input type="file" name="renovationBudget" accept="application/pdf" onChange={handleFileChange} />
            {files.renovationBudget && (
                <button type="button" onClick={() => handleFileDelete('renovationBudget')} title="Eliminar archivo" className="delete-button">
                  &#10006;
                </button>
            )}
          </div>
        )}

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir Archivos'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
