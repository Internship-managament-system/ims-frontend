import { User as Auth0UserModel } from '@auth0/auth0-spa-js';

import { getData, setData } from '@/utils';
import { type AuthModel } from './_models';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${
  import.meta.env.VITE_APP_VERSION
}`;

const getAuth = (): AuthModel | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;

    if (auth && auth.access_token) {
      // Token'ın varlığını kontrol et
      if (!auth.access_token) {
        removeAuth();
        return undefined;
      }
      return auth;
    }
    return undefined;
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
    removeAuth(); // Hatalı data varsa temizle
    return undefined;
  }
};

const setAuth = (auth: AuthModel | Auth0UserModel) => {
  try {
    setData(AUTH_LOCAL_STORAGE_KEY, auth);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SET ERROR', error);
  }
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    localStorage.removeItem('email'); // Email'i de temizle
    // Diğer auth ile ilgili localStorage itemlarını da burada temizle
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

// Token expiry kontrolü için yardımcı fonksiyon
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const exp = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch {
    return true; // Eğer decode edilemezse expired say
  }
};

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';
  
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth();

      if (auth?.access_token) {
        // Token expired mı kontrol et
        if (isTokenExpired(auth.access_token)) {
          removeAuth();
          window.location.replace('/auth/login');
          return Promise.reject(new Error('Token expired'));
        }
        
        config.headers.Authorization = `Bearer ${auth.access_token}`;
      }

      return config;
    },
    async (err: any) => await Promise.reject(err)
  );

  // Response interceptor ekle
  axios.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Unauthorized or Forbidden - logout user
        removeAuth();
        window.location.replace('/auth/login');
      }
      return Promise.reject(error);
    }
  );
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth, isTokenExpired };