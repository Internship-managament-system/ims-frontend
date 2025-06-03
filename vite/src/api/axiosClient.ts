import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuth } from '@/auth/_helpers';

// Axios instance oluştur
const axiosInstance = axios.create({
  baseURL: '', // Artık endpoint'lerde tam URL kullandığımız için baseURL boş olmalı
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Auth token'ı ekle
    const auth = getAuth();
    if (auth?.access_token) {
      config.headers.Authorization = `Bearer ${auth.access_token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // API yanıtı kontrolü
    if (response.data && response.data.hasOwnProperty('result')) {
      return response.data.result;
    }
    
    return response.data;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Bir hata oluştu';
      return Promise.reject(new Error(errorMessage));
    }
    
    return Promise.reject(error);
  }
);

// API istekleri için tip güvenli fonksiyonlar
const axiosClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.get<any, T>(url, config),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.post<any, T>(url, data, config),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.put<any, T>(url, data, config),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.delete<any, T>(url, config)
};

export default axiosClient; 