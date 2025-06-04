import axiosClient from '@/api/axiosClient';
import { 
  COMMISSION_MEMBERS, 
  COMMISSION_MEMBER_DETAIL, 
  COMMISSION_MEMBER_CREATE, 
  COMMISSION_MEMBER_UPDATE, 
  COMMISSION_MEMBER_DELETE,
  COMMISSION_MAKE_CHAIRMAN,
  COMMISSION_REMOVE_CHAIRMAN,
  COMMISSION_DEPARTMENT_MEMBERS,
  DEPARTMENTS,
  DEPARTMENT_DETAIL,
  COMMISSION_MEMBER_ASSIGN
} from '@/api/endpoints';

// API yanıtına göre güncellenmiş arayüz
export interface CommissionMember {
  id: string | number;
  userId?: string | number;
  name?: string;
  surname?: string;
  fullName?: string;
  title?: string; // Frontend için
  email: string;
  departmentId?: string;
  departmentName?: string;
  enabled: boolean;
  role: string; // Frontend için
  status: string;
  createdAt?: string;
}

// Yeni komisyon üyesi ekleme istekleri için yeni arayüz
export interface NewCommissionMember {
  userId?: number | string; // Eski kullanım için opsiyonel bırakıldı
  email?: string; // Yeni ekleme formu için
  name?: string; // Yeni ekleme formu için
  surname?: string; // Yeni ekleme formu için
  departmentId?: number | string; // Departman ID'si 
}

// Eski arayüz, geçiş için korundu
export interface LegacyNewCommissionMember {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId?: number | string;
}

export interface Department {
  id: number | string;
  name: string;
}

// API yanıtını CommissionMember formatına dönüştür
const mapApiResponseToCommissionMember = (data: any): CommissionMember => {
  const mappedData: CommissionMember = {
    id: data.id ||  '',
    userId: data.userId || data.user_id || '',
    name: data.name || data.firstName || '',
    surname: data.surname || data.lastName || '',
    fullName: data.fullName || `${data.name || data.firstName || ''} ${data.surname || data.lastName || ''}`.trim(),
    email: data.email || '',
    role: data.role || data.Role || data.userRole || data.authority || (Array.isArray(data.authorities) ? data.authorities[0] : data.authorities) || 'COMMISSION_MEMBER',
    departmentId: data.departmentId || data.department_id || data.department?.id || '',
    departmentName: data.departmentName || data.department_name || data.department?.name || '',
    enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
    status: data.status || data.accountStatus || data.userStatus || 'ACTIVE',
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
  };

  return mappedData;
};

// Tüm komisyon üyelerini getir
export const getAllCommissionMembers = async (): Promise<CommissionMember[]> => {
  try {
    const response = await axiosClient.get<CommissionMember[]>(COMMISSION_MEMBERS);
    
    if (!response) {
      return [];
    }
    
    if (!Array.isArray(response)) {
      const responseArray = response ? (Array.isArray(response) ? response : [response]) : [];
      return responseArray;
    }

    const mappedResponse = response.map(mapApiResponseToCommissionMember);
    return mappedResponse;
  } catch (error) {
    console.error('Komisyon üyelerini getirme hatası:', error);
    throw error;
  }
};

// Komisyon üyesi detayını getir
export const getCommissionMemberById = async (id: number): Promise<CommissionMember> => {
  try {
    const response = await axiosClient.get<any>(COMMISSION_MEMBER_DETAIL(id));
    return mapApiResponseToCommissionMember(response);
  } catch (error) {
    console.error('Komisyon üyesi detay hatası:', error);
    throw error;
  }
};

