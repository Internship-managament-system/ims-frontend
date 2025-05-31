import axiosClient from '@/api/axiosClient';
import { USERS, USER_DETAIL, COMMISSION_MEMBERS_USERS } from '@/api/endpoints';

// Kullanıcı rolleri
export type UserRole = 'ADMIN' | 'COMMISSION_MEMBER' | 'STUDENT' | 'TEACHER';

// Kullanıcı arayüzü
export interface User {
  id: number | string;
  name?: string;
  surname?: string;
  fullName?: string;
  email: string;
  role: UserRole;
  departmentId?: number | string;
  departmentName?: string;
  enabled: boolean;
  profileImage?: string;
  phoneNumber?: string;
  createdAt?: string;
}

// Tüm kullanıcıları getir (normal /users endpoint'i)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    console.log('API isteği yapılıyor:', USERS);
    
    try {
      const response = await axiosClient.get<User[]>(USERS);
      console.log('API yanıtı alındı:', response);
      
      if (!response) {
        console.error('API yanıtı boş:', response);
        return [];
      }
      
      if (!Array.isArray(response)) {
        console.error('API yanıtı bir dizi değil:', response);
        // Eğer response bir dizi değilse, zorlama yapma
        // Doğrudan boş dizi döndür
        return [];
      }
      
      return response;
    } catch (apiError: any) {
      console.error('API çağrısı başarısız oldu:', apiError);
      
      // Daha detaylı hata bilgisi için
      if (apiError.response) {
        console.error('Hata status:', apiError.response.status);
        console.error('Hata data:', apiError.response.data);
      }
      
      // API hatası olduğunda boş dizi döndür
      return [];
    }
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    // Üst seviye hata durumunda da boş dizi döndür
    return [];
  }
};

// Sistemdeki tüm kullanıcıları getir (komisyon üyesi atanabilecek kullanıcılar)
export const getAllSystemUsers = async (): Promise<User[]> => {
  try {
    console.log('Sistem Kullanıcıları API isteği yapılıyor:', COMMISSION_MEMBERS_USERS);
    const response = await axiosClient.get<User[]>(COMMISSION_MEMBERS_USERS);
    console.log('Sistem Kullanıcıları API yanıtı (RAW):', JSON.stringify(response));
    
    if (!response) {
      console.error('API yanıtı boş:', response);
      return [];
    }
    
    if (!Array.isArray(response)) {
      console.error('API yanıtı bir dizi değil:', response);
      console.log('Tip:', typeof response, 'Değer:', response);
      
      // Dizi değilse zorla diziye dönüştürme deneyelim
      const responseArray = response ? (Array.isArray(response) ? response : [response]) : [];
      console.log('Dönüştürülmüş dizi:', responseArray);
      
      return responseArray;
    }
    
    console.log('İşlenmiş sistem kullanıcıları:', response);
    return response;
  } catch (error) {
    console.error('Sistem kullanıcılarını getirme hatası:', error);
    throw error;
  }
};

// Kullanıcı detayını getir
export const getUserById = async (id: number | string): Promise<User> => {
  try {
    return axiosClient.get<User>(USER_DETAIL(id));
  } catch (error) {
    console.error('Kullanıcı detayı getirme hatası:', error);
    throw error;
  }
};

// Belirli bir role sahip kullanıcıları filtrele
export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  try {
    const allUsers = await getAllUsers();
    return allUsers.filter(user => user.role === role);
  } catch (error) {
    console.error(`${role} rolündeki kullanıcıları getirme hatası:`, error);
    throw error;
  }
};

// Öğrenci rolündeki kullanıcıları getir
export const getStudents = async (): Promise<User[]> => {
  return getUsersByRole('STUDENT');
};

// Öğretmen rolündeki kullanıcıları getir
export const getTeachers = async (): Promise<User[]> => {
  return getUsersByRole('TEACHER');
}; 