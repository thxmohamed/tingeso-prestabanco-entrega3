import axios from "axios";

//const prestaBancoServer = "localhost:80";
const prestaBancoServer = "52.156.85.173";

export default axios.create({
    baseURL: `http://${prestaBancoServer}`,
    headers: {
        'Content-Type': 'application/json'
    } 
});
