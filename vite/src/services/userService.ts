import axiosClient from '@/api/axiosClient';
import { USERS, USER_DETAIL, COMMISSION_MEMBERS_USERS } from '@/api/endpoints';

// Kullanıcı rolleri
export type UserRole = 'COMMISSION_CHAIRMAN' | 'COMMISSION_MEMBER' | 'STUDENT' | 'TEACHER';

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
    const response = await axiosClient.get<User[]>(USERS);
    
    if (!response) {
      return [];
    }
    
    if (!Array.isArray(response)) {
      return [];
    }
    
    return response;
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    return [];
  }
};

// Sistemdeki tüm kullanıcıları getir (komisyon üyesi atanabilecek kullanıcılar)
export const getAllSystemUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosClient.get<User[]>(COMMISSION_MEMBERS_USERS);
    
    if (!response) {
      return [];
    }
    
    if (!Array.isArray(response)) {
      const responseArray = response ? (Array.isArray(response) ? response : [response]) : [];
      return responseArray;
    }
    
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