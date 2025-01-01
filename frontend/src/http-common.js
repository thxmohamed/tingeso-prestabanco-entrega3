import axios from "axios";

//const prestaBancoServer = "localhost:80";
const prestaBancoServer = "presta-banco-mohamed.westus2.cloudapp.azure.com";

export default axios.create({
    baseURL: `http://${prestaBancoServer}`,
    headers: {
        'Content-Type': 'application/json'
    } 
});