// Yeni komisyon üyesi ekle (Yeni versiyon - Form verileri ile)
export const createCommissionMember = async (memberData: NewCommissionMember): Promise<CommissionMember> => {
  try {
    // Eski tarzda userId gönderiliyorsa
    if (memberData.userId) {
      const requestData = memberData.departmentId ? { departmentId: memberData.departmentId } : {};
      const response = await axiosClient.post<any>(COMMISSION_MEMBER_ASSIGN(memberData.userId), requestData);
      return mapApiResponseToCommissionMember(response);
    } 
    // Yeni tarzda form verileri gönderiliyorsa
    else if (memberData.email && memberData.name && memberData.surname) {
      const apiData = {
        email: memberData.email,
        name: memberData.name,
        surname: memberData.surname,
        departmentId: memberData.departmentId
      };
      
      const response = await axiosClient.post<any>(COMMISSION_MEMBER_CREATE, apiData);
      return mapApiResponseToCommissionMember(response);
    } 
    else {
      throw new Error('Geçersiz üye verisi. Email, ad ve soyad veya kullanıcı ID belirtilmelidir.');
    }
  } catch (error) {
    console.error('Komisyon üyesi ekleme hatası:', error);
    throw error;
  }
};

// Eski formatla komisyon üyesi ekleme (geriye dönük uyumluluk için)
export const createCommissionMemberLegacy = async (memberData: LegacyNewCommissionMember): Promise<CommissionMember> => {
  try {
    // API'ye gönderilecek veri formatı
    const apiData = {
      name: memberData.firstName,
      surname: memberData.lastName,
      email: memberData.email,
      departmentId: memberData.departmentId
    };
    
    const response = await axiosClient.post<any>(COMMISSION_MEMBER_CREATE, apiData);
    return mapApiResponseToCommissionMember(response);
  } catch (error) {
    console.error('Komisyon üyesi ekleme hatası:', error);
    throw error;
  }
};

// Komisyon üyesi bilgilerini güncelle
export const updateCommissionMember = async (id: number, memberData: Partial<CommissionMember>): Promise<CommissionMember> => {
  try {
    const response = await axiosClient.put<any>(COMMISSION_MEMBER_UPDATE(id), memberData);
    return mapApiResponseToCommissionMember(response);
  } catch (error) {
    console.error('Komisyon üyesi güncelleme hatası:', error);
    throw error;
  }
};

// Komisyon üyesini sil
export const deleteCommissionMember = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete<void>(COMMISSION_MEMBER_DELETE(id));
  } catch (error) {
    console.error('Komisyon üyesi silme hatası:', error);
    throw error;
  }
};

// Komisyon üyesini başkan yap
export const makeChairman = async (id: number): Promise<CommissionMember> => {
  try {
    const response = await axiosClient.post<any>(COMMISSION_MAKE_CHAIRMAN(id));
    return mapApiResponseToCommissionMember(response);
  } catch (error) {
    console.error('Komisyon başkanı atama hatası:', error);
    throw error;
  }
};

// Komisyon başkanını görevden al
export const removeChairman = async (id: number): Promise<CommissionMember> => {
  try {
    const response = await axiosClient.post<any>(COMMISSION_REMOVE_CHAIRMAN(id));
    return mapApiResponseToCommissionMember(response);
  } catch (error) {
    console.error('Komisyon başkanı görevden alma hatası:', error);
    throw error;
  }
};

// Bölümleri getir
export const getDepartments = async (): Promise<Department[]> => {
  try {
    // Yeni endpoint kullanılıyor: /api/v1/departments
    return axiosClient.get<Department[]>(DEPARTMENTS);
  } catch (error) {
    console.error('Bölümleri getirme hatası:', error);
    throw error;
  }
};

// Bölüm detayını getir
export const getDepartmentById = async (id: number): Promise<Department> => {
  try {
    // Yeni endpoint kullanılıyor: /api/v1/departments/{id}
    return axiosClient.get<Department>(DEPARTMENT_DETAIL(id));
  } catch (error) {
    console.error('Bölüm detayı getirme hatası:', error);
    throw error;
  }
};

// Bölüme göre komisyon üyelerini getir
export const getCommissionMembersByDepartment = async (departmentId: number): Promise<CommissionMember[]> => {
  try {
    const response = await axiosClient.get<any[]>(COMMISSION_DEPARTMENT_MEMBERS(departmentId));
    return Array.isArray(response) ? response.map(mapApiResponseToCommissionMember) : [];
  } catch (error) {
    console.error('Bölüm komisyon üyelerini getirme hatası:', error);
    throw error;
  }
};