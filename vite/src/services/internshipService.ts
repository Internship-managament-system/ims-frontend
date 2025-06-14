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
  workplaceName: string;
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
  workplaceName: string;
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
      workplaceName: data.workplaceName,
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
    const response = await axiosClient.post(INTERNSHIP_APPLICATION_CREATE, requestData);
    return response;
  } catch (error) {
    console.error('Staj başvurusu oluşturma hatası:', error);
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

// Giriş yapmış öğrencinin kendi staj başvurularını getir
export const getMyInternshipApplications = async (): Promise<InternshipApplication[]> => {
  try {
    const response = await axiosClient.get<InternshipApplication[]>(INTERNSHIP_APPLICATIONS_ME);
    return response;
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

// Staj başvurusunu güncelle
export const updateInternshipApplication = async (id: string, data: NewInternshipApplication): Promise<InternshipApplication> => {
  try {
    const requestData = {
      internshipId: data.internshipId,
      workplaceName: data.workplaceName,
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
    const response = await axiosClient.put<InternshipApplication>(INTERNSHIP_APPLICATION_DETAIL(id), requestData);
    return response;
  } catch (error) {
    console.error('Staj başvurusu güncelleme hatası:', error);
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