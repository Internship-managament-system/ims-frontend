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
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
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
    console.log(`Response Status: ${response.status}`);
    console.log(`Response URL: ${response.config.url}`);
    console.log(`Response Data (Raw):`, response.data);
    
    // API yanıtı kontrolü
    // Eğer yanıt result içinde ise onu dön, değilse doğrudan data'yı dön
    if (response.data && response.data.hasOwnProperty('result')) {
      console.log(`Response Data (result):`, response.data.result);
      return response.data.result;
    }
    
    // Doğrudan veriyi döndür
    return response.data;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Hata yanıtını formatla
    if (error.response) {
      console.log('Error Response Data:', error.response.data);
      console.log('Error Config URL:', error.config?.url);
      
      // API özel hata mesajı varsa onu kullan
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Bir hata oluştu';
      return Promise.reject(new Error(errorMessage));
    }
    
    // Network hatası veya istek gönderilemeyen diğer hatalar
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