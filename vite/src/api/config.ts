// src/api/config.ts
const API_URL = import.meta.env.VITE_APP_API_URL || '/api/v1';

export const endpoints = {
  admin: {
    // Commission endpoints
    commission: {
      list: `${API_URL}/admin/commission/members`,
      add: `${API_URL}/admin/commission/members`,
      update: (id: string) => `${API_URL}/admin/commission/members/${id}`,
      delete: (id: string) => `${API_URL}/admin/commission/members/${id}`,
      setChairman: (id: string) => `${API_URL}/admin/commission/members/${id}/chairman`,
    },
    
    // Application endpoints
    applications: {
      list: `${API_URL}/admin/applications`,
      pending: `${API_URL}/admin/applications/pending`,
      assign: `${API_URL}/admin/applications/assign`,
      statistics: `${API_URL}/admin/statistics/applications`,
    },
    
    // Document endpoints
    documents: {
      required: `${API_URL}/admin/documents/required`,
      add: `${API_URL}/admin/documents/required`,
      update: (id: string) => `${API_URL}/admin/documents/required/${id}`,
      delete: (id: string) => `${API_URL}/admin/documents/required/${id}`,
      student: `${API_URL}/admin/documents/student`,
    },
    
    // Settings endpoints
    settings: {
      internship: `${API_URL}/admin/settings/internship`,
      applicationPeriod: `${API_URL}/admin/settings/application-period`,
      notebookDates: `${API_URL}/admin/settings/notebook-dates`,
      rejectionReasons: `${API_URL}/admin/settings/rejection-reasons`,
    },
    
    // Statistics endpoints
    statistics: {
      dashboard: `${API_URL}/admin/statistics/dashboard`,
      internships: `${API_URL}/admin/statistics/internships`,
    },
  },
};