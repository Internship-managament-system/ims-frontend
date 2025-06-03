import axiosClient from '@/api/axiosClient';
import { 
  INTERNSHIP_TOPICS,
  INTERNSHIP_TOPIC_DETAIL,
  INTERNSHIP_TOPIC_CREATE,
  INTERNSHIP_TOPIC_UPDATE,
  INTERNSHIP_TOPIC_DELETE
} from '@/api/endpoints';

// Topic interface
export interface InternshipTopic {
  id?: string;
  title: string;
  description: string;
  createdDate: string;
}

// Yeni topic oluşturma için interface
export interface NewInternshipTopic {
  title: string;
  description: string;
}

// Topic güncelleme için interface
export interface UpdateInternshipTopic {
  id: string;
  title: string;
  description: string;
}

// Tüm konuları getir
export const getInternshipTopics = async (): Promise<InternshipTopic[]> => {
  try {
    const response = await axiosClient.get<InternshipTopic[]>(INTERNSHIP_TOPICS);
    return response;
  } catch (error) {
    console.error('Staj konuları getirme hatası:', error);
    throw error;
  }
};

// Belirli bir konuyu getir
export const getInternshipTopicById = async (id: number | string): Promise<InternshipTopic> => {
  try {
    const response = await axiosClient.get<InternshipTopic>(INTERNSHIP_TOPIC_DETAIL(id));
    return response;
  } catch (error) {
    console.error('Staj konusu detayı getirme hatası:', error);
    throw error;
  }
};

// Yeni konu oluştur
export const createInternshipTopic = async (data: NewInternshipTopic): Promise<InternshipTopic> => {
  try {
    const response = await axiosClient.post<InternshipTopic>(INTERNSHIP_TOPIC_CREATE, data);
    return response;
  } catch (error) {
    console.error('Staj konusu oluşturma hatası:', error);
    throw error;
  }
};

// Konuyu güncelle
export const updateInternshipTopic = async (id: number | string, data: UpdateInternshipTopic): Promise<InternshipTopic> => {
  try {
    const response = await axiosClient.put<InternshipTopic>(INTERNSHIP_TOPIC_UPDATE(id), data);
    return response;
  } catch (error) {
    console.error('Staj konusu güncelleme hatası:', error);
    throw error;
  }
};

// Konuyu sil
export const deleteInternshipTopic = async (id: number | string): Promise<void> => {
  try {
    await axiosClient.delete(INTERNSHIP_TOPIC_DELETE(id));
  } catch (error) {
    console.error('Staj konusu silme hatası:', error);
    throw error;
  }
}; 