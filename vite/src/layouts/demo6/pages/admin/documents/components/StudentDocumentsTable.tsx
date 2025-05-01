// /pages/admin/documents/components/StudentDocumentsTable.tsx
import React from 'react';
import { StudentDocument } from '../types';

interface Props {
  documents: StudentDocument[];
  activeTab: 'active' | 'graduate';
}

const StudentDocumentsTable: React.FC<Props> = ({ documents, activeTab }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4">Öğrenci Adı</th>
          <th className="text-left py-3 px-4">Belge Tipi</th>
          <th className="text-left py-3 px-4">Yükleme Tarihi</th>
          <th className="text-right py-3 px-4">İşlem</th>
        </tr>
      </thead>
      <tbody>
        {documents.map(doc => (
          <tr key={doc.id} className="border-b">
            <td className="py-3 px-4">{doc.studentName}</td>
            <td className="py-3 px-4">{doc.documentType}</td>
            <td className="py-3 px-4">{doc.uploadDate}</td>
            <td className="py-3 px-4 text-right">
              <button 
                className="bg-blue-500 text-white px-3 py-1 text-sm"
                onClick={() => window.open(doc.fileUrl, '_blank')}
              >
                Görüntüle
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentDocumentsTable;