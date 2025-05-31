import axiosClient from '@/api/axiosClient';
import { 
  INTERNSHIP_APPLICATIONS,
  INTERNSHIP_APPLICATION_DETAIL,
  INTERNSHIP_APPLICATION_CREATE,
  INTERNSHIP_APPLICATION_STATUS_UPDATE,
  INTERNSHIP_APPLICATION_ASSIGN,
  INTERNSHIP_APPLICATIONS_ME,
  INTERNSHIP_APPLICATIONS_DEPARTMENT,
  INTERNSHIP_APPLICATIONS_ASSIGNED
} from '@/api/endpoints';

// Staj başvurusu durumları
export type InternshipStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

// Staj başvuru türleri
export type InternshipType = 'VOLUNTARY' | 'COMPULSORY';

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
  studentId: string;
  departmentId: string;
  program: string;
  internshipPeriod: string;
  workplaceName: string;
  province: string;
  activityField: string;
  workplaceEmail: string;
  workplacePhone: string;
  workplaceAddress: string;
  startDate: string;
  endDate: string;
  weeklyWorkingDays: string;
  hasGeneralHealthInsurance: boolean;
  internshipType: InternshipType;
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

// Tüm staj başvurularını getir (admin için)
export const getAllInternshipApplications = async (): Promise<InternshipApplication[]> => {
  try {
    console.log('Tüm staj başvurularını getirme isteği yapılıyor');
    const response = await axiosClient.get<InternshipApplication[]>(INTERNSHIP_APPLICATIONS);
    console.log('Staj başvuruları alındı:', response);
    return response;
  } catch (error) {
    console.error('Staj başvurularını getirme hatası:', error);
    throw error;
  }
};

// Staj başvurusu detayını getir
export const getInternshipApplicationById = async (id: string): Promise<InternshipApplication> => {
  try {
    console.log(`Staj başvurusu detayı getiriliyor: ${id}`);
    const response = await axiosClient.get<InternshipApplication>(INTERNSHIP_APPLICATION_DETAIL(id));
    console.log('Staj başvurusu detayı alındı:', response);
    return response;
  } catch (error) {
    console.error('Staj başvurusu detayı getirme hatası:', error);
    throw error;
  }
};

// Yeni staj başvurusu oluştur
export const createInternshipApplication = async (data: NewInternshipApplication): Promise<InternshipApplication> => {
  try {
    // Swagger'da görünen örnek yapıya göre alanları düzenle
    const requestData = {
      studentId: data.studentId,
      departmentId: data.departmentId,
      program: data.program,
      internshipPeriod: data.internshipPeriod,
      workplaceName: data.workplaceName,
      province: data.province.toUpperCase(), // Backend'in beklediği ENUM formatına dönüştür
      activityField: data.activityField,
      workplaceEmail: data.workplaceEmail,
      workplacePhone: data.workplacePhone,
      workplaceAddress: data.workplaceAddress,
      startDate: data.startDate,
      endDate: data.endDate,
      weeklyWorkingDays: data.weeklyWorkingDays,
      hasGeneralHealthInsurance: data.hasGeneralHealthInsurance,
      internshipType: data.internshipType
    };
    
    console.log('Staj başvurusu oluşturma isteği yapılıyor:', requestData);
    console.log('API endpoint:', INTERNSHIP_APPLICATION_CREATE);
    
    try {
      const response = await axiosClient.post<InternshipApplication>(INTERNSHIP_APPLICATION_CREATE, requestData);
      console.log('Staj başvurusu oluşturuldu:', response);
      return response;
    } catch (apiError: any) {
      console.error('API isteği hatası:', apiError);
      // Axios hatasında detaylı bilgileri göster
      if (apiError.response) {
        console.error('Hata status:', apiError.response.status);
        console.error('Hata data:', apiError.response.data);
        console.error('Hata headers:', apiError.response.headers);
      } else if (apiError.request) {
        console.error('İstek yapıldı ama yanıt alınamadı:', apiError.request);
      } else {
        console.error('İstek oluşturulurken hata:', apiError.message);
      }
      throw apiError;
    }
  } catch (error) {
    console.error('Staj başvurusu oluşturma hatası:', error);
    throw error;
  }
};

// Staj başvurusu durumunu güncelle
export const updateInternshipApplicationStatus = async (id: string, statusData: StatusUpdateRequest): Promise<InternshipApplication> => {
  try {
    console.log(`Staj başvurusu durumu güncelleniyor: ${id}`, statusData);
    const response = await axiosClient.put<InternshipApplication>(INTERNSHIP_APPLICATION_STATUS_UPDATE(id), statusData);
    console.log('Staj başvurusu durumu güncellendi:', response);
    return response;
  } catch (error) {
    console.error('Staj başvurusu durumu güncelleme hatası:', error);
    throw error;
  }
};

// Staj başvurusunu bir kullanıcıya ata
export const assignInternshipApplication = async (id: string, assignData: AssignRequest): Promise<InternshipApplication> => {
  try {
    console.log(`Staj başvurusu atanıyor: ${id}`, assignData);
    const response = await axiosClient.put<InternshipApplication>(INTERNSHIP_APPLICATION_ASSIGN(id), assignData);
    console.log('Staj başvurusu atandı:', response);
    return response;
  } catch (error) {
    console.error('Staj başvurusu atama hatası:', error);
    throw error;
  }
};

// Giriş yapmış öğrencinin kendi staj başvurularını getir
export const getMyInternshipApplications = async (): Promise<InternshipApplication[]> => {
  try {
    console.log('Kendi staj başvurularını getirme isteği yapılıyor');
    const response = await axiosClient.get<InternshipApplication[]>(INTERNSHIP_APPLICATIONS_ME);
    console.log('Kendi staj başvuruları alındı:', response);
    return response;
  } catch (error) {
    console.error('Kendi staj başvurularını getirme hatası:', error);
    throw error;
  }
};

// Bölüme göre staj başvurularını getir
export const getInternshipApplicationsByDepartment = async (departmentId: string): Promise<InternshipApplication[]> => {
  try {
    console.log(`Bölüme göre staj başvurularını getirme isteği yapılıyor: ${departmentId}`);
    const response = await axiosClient.get<InternshipApplication[]>(INTERNSHIP_APPLICATIONS_DEPARTMENT(departmentId));
    console.log('Bölüme göre staj başvuruları alındı:', response);
    return response;
  } catch (error) {
    console.error('Bölüme göre staj başvurularını getirme hatası:', error);
    throw error;
  }
};

// Giriş yapmış kullanıcıya atanmış staj başvurularını getir
export const getAssignedInternshipApplications = async (): Promise<InternshipApplication[]> => {
  try {
    console.log('Atanmış staj başvurularını getirme isteği yapılıyor');
    const response = await axiosClient.get<InternshipApplication[]>(INTERNSHIP_APPLICATIONS_ASSIGNED);
    console.log('Atanmış staj başvuruları alındı:', response);
    return response;
  } catch (error) {
    console.error('Atanmış staj başvurularını getirme hatası:', error);
    throw error;
  }
}; 