// /src/layouts/demo6/pages/admin/documents/types.ts
export interface Document {
  id: number;
  type: string;
  description: string;
  fileFormats: string[]; // Kabul edilen dosya formatları
  templateUrl?: string;   // Şablon dosyası URL'si (varsa)
  fileName?: string;     // Şablon dosyası adı (varsa)
}

export interface StudentDocument {
  id: number;
  studentName: string;
  documentType: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
}