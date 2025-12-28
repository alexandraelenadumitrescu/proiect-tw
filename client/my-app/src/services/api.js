import axios from 'axios' //axios trimite cereri http (GET, POST etc) catre un server
const api = axios.create(
    {baseURL: 'http://localhost:5000/api'}//cream un obiect ce contine adresa serverului
)

export default api