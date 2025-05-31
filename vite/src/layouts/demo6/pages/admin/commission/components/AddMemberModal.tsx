import React, { useState, useEffect } from 'react';
import { NewCommissionMember } from '@/services/commissionService';
import { getAllSystemUsers, User } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';

interface AddMemberModalProps {
  onClose: () => void;
  onAdd: (user: NewCommissionMember) => void;
  isLoading: boolean;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose, onAdd, isLoading }) => {
  const [newMember, setNewMember] = useState<NewCommissionMember>({
    userId: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Kullanıcıları çekmek için query - yeni endpoint kullanılıyor
  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ['system-users'],
    queryFn: getAllSystemUsers
  });

  // Sadece STUDENT rolündeki kullanıcıları filtrele
  const studentUsers = users.filter(user => user.role === 'STUDENT');

  // Kullanıcı arama fonksiyonu
  const filteredUsers = studentUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = user.fullName || `${user.name || ''} ${user.surname || ''}`;
    
    return (
      fullName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.departmentName && user.departmentName.toLowerCase().includes(searchLower))
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newMember);
  };

  // Kullanıcı adı görüntüleme
  const getDisplayName = (user: User): string => {
    return user.fullName || `${user.name || ''} ${user.surname || ''}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Komisyon Üyesi Ekle
          </h3>
          <button 
            className="text-gray-500"
            onClick={onClose}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Kullanıcı Seçin</label>
            <div className="mb-3">
              <input 
                type="text" 
                placeholder="Kullanıcı ara..." 
                className="border border-gray-300 rounded-lg p-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading || isUsersLoading}
              />
            </div>
            
            {isUsersLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Kullanıcı bulunamadı
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                      <div 
                        key={user.id}
                        onClick={() => setNewMember({ userId: user.id })}
                        className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center ${
                          newMember.userId === user.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="w-6 h-6 mr-3">
                          <input 
                            type="radio" 
                            checked={newMember.userId === user.id}
                            onChange={() => setNewMember({ userId: user.id })}
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm font-medium">{getDisplayName(user)}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                          {user.departmentName && (
                            <div className="text-xs text-gray-500">{user.departmentName}</div>
                          )}
                        </div>
                        <div className="ml-2">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'STUDENT' 
                              ? 'bg-green-100 text-green-800' 
                              : user.role === 'TEACHER' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'STUDENT' ? 'Öğrenci' : 
                             user.role === 'TEACHER' ? 'Öğretmen' : 
                             user.role === 'ADMIN' ? 'Yönetici' : 
                             user.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button" 
              className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded"
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className={`btn ${isLoading ? 'bg-indigo-400' : 'bg-[#13126e]'} text-white py-2 px-4 rounded flex items-center justify-center`}
              disabled={isLoading || !newMember.userId}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kaydediliyor...
                </>
              ) : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;