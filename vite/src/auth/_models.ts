import { type TLanguageCode } from '@/i18n';

export interface AuthModel {
  access_token: string;
  refreshToken?: string;
  api_token?: string;
}

// Mevcut model alanlarını koruyarak, backend'den gelen UserInfo alanlarını ekleyin
export interface UserModel {
  // Backend UserInfo alanları
  id: string; // Backend UUID dönüyor
  name: string;
  surname: string;
  role: string; // "ADMIN", "STUDENT", "COMMISSION_MEMBER" vb.
  permissions: string[]; // "CAN_CREATE_ADMIN_USER" vb. izinler
  
   // YENİ EKLENEN ALANLAR
   facultyId?: string;
   departmentId?: string;
   facultyName?: string;
   departmentName?: string;
  
  // Mevcut model alanları (ihtiyaca göre kullanılabilir)
  username?: string;
  password?: string | undefined;
  email?: string;
  first_name?: string;
  last_name?: string;
  fullname?: string;
  occupation?: string;
  companyName?: string;
  phone?: string;
  roles?: number[];
  pic?: string;
  language?: TLanguageCode;
  auth?: AuthModel;
  
  // Helper için eklenen alan - departmentId'yi department adına çevirmek için
  department?: string; // Frontend'de kullanılacak, departmentId'den türetilecek
}