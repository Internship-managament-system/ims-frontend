import React from 'react';
import { User } from './types';

interface ConfirmModalProps {
  type: 'chairman' | 'remove';
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ type, user, onConfirm, onCancel }) => {
  const getModalContent = () => {
    switch (type) {
      case 'chairman':
        return {
          title: 'Başkan Atama Onayı',
          message: `${user.name} komisyon başkanı olarak atanacak. Mevcut başkan görevden alınacaktır. Bu işlemi onaylıyor musunuz?`
        };
      case 'remove':
        return {
          title: 'Üye Çıkarma Onayı',
          message: `${user.name} komisyon üyeliğinden çıkarılacak. Bu işlemi onaylıyor musunuz?`
        };
      default:
        return { title: '', message: '' };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {content.title}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {content.message}
          </p>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <button 
            className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded"
            onClick={onCancel}
          >
            İptal
          </button>
          <button 
            className={`btn py-2 px-4 rounded text-white ${
              type === 'remove' ? 'bg-red-600' : 'bg-[#13126e]'
            }`}
            onClick={onConfirm}
          >
            Onayla
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;