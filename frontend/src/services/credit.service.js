import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/request/credit/')
}

const save = data => {
    return httpClient.post("/request/credit/save", data)
}

const getByClientID = id => {
    return httpClient.get(`/track/byuser/${id}`)
}

const getByID = id => {
    return httpClient.get(`/request/credit/find/${id}`)
}

const simulate = (data) => {
    return httpClient.post("/simulate", data);
};

const updateStatus = (id, newStatus) => {
    return httpClient.put(`/request/credit/${id}/status`, newStatus);
};

const updateObservations = (id, newObservation) => {
    return httpClient.put(`/request/credit/${id}/observations`, newObservation)
}

const totalToPay = data => {
    return httpClient.post("/request/credit/total", data)
}



export default {
    getAll, 
    save, 
    getByClientID, 
    simulate, 
    updateStatus, 
    getByID,
    updateObservations,
    totalToPay
}
