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
  console.log('mapApiResponseToCommissionMember input (RAW):', JSON.stringify(data));
  
  // Veri kontrolü - null veya undefined değilse işle
  if (!data) {
    console.error('mapApiResponseToCommissionMember: Geçersiz veri:', data);
    return {
      id: '0',
      email: '',
      enabled: false,
      status: 'inactive',
      role: 'COMMISSION_MEMBER',
    };
  }
  
  // API yanıtında rol bilgisini kontrol et - farklı alanlar olabilir
  console.log('API yanıtında role alanı kontrolü:');
  console.log('- data.role:', data.role);
  console.log('- data.Role:', data.Role);
  console.log('- data.userRole:', data.userRole);
  console.log('- data.authority:', data.authority);
  console.log('- data.authorities:', data.authorities);
  
  // Role değerini belirle - farklı alanlardan kontrol et
  let roleValue = 'COMMISSION_MEMBER'; // Varsayılan değer
  
  if (data.role) {
    roleValue = data.role;
  } else if (data.Role) {
    roleValue = data.Role;
  } else if (data.userRole) {
    roleValue = data.userRole;
  } else if (data.authority) {
    roleValue = data.authority;
  } else if (Array.isArray(data.authorities) && data.authorities.length > 0) {
    // Bazen rol bilgisi authorities dizisinde olabilir
    roleValue = data.authorities[0];
  }
  
  // Dönüştürülmüş veri - role alanını kesinlikle içermeli
  const mappedData: CommissionMember = {
    ...data,
    role: roleValue,
    title: data.fullName ? data.fullName.split(' ')[0] + ' ' + (data.fullName.split(' ')[1] || '') : '',
  };
  
  console.log(`Kullanıcı: ${mappedData.fullName || `${mappedData.name || ''} ${mappedData.surname || ''}`}`);
  console.log(`İşlenmiş role: ${mappedData.role}`);
  
  console.log('mapApiResponseToCommissionMember output:', mappedData);
  return mappedData;
};

// Tüm komisyon üyelerini getir
export const getAllCommissionMembers = async (): Promise<CommissionMember[]> => {
  try {
    console.log('API isteği yapılıyor:', COMMISSION_MEMBERS);
    const response = await axiosClient.get<any[]>(COMMISSION_MEMBERS);
    console.log('API yanıtı (RAW) alındı:', JSON.stringify(response));
    
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
      
      return responseArray.map(mapApiResponseToCommissionMember);
    }
    
    const mappedResponse = response.map(mapApiResponseToCommissionMember);
    console.log('İşlenmiş API yanıtı:', mappedResponse);
    
    return mappedResponse;
  } catch (error) {
    console.error('Komisyon üyeleri getirme hatası:', error);
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
      console.log(`Komisyon üyesi ekleme isteği (ID ile): /api/v1/commission-members/assign/${memberData.userId}`);
      
      // Departman ID'si varsa, request body olarak gönder
      const requestData = memberData.departmentId ? { departmentId: memberData.departmentId } : {};
      console.log('Komisyon üyesi ekleme veri:', requestData);
      
      const response = await axiosClient.post<any>(COMMISSION_MEMBER_ASSIGN(memberData.userId), requestData);
      
      console.log('Komisyon üyesi ekleme yanıtı:', response);
      return mapApiResponseToCommissionMember(response);
    } 
    // Yeni tarzda form verileri gönderiliyorsa
    else if (memberData.email && memberData.name && memberData.surname) {
      console.log('Yeni komisyon üyesi ekleme isteği (Form ile):', COMMISSION_MEMBER_CREATE);
      
      // API'ye gönderilecek veri formatı
      const apiData = {
        email: memberData.email,
        name: memberData.name,
        surname: memberData.surname,
        departmentId: memberData.departmentId
      };
      
      console.log('Komisyon üyesi ekleme veri:', apiData);
      const response = await axiosClient.post<any>(COMMISSION_MEMBER_CREATE, apiData);
      
      console.log('Komisyon üyesi ekleme yanıtı:', response);
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
    console.log(`Komisyon başkanı atama isteği yapılıyor: ${id}`);
    // Backend'de otomatik olarak eski başkanın komisyon başkanlığı görevi kaldırılır
    // ve yeni başkan atanır. Sistemde sadece bir başkan olabilir.
    const response = await axiosClient.post<any>(COMMISSION_MAKE_CHAIRMAN(id));
    console.log('Komisyon başkanı atama yanıtı:', response);
    
    // Yeni komisyon başkanını döndür
    return mapApiResponseToCommissionMember(response);
  } catch (error) {
    console.error('Komisyon başkanı atama hatası:', error);
    throw error;
  }
};

// Komisyon başkanını görevden al
export const removeChairman = async (id: number): Promise<CommissionMember> => {
  try {
    console.log(`Komisyon başkanını görevden alma isteği yapılıyor: ${id}`);
    // Bu işlem, mevcut başkanı komisyon üyesi yapar, başkanlık görevi kaldırılır
    // Sistemde başka bir başkan olmadıkça bu işlem yapılır
    const response = await axiosClient.post<any>(COMMISSION_REMOVE_CHAIRMAN(id));
    console.log('Komisyon başkanını görevden alma yanıtı:', response);
    
    // Artık komisyon üyesi olan eski başkanı döndür
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