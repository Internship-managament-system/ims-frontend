// API Endpoints

// API base URL, fetchClient'da zaten ayarlandığı için buraya koymuyoruz
export const API_BASE_URL = '';

// Auth endpoints
export const AUTH_LOGIN = `/api/v1/auth/login`;
export const AUTH_LOGOUT = `/api/v1/auth/logout`;
export const AUTH_REGISTER = `/api/v1/auth/register`;
export const AUTH_RESET_PASSWORD = `/api/v1/auth/reset-password`;
export const AUTH_USER_PROFILE = `/api/v1/auth/me`;

// User endpoints
export const USERS = `/api/v1/users`;
export const USER_DETAIL = (id: string | number) => `/api/v1/users/${id}`;

// Commission members endpoints
export const COMMISSION_MEMBERS = `/api/v1/commission-members`;
export const COMMISSION_MEMBERS_USERS = `/api/v1/commission-members/users`; // Sistemdeki tüm kullanıcıları getiren endpoint
export const COMMISSION_MEMBER_DETAIL = (id: string | number) => `/api/v1/commission-members/${id}`;
export const COMMISSION_MEMBER_UPDATE = (id: string | number) => `/api/v1/commission-members/${id}`;
export const COMMISSION_MEMBER_DELETE = (id: string | number) => `/api/v1/commission-members/${id}`;
export const COMMISSION_MEMBER_CREATE = `/api/v1/commission-members`; // Eski endpointlerde kullanılıyor
export const COMMISSION_MEMBER_ASSIGN = (userId: string | number) => `/api/v1/commission-members/assign/${userId}`; // Yeni endpoint
export const COMMISSION_MAKE_CHAIRMAN = (id: string | number) => `/api/v1/commission-members/${id}/make-chairman`;
export const COMMISSION_REMOVE_CHAIRMAN = (id: string | number) => `/api/v1/commission-members/${id}/remove-chairman`;

// Departman endpoints - yeni API yapısına göre güncellendi
export const DEPARTMENTS = `/api/v1/departments`;
export const DEPARTMENT_DETAIL = (id: string | number) => `/api/v1/departments/${id}`;
export const DEPARTMENT_CREATE = `/api/v1/departments`;

// Eski departman endpoint'leri, uyumluluğu korumak için tutuldu
export const COMMISSION_DEPARTMENTS = DEPARTMENTS; // `/api/v1/departments` ile değiştirildi
export const COMMISSION_DEPARTMENT_MEMBERS = (departmentId: string | number) => `/api/v1/commission-members/department/${departmentId}`;

// Staj başvuru endpoints
export const INTERNSHIP_APPLICATIONS = `/api/v1/internship-applications`; // Tüm staj başvurularını listele
export const INTERNSHIP_APPLICATION_DETAIL = (id: string | number) => `/api/v1/internship-applications/${id}`; // Staj başvurusu detayını getir
export const INTERNSHIP_APPLICATION_CREATE = `/api/v1/internship-applications`; // Yeni staj başvurusu oluştur
export const INTERNSHIP_APPLICATION_STATUS_UPDATE = (id: string | number) => `/api/v1/internship-applications/${id}/status`; // Staj başvurusu durumunu güncelle
export const INTERNSHIP_APPLICATION_ASSIGN = (id: string | number) => `/api/v1/internship-applications/${id}/assign`; // Staj başvurusunu bir kullanıcıya ata
export const INTERNSHIP_APPLICATIONS_ME = `/api/v1/internship-applications/me`; // Giriş yapmış öğrencinin kendi staj başvurularını listele
export const INTERNSHIP_APPLICATIONS_DEPARTMENT = (departmentId: string | number) => `/api/v1/internship-applications/department/${departmentId}`; // Bölüme göre staj başvurularını listele
export const INTERNSHIP_APPLICATIONS_ASSIGNED = `/api/v1/internship-applications/assigned-to-me`; // Giriş yapmış kullanıcıya atanmış staj başvurularını listele

export const INTERNSHIP_FORM_OPTIONS_PROVINCES = `/api/v1/internship-form-options/provinces`; // İlleri listele

// Internships endpoints
export const INTERNSHIPS = `/api/v1/internships`; // Stajları listele
export const INTERNSHIP_DETAIL = (id: string) => `/api/v1/internships/${id}`; // Staj detayı

// Topics endpoints
export const INTERNSHIP_TOPICS = `/api/v1/internships/topics`;
export const INTERNSHIP_TOPIC_DETAIL = (id: string | number) => `/api/v1/internships/topics/${id}`;
export const INTERNSHIP_TOPIC_CREATE = `/api/v1/internships/topics`;
export const INTERNSHIP_TOPIC_UPDATE = (id: string | number) => `/api/v1/internships/topics/${id}`;
export const INTERNSHIP_TOPIC_DELETE = (id: string | number) => `/api/v1/internships/topics/${id}`;
