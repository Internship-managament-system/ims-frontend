/* eslint-disable no-unused-vars */
import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useState
} from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';

export const LOGIN_URL = `/api/v1/users/login`;
export const REGISTER_URL = `/api/v1/users/register`;
export const FORGOT_PASSWORD_URL = `/api/v1/forgot-password`;
export const RESET_PASSWORD_URL = `/api/v1/reset-password`;
export const GET_USER_URL = `/api/v1/users/info`;

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (email: string, name: string, surname: string, departmentId?: string) => Promise<void>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  changePassword: (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  getUser: () => Promise<AxiosResponse<{ result: UserModel }>>;
  updateUser: (userId: string, updateData: any) => Promise<void>;
  logout: () => void;
  verify: () => Promise<void>;
  // Rol kontrolü için yardımcı fonksiyonlar
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isStudent: () => boolean;
  isCommissionMember: () => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>();
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

  // Sayfa yüklendiğinde auth durumunu kontrol et
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAuth = authHelper.getAuth();

        if (storedAuth?.access_token) {
          // Token'ın geçerli olup olmadığını kontrol et
          if (authHelper.isTokenExpired && authHelper.isTokenExpired(storedAuth.access_token)) {
            authHelper.removeAuth();
            setLoading(false);
            return;
          }

          // Token'ı header'a ayarla
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedAuth.access_token}`;

          // Kullanıcı bilgilerini getir
          const { data } = await getUser();
          setCurrentUser(data.result);
          setAuth(storedAuth);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Geçersiz token, temizle
        authHelper.removeAuth();
        delete axios.defaults.headers.common['Authorization'];
        setAuth(undefined);
        setCurrentUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Boş dependency array ile sadece mount'ta çalış

  const verify = async () => {
    const currentAuth = authHelper.getAuth();

    if (currentAuth && currentAuth.access_token) {
      try {
        console.log('Verifying user with token:', currentAuth.access_token.substring(0, 10) + '...');

        // Token expiry kontrolü
        if (authHelper.isTokenExpired && authHelper.isTokenExpired(currentAuth.access_token)) {
          throw new Error('Token expired');
        }

        const { data } = await getUser();
        setCurrentUser(data.result);
        setLoading(false);
      } catch (error) {
        console.error('Verification failed:', error);
        // Token geçersizse, auth'u temizle
        saveAuth(undefined);
        setCurrentUser(undefined);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.access_token}`;
    } else {
      authHelper.removeAuth();
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login request...'); // Debug için

      const { data } = await axios.post(LOGIN_URL, {
        email,
        password
      });

      console.log("Login response:", data); // Debug için

      // Token kontrolü yapalım
      if (!data.token) {
        console.error("Login API did not return a token:", data);
        throw new Error('Token alınamadı');
      }

      const authData = {
        access_token: data.token,
      } as AuthModel;

      console.log('Saving auth data...'); // Debug için

      // Auth kaydet
      saveAuth(authData);

      // Token kaydedildikten sonra kullanıcı bilgilerini al
      try {
        console.log('Fetching user data...'); // Debug için

        const { data: userData } = await getUser();
        setCurrentUser(userData.result);

        // Profil tamamlanmamışsa setup sayfasına yönlendir
        if (!userData.result.facultyId || !userData.result.departmentId) {
          // Bu kontrol profil bilgilerinin eksik olduğunu varsayar
          // Backend'den gelen user modelinde bu alanlar varsa
          window.location.href = '/users/info';
          return;
        }

        console.log('User data received:', userData.result); // Debug için
      } catch (getUserError) {
        console.error("User data fetch error:", getUserError);
        // Token sorunuysa auth'u temizle
        saveAuth(undefined);
        throw new Error('Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapın.');
      }
    } catch (error) {
      console.error('Login error:', error);
      saveAuth(undefined);
      throw error;
    }
  };

  // JWTProvider.tsx'te register fonksiyonunu güncelle:
  const register = async (email: string, name: string, surname: string, departmentId?: string) => {
    try {
      const registerData = {
        email,
        name,
        surname,
        departmentId  // Departman bilgisini gönderiyoruz
      };

      console.log('Register request body:', registerData);

      const response = await axios.post(REGISTER_URL, registerData);
      console.log('Full register response:', response);

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        console.log('Registration successful (status: ' + response.status + ')');
        return;
      }

      throw new Error('Registration failed with status: ' + response.status);
    } catch (error) {
      console.error('Register error:', error);

      if (axios.isAxiosError(error) && error.response?.status === 204) {
        console.log('Registration successful (204 No Content)');
        return;
      }

      throw error;
    }
  };

  const updateUser = async (userId: string, updateData: any) => {
    try {
      console.log('Updating user:', userId, 'with data:', updateData);

      await axios.put(`/api/v1/users/${userId}/update`, updateData);

      // Güncelleme sonrası kullanıcı bilgilerini yenile
      const { data } = await getUser();
      setCurrentUser(data.result);
    } catch (error) {
      console.error('User update error:', error);
      throw error;
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    try {
      await axios.post(FORGOT_PASSWORD_URL, {
        email
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  };

  const changePassword = async (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => {
    try {
      await axios.post(RESET_PASSWORD_URL, {
        email,
        token,
        password,
        password_confirmation
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const getUser = async () => {
    console.log('Fetching user info...');

    // Bu noktada token otomatik olarak header'a eklenecek
    const response = await axios.get<{ result: UserModel }>(GET_USER_URL);
    console.log('User info response:', response.data);
    return response;
  };

  const logout = () => {
    // State'leri temizle
    setCurrentUser(undefined);
    saveAuth(undefined);

    // localStorage'den auth ile ilgili tüm verileri temizle
    localStorage.removeItem('email');
    
    // "Beni hatırla" bilgilerini temizleme (kullanıcı logout yapıyorsa güvenlik için)
    // Not: Eğer kullanıcı logout yaparken "beni hatırla" bilgilerinin kalmasını istiyorsanız
    // bu satırları kaldırabilirsiniz
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('rememberMe');

    // Axios header'ını temizle
    delete axios.defaults.headers.common['Authorization'];

    // Login sayfasına yönlendir (replace ile)
    window.location.replace('/auth/login');
  };

  // Rol kontrolü için yardımcı fonksiyonlar
  const hasRole = (role: string): boolean => {
    return currentUser?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    return currentUser?.permissions?.includes(permission) || false;
  };

  const isAdmin = (): boolean => {
    return hasRole('ADMIN');
  };

  const isStudent = (): boolean => {
    return hasRole('STUDENT');
  };

  const isCommissionMember = (): boolean => {
    return hasRole('COMMISSION_MEMBER');
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPasswordResetLink,
        changePassword,
        getUser,
        updateUser,
        logout,
        verify,
        hasRole,
        hasPermission,
        isAdmin,
        isStudent,
        isCommissionMember
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };