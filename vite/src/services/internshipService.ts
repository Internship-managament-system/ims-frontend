import axiosClient from '@/api/axiosClient';
import { 
  INTERNSHIP_APPLICATIONS,
  INTERNSHIP_APPLICATION_DETAIL,
  INTERNSHIP_APPLICATION_CREATE,
  INTERNSHIP_APPLICATION_STATUS_UPDATE,
  INTERNSHIP_APPLICATION_ASSIGN,
  INTERNSHIP_APPLICATIONS_ME,
  INTERNSHIP_APPLICATIONS_DEPARTMENT,
  INTERNSHIP_APPLICATIONS_ASSIGNED,
  INTERNSHIPS,
  INTERNSHIP_DETAIL
} from '@/api/endpoints';

// Staj başvurusu durumları
export type InternshipStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

// Staj başvuru türleri
export type InternshipType = 'VOLUNTARY' | 'COMPULSORY';

// Staj arayüzü (DB tablosundan gelen veriler)
export interface Internship {
  id: string;
  name: string;
  description: string;
}

// Staj detayı arayüzü
export interface InternshipDetail {
  id: string;
  name: string;
  description: string;
  durationOfDays: number;
  departmentId: string;
  rules: any[];
}

// Staj başvurusu arayüzü (Swagger'dan alınan son yapıya göre güncellendi)
export interface InternshipApplication {
  id: string;
  studentId: string;
  studentName: string;
  studentSurname: string;
  studentFullName: string;
  studentEmail: string;
  internshipId?: string;
  internshipName?: string;
  departmentId: string;
  departmentName: string;
  program: string;
  programText: string;
  internshipPeriod: string;
  internshipPeriodText: string;
  province: string;
  provinceText: string;
  activityField: string;
  workplaceEmail: string;
  workplacePhone: string;
  workplaceAddress: string;
  startDate: string;
  startDateFormatted?: string;
  endDate: string;
  endDateFormatted?: string;
  durationInDays: number;
  durationInfo?: string;
  weeklyWorkingDays: string;
  weeklyWorkingDaysText: string;
  hasGeneralHealthInsurance: boolean;
  internshipType: InternshipType;
  internshipTypeText: string;
  status: InternshipStatus;
  statusText: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  createdAt: string;
  updatedAt: string;
}

// Yeni staj başvurusu oluşturmak için arayüz (Swagger ve backend isteklerine göre güncellendi)
export interface NewInternshipApplication {
  internshipId: string;
  province: string;
  companyName: string;
  activityField: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  startDate: string; // YYYY-MM-DD
  weeklyWorkingDays: number;
  hasGeneralHealthInsurance: boolean;
  applicationType: 'VOLUNTARY' | 'MANDATORY';
}

// Durum güncelleme için arayüz
export interface StatusUpdateRequest {
  status: InternshipStatus;
  comment?: string;
}

// Atama için arayüz
export interface AssignRequest {
  userId: string;
}

// İki tarih arasındaki iş günü sayısını hesapla (hafta sonları hariç)
export const calculateDurationInDays = (startDate: string, endDate: string, weeklyWorkingDays: string = 'FIVE_DAYS'): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Tarihleri karşılaştır
  if (start > end) {
    return 0; // Başlangıç tarihi bitiş tarihinden sonra ise sıfır döndür
  }
  
  let workingDays = 0;
  const currentDate = new Date(start);
  
  // Başlangıç tarihinden bitiş tarihine kadar her günü kontrol et
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay(); // 0: Pazar, 6: Cumartesi
    
    // Haftalık çalışma gününe göre iş günü sayısını artır
    if (weeklyWorkingDays === 'FIVE_DAYS') {
      // 5 günlük iş haftası (Pazartesi-Cuma)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        workingDays++;
      }
    } else {
      // 6 günlük iş haftası (Pazartesi-Cumartesi)
      if (dayOfWeek >= 1 && dayOfWeek <= 6) {
        workingDays++;
      }
    }
    
    // Sonraki güne geç
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return workingDays;
};

// Tüm staj başvurularını getir
export const getAllInternshipApplications = async (): Promise<InternshipApplication[]> => {
  try {
    const response = await axiosClient.get<InternshipApplication[]>(INTERNSHIP_APPLICATIONS);
    return response;
  } catch (error) {
    console.error('Staj başvurularını getirme hatası:', error);
    throw error;
  }
};

// Staj başvurusu detayını getir
export const getInternshipApplicationById = async (id: number | string): Promise<InternshipApplication> => {
  try {
    const response = await axiosClient.get<InternshipApplication>(INTERNSHIP_APPLICATION_DETAIL(id));
    return response;
  } catch (error) {
    console.error('Staj başvurusu detayı getirme hatası:', error);
    throw error;
  }
};

// Yeni staj başvurusu oluştur
export const createInternshipApplication = async (data: NewInternshipApplication): Promise<any> => {
  try {
    const requestData = {
      internshipId: data.internshipId,
      province: data.province,
      companyName: data.companyName,
      activityField: data.activityField,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      companyAddress: data.companyAddress,
      startDate: data.startDate,
      weeklyWorkingDays: data.weeklyWorkingDays,
      hasGeneralHealthInsurance: data.hasGeneralHealthInsurance,
      applicationType: data.applicationType
    };
    
    console.log('🌐 Axios\'a gönderilecek requestData:', requestData);
    console.log('🌐 API URL:', INTERNSHIP_APPLICATION_CREATE);
    
    const response = await axiosClient.post(INTERNSHIP_APPLICATION_CREATE, requestData);
    
    console.log('✅ API Success Response:', response);
    return response;
    
  } catch (error: any) {
    console.error('❌ API Error in createInternshipApplication:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error response:', error.response);
    console.error('❌ Error config:', error.config);
    
    if (error.response) {
      console.error('❌ Error response status:', error.response.status);
      console.error('❌ Error response data:', error.response.data);
      console.error('❌ Error response headers:', error.response.headers);
    }
    
    throw error;
  }
};

// Staj başvurusu durumunu güncelle
export const updateInternshipApplicationStatus = async (id: string, statusData: StatusUpdateRequest): Promise<InternshipApplication> => {
  try {
    const response = await axiosClient.put<InternshipApplication>(INTERNSHIP_APPLICATION_STATUS_UPDATE(id), statusData);
    return response;
  } catch (error) {
    console.error('Staj başvurusu durumu güncelleme hatası:', error);
    throw error;
  }
};

// Staj başvurusunu bir kullanıcıya ata
export const assignInternshipApplication = async (id: string, assignData: AssignRequest): Promise<InternshipApplication> => {
  try {
    const response = await axiosClient.put<InternshipApplication>(INTERNSHIP_APPLICATION_ASSIGN(id), assignData);
    return response;
  } catch (error) {
    console.error('Staj başvurusu atama hatası:', error);
    throw error;
  }
};

// Giriş yapmış öğrencinin kendi staj başvurularını getir (YENİ API)
export const getMyInternshipApplicationsList = async (): Promise<InternshipApplicationListItem[]> => {
  try {
    const response: any = await axiosClient.get(INTERNSHIP_APPLICATIONS);
    console.log('📋 FULL API RESPONSE:', JSON.stringify(response, null, 2));
    
    // API response yapısını kontrol et
    if (response.result && Array.isArray(response.result)) {
      console.log('✅ response.result kullanılıyor:', response.result.length, 'öğe');
      return response.result;
    }
    
    if (response.data?.result && Array.isArray(response.data.result)) {
      console.log('✅ response.data.result kullanılıyor:', response.data.result.length, 'öğe');
      return response.data.result;
    }
    
    if (Array.isArray(response)) {
      console.log('✅ response direkt array:', response.length, 'öğe');
      return response;
    }
    
    console.error('❌ API response beklenmeyen formatta:', typeof response);
    return [];
  } catch (error) {
    console.error('Kendi staj başvurularını getirme hatası:', error);
    throw error;
  }
};

