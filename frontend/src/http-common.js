import axios from "axios";

const prestaBancoServer = "localhost:80";

export default axios.create({
    baseURL: `http://${prestaBancoServer}`,
    headers: {
        'Content-Type': 'application/json'
    } 
});
