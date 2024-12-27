import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/user/')
}

const register = data => {
    return httpClient.post("/user/register", data)
}

const get = id => {
    return httpClient.get(`/user/${id}`)
}

const login = (email, password) => {
    return httpClient.post("/user/login", { email, password });
  }

export default {getAll, register, get, login}