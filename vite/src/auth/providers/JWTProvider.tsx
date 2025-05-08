/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
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
/*
const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `${API_URL}/users/login`;
export const REGISTER_URL = `${API_URL}/users/register`;
export const FORGOT_PASSWORD_URL = `${API_URL}/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/reset-password`;
export const GET_USER_URL = `${API_URL}/users/info`; // '/info' endpoint'ini ekleyin*/

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
  register: (email: string, password: string, password_confirmation: string) => Promise<void>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  changePassword: (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  getUser: () => Promise<AxiosResponse<any>>;
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
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

  // Sayfa yüklendiğinde kullanıcı bilgilerini kontrol et
  useEffect(() => {
    if (auth) {
      verify();
    } else {
      setLoading(false);
    }
  }, []);

  const verify = async () => {
    if (auth) {
      try {
        const { data } = await getUser();
        // Backend'den Response<UserInfo> döndüğünü varsayalım
        setCurrentUser(data.result);
        setLoading(false);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
        setLoading(false);
      }
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(LOGIN_URL, {
        email,
        password
      });
      
      // Backend'den gelen token'ı frontend'in beklediği formata dönüştür
      const authData = {
        access_token: data.token, // 'token' alanını 'access_token' olarak dönüştür
        // AuthModel tipinde gerekli diğer alanları burada ekleyebilirsiniz
      } as AuthModel;
      
      saveAuth(authData);
      
      try {
        const { data: userData } = await getUser();
        // Backend Response<UserInfo> döndüğü için result alanından bilgileri al
        setCurrentUser(userData.result);
      } catch (getUserError) {
        console.error("User data fetch error:", getUserError);
      }
    } catch (error) {
      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const register = async (email: string, name: string, surname: string) => {
    try {
      // API'ye göndermek için veri yapısını değiştir - şifre yerine ad ve soyad kullan
      const { data } = await axios.post(REGISTER_URL, {
        email,
        name,     // Backend API'nin beklediği alan adı: name
        surname   // Backend API'nin beklediği alan adı: surname
      });
      
      // Backend'den gelen token'ı frontend'in beklediği formata dönüştür
      const authData = {
        access_token: data.token, // 'token' alanını 'access_token' olarak dönüştür
        // AuthModel tipinde gerekli diğer alanları burada ekleyebilirsiniz
      } as AuthModel;
      
      saveAuth(authData);
      
      try {
        const { data: userData } = await getUser();
        // Backend Response<UserInfo> döndüğü için result alanından bilgileri al
        setCurrentUser(userData.result);
      } catch (getUserError) {
        console.error("User data fetch error:", getUserError);
      }
    } catch (error) {
      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    await axios.post(FORGOT_PASSWORD_URL, {
      email
    });
  };

  const changePassword = async (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => {
    await axios.post(RESET_PASSWORD_URL, {
      email,
      token,
      password,
      password_confirmation
    });
  };

  const getUser = async () => {
    return await axios.get<{result: UserModel}>(GET_USER_URL);
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
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