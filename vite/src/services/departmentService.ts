import axiosClient from '@/api/axiosClient';
import { 
  DEPARTMENTS,
  DEPARTMENT_DETAIL,
  DEPARTMENT_CREATE
} from '@/api/endpoints';

// Departman arayüzü
export interface Department {
  id: number | string;
  name: string;
  description?: string;
  faculty?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Yeni departman oluşturma arayüzü
export interface NewDepartment {
  name: string;
  description?: string;
  faculty?: string;
}

// Tüm departmanları getir
export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const response = await axiosClient.get<Department[]>(DEPARTMENTS);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Departmanları getirme hatası:', error);
    throw error;
  }
};

// Departman detayını getir
export const getDepartmentById = async (id: number | string): Promise<Department> => {
  try {
    return axiosClient.get<Department>(DEPARTMENT_DETAIL(id));
  } catch (error) {
    console.error('Departman detayı getirme hatası:', error);
    throw error;
  }
};

// Yeni departman oluştur
export const createDepartment = async (departmentData: NewDepartment): Promise<Department> => {
  try {
    return axiosClient.post<Department>(DEPARTMENT_CREATE, departmentData);
  } catch (error) {
    console.error('Departman oluşturma hatası:', error);
    throw error;
  }
}; 