import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://notesapp-backend-hst5.onrender.com',
    withCredentials: true
})

export default instance