// src/api/fetchClient.ts
import { getAuth } from '@/auth/_helpers';

interface ApiResponse<T> {
  success: boolean;
  result: T;
  message?: string;
  error?: string;
}

class FetchClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    console.log('FetchClient initialized with baseUrl:', baseUrl);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const auth = getAuth();
    
    // Headers tipini düzelt
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (auth?.access_token) {
      headers['Authorization'] = `Bearer ${auth.access_token}`;
    }

    // Endpoint'in tam URL olup olmadığını kontrol et
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseUrl}${endpoint}`;

    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    console.log('Request Headers:', headers);
    if (options.body) console.log('Request Body:', options.body);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`Response Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response Error Text:', errorText);
        
        let errorData = null;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('Failed to parse error response as JSON');
        }
        
        throw new Error(errorData?.message || errorData?.error || `HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('Response Text:', responseText);
      
      let data: ApiResponse<T>;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid JSON response from server');
      }
      
      if (!data.success) {
        throw new Error(data.error || data.message || 'API Error');
      }

      return data.result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Proxy kullanarak istekleri gönder - vite.config.ts'deki ayarlarla eşleşir
const API_BASE = '/api/v1';

export const apiClient = new FetchClient(API_BASE);