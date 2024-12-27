import axios from "axios";

const prestaBancoServer = "localhost:8080";

export default axios.create({
    baseURL: `http://${prestaBancoServer}`,
    headers: {
        'Content-Type': 'application/json'
    } 
});
