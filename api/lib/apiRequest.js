import axios from "axios"

const apiRequest = axios.create({
    baseURL:"http://localhost:8801/api",
    withCredentials:true,
})

export default apiRequest;