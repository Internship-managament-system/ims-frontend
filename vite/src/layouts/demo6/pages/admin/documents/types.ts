// /pages/admin/documents/types.ts
export interface Document {
    id: number;
    type: string;
    isRequired: boolean;
    description: string;
    fileFormats: string[]; // Kabul edilen dosya formatları
  }
  
  export interface StudentDocument {
    id: number;
    studentName: string;
    documentType: string;
    uploadDate: string;
    status: 'pending' | 'approved' | 'rejected';
    fileUrl: string;
  }