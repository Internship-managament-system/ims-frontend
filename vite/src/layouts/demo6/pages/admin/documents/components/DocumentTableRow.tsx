// /pages/admin/documents/components/DocumentTableRow.tsx
import React from 'react';
import { Document } from '../types';
import { KeenIcon } from '@/components/keenicons';

interface DocumentTableRowProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (id: number) => void;
}

const DocumentTableRow: React.FC<DocumentTableRowProps> = ({
  document,
  onEdit,
  onDelete,
}) => (
  <tr className="border-b">
    <td className="py-3 px-4">{document.type}</td>
    <td className="py-3 px-4">{document.description}</td>
    <td className="py-3 px-4">
      <span className={`px-2 py-1 text-xs ${
        document.isRequired 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {document.isRequired ? 'Evet' : 'Hayır'}
      </span>
    </td>
    <td className="py-3 px-4">{document.fileFormats.join(', ')}</td>
    <td className="py-3 px-4 text-right">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEdit(document)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <KeenIcon icon="pencil" className="size-4" />
          <span className="text-sm">Düzenle</span>
        </button>
        <button
          onClick={() => onDelete(document.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <KeenIcon icon="trash" className="size-4" />
          <span className="text-sm">Sil</span>
        </button>
      </div>
    </td>
  </tr>
);

export default DocumentTableRow;
