import { useAuthStore } from '@/store/authStore';
import axios from 'axios'
import type { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
    baseURL: '/api',
    withCredentials: true
});

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;


    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    res => res,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 403) {
            useAuthStore.getState().logout();
            setTimeout(() => {
                window.location.href = "/login"
            }, 1000)
        }
        if (error.response?.status === 401 && !original._retry) {

            original._retry = true;
            try {

                const { data } = await API.post('/auth/refresh');

                const mappedUser = {
                    id: (data.user as any)?._id || data.user?.id,
                    name: data.user?.name,
                    email: data.user?.email,
                    role: data.user?.role || data.role
                };

                useAuthStore.getState().login(data.accessToken, mappedUser);

                original.headers.Authorization = `Bearer ${data.accessToken}`

                return API(original);
            } catch (error) {
                useAuthStore.getState().logout();
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }
        return Promise.reject(error)
    }

)

export default API;