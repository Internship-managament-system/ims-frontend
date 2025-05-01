// /pages/admin/documents/components/AddDocumentModal.tsx
import React, { useState } from 'react';
import { Document } from '../types';

interface Props {
  onClose: () => void;
  onAdd: (document: Omit<Document, 'id'>) => void;
}

const AddDocumentModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<Omit<Document, 'id'>>({
    type: '',
    isRequired: true,
    description: '',
    fileFormats: ['.pdf']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  const handleFileFormatsChange = (value: string) => {
    setFormData({
      ...formData,
      fileFormats: value.split(',').map(format => format.trim())
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Yeni Belge Ekle
          </h3>
          <button 
            className="text-gray-500"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Belge Tipi
            </label>
            <input
              type="text"
              className="border p-2 w-full"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Açıklama
            </label>
            <textarea
              className="border p-2 w-full"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Dosya Formatları (virgülle ayırın)
            </label>
            <input
              type="text"
              className="border p-2 w-full"
              value={formData.fileFormats.join(', ')}
              onChange={e => handleFileFormatsChange(e.target.value)}
              placeholder=".pdf, .doc, .docx"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRequired"
              checked={formData.isRequired}
              onChange={e => setFormData({ ...formData, isRequired: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isRequired" className="text-sm text-gray-600">
              Zorunlu belge
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2"
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-[#13126e] text-white px-4 py-2"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentModal;