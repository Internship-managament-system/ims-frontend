// /src/layouts/demo6/pages/admin/documents/components/DeleteConfirmModal.tsx
import React from 'react';

interface DeleteConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 w-full max-w-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Belgeyi Sil
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Bu belgeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors rounded"
        >
          İptal
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors rounded"
        >
          Sil
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;