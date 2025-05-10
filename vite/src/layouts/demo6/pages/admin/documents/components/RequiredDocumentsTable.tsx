// /src/layouts/demo6/pages/admin/documents/components/RequiredDocumentsTable.tsx
import React from 'react';
import { Document } from '../types';
import { KeenIcon } from '@/components/keenicons';

interface RequiredDocumentsTableProps {
  documents: Document[];
  onDelete: (id: number) => void;
  onUpdate: (document: Document) => void;
}

const RequiredDocumentsTable: React.FC<RequiredDocumentsTableProps> = ({ 
  documents, 
  onDelete, 
  onUpdate 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Belge Tipi</th>
            <th className="text-left py-3 px-4">Açıklama</th>
            <th className="text-left py-3 px-4">Dosya Formatları</th>
            <th className="text-left py-3 px-4">Şablon</th>
            <th className="text-right py-3 px-4">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{doc.type}</td>
                <td className="py-3 px-4 text-gray-600">{doc.description}</td>
                <td className="py-3 px-4 text-gray-600">{doc.fileFormats.join(', ')}</td>
                <td className="py-3 px-4">
                  {doc.templateUrl ? (
                    <a 
                      href={doc.templateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <KeenIcon icon="download" className="mr-1" />
                      <span className="text-sm">İndir</span>
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onUpdate(doc)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <KeenIcon icon="pencil" className="size-4" />
                      <span className="text-sm">Düzenle</span>
                    </button>
                    <button
                      onClick={() => onDelete(doc.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded"
                    >
                      <KeenIcon icon="trash" className="size-4" />
                      <span className="text-sm">Sil</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">
                Listelenecek belge bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequiredDocumentsTable;