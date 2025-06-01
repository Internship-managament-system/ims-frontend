import React from 'react';
import { CommissionMember } from '@/services/commissionService';

interface ConfirmModalProps {
  type: 'chairman' | 'remove' | 'removeChairman';
  user: CommissionMember;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ type, user, onConfirm, onCancel, isLoading }) => {
  // Görüntülenecek isim belirle
  const getDisplayName = (user: CommissionMember): string => {
    return user.fullName || `${user.name || ''} ${user.surname || ''}`;
  };

  const getModalContent = () => {
    switch (type) {
      case 'chairman':
        return {
          title: 'Başkan Atama Onayı',
          message: `${getDisplayName(user)} komisyon başkanı olarak atanacak. Sistemde sadece bir komisyon başkanı olabilir, mevcut başkan varsa otomatik olarak görevden alınacaktır. İşlem tamamlandıktan sonra sistem sizi otomatik olarak çıkış yapacak ve tekrar giriş yapmanız gerekecektir. Bu işlemi onaylıyor musunuz?`
        };
      case 'removeChairman':
        return {
          title: 'Başkanlıktan Çıkarma Onayı',
          message: `${getDisplayName(user)} komisyon başkanlığından çıkarılacak ve normal komisyon üyesi olarak devam edecek. Sistemde başka bir komisyon başkanı olmadığı için bu işlem yapılabilir. Bu işlemi onaylıyor musunuz?`
        };
      case 'remove':
        return {
          title: 'Üye Çıkarma Onayı',
          message: `${getDisplayName(user)} komisyon üyeliğinden çıkarılacak. Bu işlemi onaylıyor musunuz?`
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
            disabled={isLoading}
          >
            İptal
          </button>
          <button 
            className={`btn py-2 px-4 rounded text-white ${
              type === 'remove' ? 'bg-red-600' : 'bg-[#13126e]'
            } ${isLoading ? 'opacity-70' : ''} flex items-center`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşleniyor...
              </>
            ) : 'Onayla'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;