import React, { useState } from 'react';
import { NewUser } from './types';

interface AddMemberModalProps {
  onClose: () => void;
  onAdd: (user: NewUser) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose, onAdd }) => {
  const [newUser, setNewUser] = useState<NewUser>({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Komisyon Üyesi Ekle
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
            <label className="block text-sm text-gray-600 mb-1">Ad</label>
            <input 
              type="text" 
              className="border border-gray-300 rounded-lg p-2 w-full" 
              placeholder="Ad"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Soyad</label>
            <input 
              type="text" 
              className="border border-gray-300 rounded-lg p-2 w-full" 
              placeholder="Soyad"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">E-posta</label>
            <input 
              type="email" 
              className="border border-gray-300 rounded-lg p-2 w-full" 
              placeholder="E-posta"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Unvan</label>
            <select 
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={newUser.title}
              onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
              required
            >
              <option value="">Seçiniz</option>
              <option value="Prof. Dr.">Prof. Dr.</option>
              <option value="Doç. Dr.">Doç. Dr.</option>
              <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
              <option value="Arş. Gör. Dr.">Arş. Gör. Dr.</option>
              <option value="Arş. Gör.">Arş. Gör.</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button" 
              className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded"
              onClick={onClose}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="btn bg-[#13126e] text-white py-2 px-4 rounded"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;