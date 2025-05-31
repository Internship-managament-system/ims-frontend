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
  isCommissionChairman?: boolean;
  role?: 'COMMISSION_HEAD' | 'COMMISSION_MEMBER'; // Frontend için
  status: string;
  createdAt?: string;
}

// Yeni komisyon üyesi ekleme istekleri için yeni arayüz
export interface NewCommissionMember {
  userId: number | string; // Kullanıcı ID'si
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

// Mock veri - geliştirme için
const MOCK_MODE = false; // Gerçek API'yi kullanıyoruz

// Mock komisyon üyeleri
const mockMembers: CommissionMember[] = [
  {
    id: 1,
    name: 'Mehmet',
    surname: 'ELMACI',
    fullName: 'Arş. Gör. Mehmet ELMACI',
    title: 'Arş. Gör.',
    email: 'mehmetelmaci@erciyes.edu.tr',
    role: 'COMMISSION_MEMBER',
    isCommissionChairman: false,
    status: 'active',
    enabled: true
  },
  {
    id: 2,
    name: 'Osman Buğra',
    surname: 'KAHRAMAN',
    fullName: 'Arş. Gör. Osman Buğra KAHRAMAN',
    title: 'Arş. Gör.',
    email: 'obkahraman@erciyes.edu.tr',
    role: 'COMMISSION_HEAD',
    isCommissionChairman: true,
    status: 'active',
    enabled: true
  },
  {
    id: 3,
    name: 'Fatma',
    surname: 'AZİZOĞLU',
    fullName: 'Arş. Gör. Fatma AZİZOĞLU',
    title: 'Arş. Gör.',
    email: 'fatmaazizoglu@erciyes.edu.tr',
    role: 'COMMISSION_MEMBER',
    isCommissionChairman: false,
    status: 'active',
    enabled: true
  },
  {
    id: 4,
    name: 'Gökhan',
    surname: 'AZİZOĞLU',
    fullName: 'Arş. Gör. Gökhan AZİZOĞLU',
    title: 'Arş. Gör.',
    email: 'gazizoglu@erciyes.edu.tr',
    role: 'COMMISSION_MEMBER',
    isCommissionChairman: false,
    status: 'active',
    enabled: true
  }
];

// Mock bölümler
const mockDepartments: Department[] = [
  { id: 1, name: 'Bilgisayar Mühendisliği' },
  { id: 2, name: 'Elektrik-Elektronik Mühendisliği' },
  { id: 3, name: 'Makina Mühendisliği' },
  { id: 4, name: 'Endüstri Mühendisliği' }
];

// API yanıtını CommissionMember formatına dönüştür
const mapApiResponseToCommissionMember = (data: any): CommissionMember => {
  console.log('mapApiResponseToCommissionMember input:', data);
  
  // Veri kontrolü - null veya undefined değilse işle
  if (!data) {
    console.error('mapApiResponseToCommissionMember: Geçersiz veri:', data);
    return {
      id: '0',
      email: '',
      enabled: false,
      status: 'inactive',
      role: 'COMMISSION_MEMBER',
      isCommissionChairman: false
    };
  }
  
  // Admin rolü kontrolü - admin rolü varsa otomatik olarak başkan olarak işaretle
  const isAdminRole = data.role === 'ADMIN';
  
  // Dönüştürülmüş veri
  const mappedData = {
    ...data,
    // Admin rolü varsa veya isCommissionChairman true ise başkan olarak işaretle
    isCommissionChairman: isAdminRole ? true : !!data.isCommissionChairman,
    role: isAdminRole || data.isCommissionChairman ? 'COMMISSION_HEAD' : 'COMMISSION_MEMBER',
    title: data.fullName ? data.fullName.split(' ')[0] + ' ' + (data.fullName.split(' ')[1] || '') : '',
  };
  
  console.log('mapApiResponseToCommissionMember output:', mappedData);
  return mappedData;
};

// Tüm komisyon üyelerini getir
export const getAllCommissionMembers = async (): Promise<CommissionMember[]> => {
  if (MOCK_MODE) {
    // Mock veri döndür
    return new Promise(resolve => setTimeout(() => resolve(mockMembers), 500));
  }
  
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
  if (MOCK_MODE) {
    const member = mockMembers.find(m => m.id === id);
    if (!member) throw new Error('Üye bulunamadı');
    return new Promise(resolve => setTimeout(() => resolve(member), 500));
  }
  
  try {
    const response = await axiosClient.get<any>(COMMISSION_MEMBER_DETAIL(id));
    return mapApiResponseToCommissionMember(response);
  } catch (error) {
    console.error('Komisyon üyesi detay hatası:', error);
    throw error;
  }
};

// Yeni komisyon üyesi ekle (Yeni versiyon - Kullanıcı ID'si ile)
export const createCommissionMember = async (memberData: NewCommissionMember): Promise<CommissionMember> => {
  if (MOCK_MODE) {
    const newMember: CommissionMember = {
      id: mockMembers.length + 1,
      name: `Kullanıcı-${memberData.userId}`,
      surname: `Soyad-${memberData.userId}`,
      fullName: `Kullanıcı-${memberData.userId} Soyad-${memberData.userId}`,
      title: 'Arş. Gör.',
      email: `user${memberData.userId}@erciyes.edu.tr`,
      role: 'COMMISSION_MEMBER',
      isCommissionChairman: false,
      status: 'active',
      enabled: true
    };
    mockMembers.push(newMember);
    return new Promise(resolve => setTimeout(() => resolve(newMember), 500));
  }
  
  try {
    // Kullanıcı ID'sini kontrol et
    const userId = memberData.userId;
    if (!userId) {
      throw new Error('Kullanıcı ID\'si belirtilmedi');
    }
    
    // Yeni endpoint kullan: /api/v1/commission-members/assign/{userId}
    console.log(`Komisyon üyesi ekleme isteği: /api/v1/commission-members/assign/${userId}`);
    const response = await axiosClient.post<any>(COMMISSION_MEMBER_ASSIGN(userId));
    
    console.log('Komisyon üyesi ekleme yanıtı:', response);
    return mapApiResponseToCommissionMember(response);
  } catch (error) {
    console.error('Komisyon üyesi ekleme hatası:', error);
    throw error;
  }
};

// Eski formatla komisyon üyesi ekleme (geriye dönük uyumluluk için)
export const createCommissionMemberLegacy = async (memberData: LegacyNewCommissionMember): Promise<CommissionMember> => {
  if (MOCK_MODE) {
    const newMember: CommissionMember = {
      id: mockMembers.length + 1,
      name: memberData.firstName,
      surname: memberData.lastName,
      fullName: `${memberData.title} ${memberData.firstName} ${memberData.lastName}`,
      title: memberData.title,
      email: memberData.email,
      role: 'COMMISSION_MEMBER',
      isCommissionChairman: false,
      status: 'active',
      enabled: true
    };
    mockMembers.push(newMember);
    return new Promise(resolve => setTimeout(() => resolve(newMember), 500));
  }
  
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
  if (MOCK_MODE) {
    const memberIndex = mockMembers.findIndex(m => m.id === id);
    if (memberIndex === -1) throw new Error('Üye bulunamadı');
    
    mockMembers[memberIndex] = {
      ...mockMembers[memberIndex],
      ...memberData
    };
    
    return new Promise(resolve => setTimeout(() => resolve(mockMembers[memberIndex]), 500));
  }
  
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
  if (MOCK_MODE) {
    const memberIndex = mockMembers.findIndex(m => m.id === id);
    if (memberIndex === -1) throw new Error('Üye bulunamadı');
    
    mockMembers.splice(memberIndex, 1);
    return new Promise(resolve => setTimeout(() => resolve(), 500));
  }
  
  try {
    await axiosClient.delete<void>(COMMISSION_MEMBER_DELETE(id));
  } catch (error) {
    console.error('Komisyon üyesi silme hatası:', error);
    throw error;
  }
};

// Komisyon üyesini başkan yap
export const makeChairman = async (id: number): Promise<CommissionMember> => {
  if (MOCK_MODE) {
    // Önce mevcut başkanı bulup rolünü değiştir
    const currentChairmanIndex = mockMembers.findIndex(m => m.role === 'COMMISSION_HEAD');
    if (currentChairmanIndex !== -1) {
      mockMembers[currentChairmanIndex].role = 'COMMISSION_MEMBER';
      mockMembers[currentChairmanIndex].isCommissionChairman = false;
    }
    
    // Yeni başkanı ata
    const memberIndex = mockMembers.findIndex(m => m.id === id);
    if (memberIndex === -1) throw new Error('Üye bulunamadı');
    
    mockMembers[memberIndex].role = 'COMMISSION_HEAD';
    mockMembers[memberIndex].isCommissionChairman = true;
    return new Promise(resolve => setTimeout(() => resolve(mockMembers[memberIndex]), 500));
  }
  
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
  if (MOCK_MODE) {
    const memberIndex = mockMembers.findIndex(m => m.id === id);
    if (memberIndex === -1) throw new Error('Üye bulunamadı');
    
    mockMembers[memberIndex].role = 'COMMISSION_MEMBER';
    mockMembers[memberIndex].isCommissionChairman = false;
    return new Promise(resolve => setTimeout(() => resolve(mockMembers[memberIndex]), 500));
  }
  
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
  if (MOCK_MODE) {
    return new Promise(resolve => setTimeout(() => resolve(mockDepartments), 500));
  }
  
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
  if (MOCK_MODE) {
    const department = mockDepartments.find(d => d.id === id);
    if (!department) throw new Error('Bölüm bulunamadı');
    return new Promise(resolve => setTimeout(() => resolve(department), 500));
  }
  
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
  if (MOCK_MODE) {
    // Bölüme göre filtreleme yapıyormuş gibi davran
    // Gerçek uygulamada her üyenin bölüm bilgisi olacaktır
    const filteredMembers = mockMembers.filter((_, index) => index % 2 === (departmentId % 2));
    return new Promise(resolve => setTimeout(() => resolve(filteredMembers), 500));
  }
  
  try {
    const response = await axiosClient.get<any[]>(COMMISSION_DEPARTMENT_MEMBERS(departmentId));
    return Array.isArray(response) ? response.map(mapApiResponseToCommissionMember) : [];
  } catch (error) {
    console.error('Bölüm komisyon üyelerini getirme hatası:', error);
    throw error;
  }
};