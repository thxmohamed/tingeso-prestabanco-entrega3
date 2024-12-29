import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/file/')
}

const save = (data) => {
    return httpClient.post("/file/save", data, {
        headers: {
            "Content-Type": "multipart/form-data" // Asegura que el contenido es de tipo FormData
        }
    });
}

const getByCreditID = (id) => {
    return httpClient.get(`/file/${id}`, {
      responseType: 'json', 
    });
  };

  const downloadFileByID = (id) => {
    return httpClient.get(`/file/download/${id}`, {
      responseType: 'arraybuffer', // Obtener los datos binarios del archivo
    });
  };
  

export default {getAll, save, getByCreditID, downloadFileByID}