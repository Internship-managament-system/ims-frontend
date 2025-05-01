// /layouts/demo6/pages/admin/Dashboard/tabs/UserManagement.tsx
import React, { useState } from 'react';

const UserManagement: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('commission');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'commission' | 'student'>('commission');
  
  // Kullanıcı listesi
  const users = [
    {
      id: 1,
      name: 'Prof. Dr. Ali Demir',
      email: 'ali.demir@university.edu',
      role: 'COMMISSION_MEMBER',
      status: 'active'
    },
    {
      id: 2,
      name: 'Dr. Mehmet Kaya',
      email: 'mehmet.kaya@university.edu',
      role: 'COMMISSION_MEMBER',
      status: 'active'
    },
    {
      id: 3,
      name: 'Prof. Dr. Ayşe Yıldız',
      email: 'ayse.yildiz@university.edu',
      role: 'COMMISSION_MEMBER',
      status: 'active'
    },
    {
      id: 4,
      name: 'Ahmet Yılmaz',
      email: '20190101023@student.university.edu',
      role: 'STUDENT',
      status: 'active'
    },
    {
      id: 5,
      name: 'Ayşe Demir',
      email: '20190101045@student.university.edu',
      role: 'STUDENT',
      status: 'active'
    },
    {
      id: 6,
      name: 'Mehmet Öz',
      email: '20190101067@student.university.edu',
      role: 'STUDENT',
      status: 'active'
    },
    {
      id: 7,
      name: 'Ali Can',
      email: '20180101012@student.university.edu',
      role: 'STUDENT',
      status: 'graduate'
    },
    {
      id: 8,
      name: 'Zeynep Kaya',
      email: '20180101034@student.university.edu',
      role: 'STUDENT',
      status: 'graduate'
    }
  ];
  
  // Aktif filtreye göre kullanıcıları filtrele
  const filteredUsers = users.filter(user => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'commission') return user.role === 'COMMISSION_MEMBER';
    if (activeFilter === 'students') return user.role === 'STUDENT' && user.status === 'active';
    if (activeFilter === 'graduates') return user.role === 'STUDENT' && user.status === 'graduate';
    return true;
  });
  
  // Kullanıcı ekleme modalını aç
  const handleAddUser = (type: 'commission' | 'student') => {
    setModalType(type);
    setShowAddModal(true);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Kullanıcı Yönetimi</h2>
        <div className="flex space-x-2">
          <button 
            className="btn bg-green-600 text-white text-sm py-1 px-3 rounded"
            onClick={() => handleAddUser('commission')}
          >
            Komisyon Üyesi Ekle
          </button>
          <button 
            className="btn bg-blue-600 text-white text-sm py-1 px-3 rounded"
            onClick={() => handleAddUser('student')}
          >
            Öğrenci Ekle
          </button>
        </div>
      </div>
      
      <div className="mb-4 flex justify-between">
        <div className="flex space-x-2">
          <button 
            className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'all' ? 'bg-[#13126e] text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveFilter('all')}
          >
            Tümü
          </button>
          <button 
            className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'commission' ? 'bg-[#13126e] text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveFilter('commission')}
          >
            Komisyon Üyeleri
          </button>
          <button 
            className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'students' ? 'bg-[#13126e] text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveFilter('students')}
          >
            Öğrenciler
          </button>
          <button 
            className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'graduates' ? 'bg-[#13126e] text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveFilter('graduates')}
          >
            Mezunlar
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            className="border border-gray-300 rounded-lg p-2 pl-8 w-64"
          />
          <svg
            className="absolute left-2 top-2.5 h-4 w-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-sm font-medium text-gray-500">ID</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Ad Soyad</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">E-posta</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Rol</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">{user.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'COMMISSION_MEMBER' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'COMMISSION_MEMBER' ? 'Komisyon Üyesi' : 'Öğrenci'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status === 'active' ? 'Aktif' : 'Mezun'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-1">
                    <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                      Düzenle
                    </button>
                    <button className="btn bg-red-500 text-white text-xs py-1 px-2 rounded">
                      Kaldır
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Kullanıcı Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === 'commission' ? 'Komisyon Üyesi Ekle' : 'Öğrenci Ekle'}
              </h3>
              <button 
                className="text-gray-500"
                onClick={() => setShowAddModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ad</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-lg p-2 w-full" 
                  placeholder="Ad"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Soyad</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-lg p-2 w-full" 
                  placeholder="Soyad"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">E-posta</label>
                <input 
                  type="email" 
                  className="border border-gray-300 rounded-lg p-2 w-full" 
                  placeholder="E-posta"
                />
              </div>
              
              {modalType === 'student' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Öğrenci Numarası</label>
                  <input 
                    type="text" 
                    className="border border-gray-300 rounded-lg p-2 w-full" 
                    placeholder="Öğrenci Numarası"
                  />
                </div>
              )}
              
              {modalType === 'commission' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Unvan</label>
                  <select className="border border-gray-300 rounded-lg p-2 w-full">
                    <option value="">Seçiniz</option>
                    <option value="Prof. Dr.">Prof. Dr.</option>
                    <option value="Doç. Dr.">Doç. Dr.</option>
                    <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
                    <option value="Arş. Gör. Dr.">Arş. Gör. Dr.</option>
                    <option value="Arş. Gör.">Arş. Gör.</option>
                  </select>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <button 
                  type="button" 
                  className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded"
                  onClick={() => setShowAddModal(false)}
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
      )}
    </div>
  );
};

export default UserManagement;