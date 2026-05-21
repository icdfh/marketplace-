import axios from "axios"
import {tokenStorage} from "../lib/tokenStorage"

export const baseApi = axios.create({
    baseURL: "http://localhost:5000/api"
})

baseApi.interceptors.request.use((config) =>{
    const token = tokenStorage.get()
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})