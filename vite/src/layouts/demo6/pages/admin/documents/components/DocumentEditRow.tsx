// /pages/admin/documents/components/DocumentEditRow.tsx
import React from 'react';
import { Document } from '../types';
import { KeenIcon } from '@/components/keenicons';

interface DocumentEditRowProps {
  editForm: Document;
  onSave: (document: Document) => void;
  onCancel: () => void;
  onChange: (document: Document) => void;
}

const DocumentEditRow: React.FC<DocumentEditRowProps> = ({
  editForm,
  onSave,
  onCancel,
  onChange,
}) => (
  <tr className="border-b">
    <td className="py-3 px-4">
      <input
        type="text"
        value={editForm.type}
        onChange={e => onChange({ ...editForm, type: e.target.value })}
        className="border p-2 w-full outline-none focus:border-[#13126e]"
        placeholder="Belge Tipi"
      />
    </td>
    <td className="py-3 px-4">
      <input
        type="text"
        value={editForm.description}
        onChange={e => onChange({ ...editForm, description: e.target.value })}
        className="border p-2 w-full outline-none focus:border-[#13126e]"
        placeholder="Açıklama"
      />
    </td>
    <td className="py-3 px-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={editForm.isRequired}
          onChange={e => onChange({ ...editForm, isRequired: e.target.checked })}
          className="mr-2 w-4 h-4"
        />
        <span className="text-sm text-gray-600">Zorunlu</span>
      </label>
    </td>
    <td className="py-3 px-4">
      <input
        type="text"
        value={editForm.fileFormats.join(', ')}
        onChange={e => onChange({ 
          ...editForm, 
          fileFormats: e.target.value.split(',').map(f => f.trim()) 
        })}
        className="border p-2 w-full outline-none focus:border-[#13126e]"
        placeholder=".pdf, .doc, .docx"
      />
    </td>
    <td className="py-3 px-4 text-right">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onSave(editForm)}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#13126e] text-white hover:bg-[#1f1e7e] transition-colors"
        >
          <KeenIcon icon="check" className="size-4" />
          <span className="text-sm">Kaydet</span>
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <KeenIcon icon="cross" className="size-4" />
          <span className="text-sm">İptal</span>
        </button>
      </div>
    </td>
  </tr>
);

export default DocumentEditRow;