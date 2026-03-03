import { useAuthStore } from '@/store/authStore';
import axios from 'axios'
import type { InternalAxiosRequestConfig } from "axios";

export interface AuthUser {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: string;
    isBlocked?: boolean;
}

export interface AuthResponse {
    accessToken: string;
    user: AuthUser;
    role?: string;
}

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

            // Prevent refresh attempts for login and refresh endpoints
            if (original.url?.includes('/auth/login') || original.url?.includes('/auth/admin-login') || original.url?.includes('/auth/refresh') || original.url?.includes('/auth/google-auth')) {
                return Promise.reject(error);
            }

            original._retry = true;

            try {

                const { data } = await API.post<AuthResponse>('/auth/refresh');

                const mappedUser = {
                    id: data.user._id || data.user.id || '',
                    name: data.user.name,
                    email: data.user.email,
                    role: (data.user.role || data.role) as 'user' | 'chef' | 'admin'
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