import axiosClient from '@/api/axiosClient';
import {
  INTERNSHIP_FORM_OPTIONS_ALL,
  INTERNSHIP_FORM_OPTIONS_PROVINCES,
  INTERNSHIP_FORM_OPTIONS_PROGRAM_TYPES,
  INTERNSHIP_FORM_OPTIONS_INTERNSHIP_TYPES,
  INTERNSHIP_FORM_OPTIONS_INTERNSHIP_PERIODS,
  INTERNSHIP_FORM_OPTIONS_WEEKLY_WORKING_DAYS
} from '@/api/endpoints';

// Genel seçenek tipini tanımlama
export interface SelectOption {
  value: string;
  label: string;
  days?: string; // Haftalık çalışma günü seçenekleri için
}

// İl/Ülke seçenekleri
export const getProvinces = async (): Promise<SelectOption[]> => {
  try {
    const response = await axiosClient.get<SelectOption[]>(INTERNSHIP_FORM_OPTIONS_PROVINCES);
    return response;
  } catch (error) {
    console.error('İl/Ülke listesi alınırken hata:', error);
    throw error;
  }
};

// Program tipleri
export const getProgramTypes = async (): Promise<SelectOption[]> => {
  try {
    const response = await axiosClient.get<SelectOption[]>(INTERNSHIP_FORM_OPTIONS_PROGRAM_TYPES);
    return response;
  } catch (error) {
    console.error('Program tipleri alınırken hata:', error);
    throw error;
  }
};

// Staj tipleri
export const getInternshipTypes = async (): Promise<SelectOption[]> => {
  try {
    const response = await axiosClient.get<SelectOption[]>(INTERNSHIP_FORM_OPTIONS_INTERNSHIP_TYPES);
    return response;
  } catch (error) {
    console.error('Staj tipleri alınırken hata:', error);
    throw error;
  }
};

// Staj dönemleri
export const getInternshipPeriods = async (): Promise<SelectOption[]> => {
  try {
    const response = await axiosClient.get<SelectOption[]>(INTERNSHIP_FORM_OPTIONS_INTERNSHIP_PERIODS);
    return response;
  } catch (error) {
    console.error('Staj dönemleri alınırken hata:', error);
    throw error;
  }
};

// Haftalık çalışma günleri
export const getWeeklyWorkingDays = async (): Promise<SelectOption[]> => {
  try {
    const response = await axiosClient.get<SelectOption[]>(INTERNSHIP_FORM_OPTIONS_WEEKLY_WORKING_DAYS);
    return response;
  } catch (error) {
    console.error('Haftalık çalışma günleri alınırken hata:', error);
    throw error;
  }
};

// Tüm form seçeneklerini tek seferde al
export const getAllFormOptions = async (): Promise<{
  provinces: SelectOption[];
  programTypes: SelectOption[];
  internshipTypes: SelectOption[];
  internshipPeriods: SelectOption[];
  weeklyWorkingDays: SelectOption[];
}> => {
  try {
    const response = await axiosClient.get<any>(INTERNSHIP_FORM_OPTIONS_ALL);
    return {
      provinces: response.provinces || [],
      programTypes: response.programTypes || [],
      internshipTypes: response.internshipTypes || [],
      internshipPeriods: response.internshipPeriods || [],
      weeklyWorkingDays: response.weeklyWorkingDays || []
    };
  } catch (error) {
    console.error('Form seçenekleri alınırken hata:', error);
    throw error;
  }
}; 