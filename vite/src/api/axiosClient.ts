import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuth } from '@/auth/_helpers';

// Axios instance oluştur
const axiosInstance = axios.create({
  baseURL: '', // Vite proxy kullanacağız
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
      const status = error.response.status;
      const errorData = error.response.data;
      
      let errorMessage = 'Bir hata oluştu';
      
      if (status === 400) {
        errorMessage = errorData?.message || errorData?.error || 'Geçersiz istek';
      } else if (status === 401) {
        errorMessage = 'Yetkisiz erişim. Lütfen giriş yapın.';
      } else if (status === 403) {
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
      } else if (status === 404) {
        errorMessage = 'İstenen kaynak bulunamadı.';
      } else if (status === 500) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      } else {
        errorMessage = errorData?.message || errorData?.error || `HTTP ${status} hatası`;
      }
      
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