// Bölüme göre staj başvurularını getir
export const getInternshipApplicationsByDepartment = async (departmentId: string): Promise<InternshipApplication[]> => {
  try {
    const response = await axiosClient.get<InternshipApplication[]>(INTERNSHIP_APPLICATIONS_DEPARTMENT(departmentId));
    return response;
  } catch (error) {
    console.error('Bölüme göre staj başvurularını getirme hatası:', error);
    throw error;
  }
};

// Giriş yapmış kullanıcıya atanmış staj başvurularını getir
export const getAssignedInternshipApplications = async (): Promise<InternshipApplication[]> => {
  try {
    const response = await axiosClient.get<InternshipApplication[]>(INTERNSHIP_APPLICATIONS_ASSIGNED);
    return response;
  } catch (error) {
    console.error('Atanmış staj başvurularını getirme hatası:', error);
    throw error;
  }
};


// Stajları getir
export const getInternships = async (): Promise<Internship[]> => {
  try {
    const response = await axiosClient.get<Internship[]>(INTERNSHIPS);
    return response;
  } catch (error) {
    console.error('Stajları getirme hatası:', error);
    throw error;
  }
};


// Staj detayını getir
export const getInternshipDetail = async (id: string): Promise<InternshipDetail> => {
  try {
    const response = await axiosClient.get<InternshipDetail>(INTERNSHIP_DETAIL(id));
    return response;
  } catch (error) {
    console.error('Staj detayı getirme hatası:', error);
    throw error;
  }
};

// Yeni API için başvuru listesi arayüzü
export interface InternshipApplicationListItem {
  id: string;
  internshipName: string;
  companyName: string;
  status: string;
  appliedDate: string;
}

// Yeni API için başvuru detayı arayüzü
export interface InternshipApplicationDetail {
  id: string;
  studentId: string;
  internshipId: string;
  companyId: string;
  studentName: string;
  studentSurname: string;
  companyName: string;
  internshipName: string;
  startDate: string;
  endDate: string;
  hasGeneralHealthInsurance: boolean;
  status: string;
  type: string;
  requirements: InternshipRequirement[];
}

export interface InternshipRequirement {
  id: string;
  name: string;
  description: string;
  ruleType: string;
  status: string;
  documentIds: string[];
  documents: InternshipDocument[];
}

export interface InternshipDocument {
  id: string;
  fileAddress: string;
  fileName: string;
  documentType: string;
  description: string;
}

// Yeni API response wrapper'ları
export interface InternshipApplicationListResponse {
  result: InternshipApplicationListItem[];
}

export interface InternshipApplicationDetailResponse {
  result: InternshipApplicationDetail;
}

// Staj başvurusu detayını getir (YENİ API)
export const getInternshipApplicationDetailById = async (id: string): Promise<InternshipApplicationDetail> => {
  try {
    console.log('🔍 Detay API çağrısı yapılıyor, ID:', id);
    const response: any = await axiosClient.get(INTERNSHIP_APPLICATION_DETAIL(id));
    console.log('📋 FULL DETAIL RESPONSE:', JSON.stringify(response, null, 2));
    
    if (response.result) {
      return response.result;
    }
    
    if (response.data?.result) {
      return response.data.result;
    }
    
    return response;
  } catch (error) {
    console.error('Staj başvurusu detayı getirme hatası:', error);
    throw error;
  }
};

// Document yükleme endpoint'i
const UPLOAD_DOCUMENT = (id: string, requirementId: string) => `/api/v1/internship-applications/${id}/add-document/${requirementId}`;

// Document yükleme fonksiyonu
export const uploadInternshipDocument = async (
  applicationId: string, 
  requirementId: string, 
  file: File, 
  fileName: string
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    console.log('📤 Document yükleme başlatılıyor:', {
      applicationId,
      requirementId,
      fileName,
      fileSize: file.size
    });

    const response = await axiosClient.put(
      UPLOAD_DOCUMENT(applicationId, requirementId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ Document yükleme başarılı:', response);
    return response;
  } catch (error) {
    console.error('❌ Document yükleme hatası:', error);
    throw error;
  }
}; 