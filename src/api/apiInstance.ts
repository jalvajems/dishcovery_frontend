import axios from 'axios'
import type { InternalAxiosRequestConfig } from "axios";

const API=axios.create({
    baseURL:'/api',
    withCredentials:true
});

API.interceptors.request.use((config:InternalAxiosRequestConfig)=>{
    const token=localStorage.getItem('accessToken');
    
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
        console.log('token sented');
    }
    return config;
},
(error)=>Promise.reject(error)
);

API.interceptors.response.use(
    res=>res,
    async(error)=>{
        const original=error.config;
        if(error.response?.status===401&& !original._retry){
            original._retry=true;
            try {
                console.log('reaching axios response');
                
                const {data}=await API.post('/auth/refresh');
                localStorage.setItem('accessToken',data.accessToken);
                console.log('access token refreshed');
                
                original.headers.Authorization=`Bearer ${data.accessToken}`

                return API(original);
            } catch (error) {
                console.error('token refreshing failed');
            }
        }
        return Promise.reject(error)
    }

)

export default API;