import axiosClient from '@/api/axiosClient';
import {
  INTERNSHIP_FORM_OPTIONS_PROVINCES
} from '@/api/endpoints';

// Genel seçenek tipini tanımlama
export interface SelectOption {
  value: string;
  label: string;
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
