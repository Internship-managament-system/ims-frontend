import React, { useState } from 'react';
import { Container } from '@/components';
import AddMemberModal from './components/AddMemberModal';
import ConfirmModal from './components/ConfirmModal';
import { User, NewUser } from '../commission/components/types';

const CommissionManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalType, setConfirmModalType] = useState<'chairman' | 'remove'>('chairman');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Örnek veri
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Prof. Dr. Ali Demir',
      title: 'Prof. Dr.',
      email: 'ali.demir@university.edu',
      role: 'COMMISSION_HEAD',
      status: 'active'
    },
    {
      id: 2,
      name: 'Dr. Mehmet Kaya',
      title: 'Dr.',
      email: 'mehmet.kaya@university.edu',
      role: 'COMMISSION_MEMBER',
      status: 'active'
    },
    // ... diğer üyeler
  ]);

  // Üye ekleme
  const handleAddMember = (newUserData: NewUser) => {
    const newUser: User = {
      id: users.length + 1,
      name: `${newUserData.title} ${newUserData.firstName} ${newUserData.lastName}`,
      title: newUserData.title,
      email: newUserData.email,
      role: 'COMMISSION_MEMBER',  // Yeni üye her zaman normal üye olarak eklenir
      status: 'active'
    };
    setUsers([...users, newUser]);
  };

  // Başkan atama işlemi
  const handleSetChairman = (user: User) => {
    setSelectedMember(user);
    setConfirmModalType('chairman');
    setShowConfirmModal(true);
  };

  // Üye çıkarma işlemi
  const handleRemoveMember = (user: User) => {
    setSelectedMember(user);
    setConfirmModalType('remove');
    setShowConfirmModal(true);
  };

  // İşlem onaylama
  const handleConfirm = () => {
    if (!selectedMember) return;
  
    if (confirmModalType === 'chairman') {
      setUsers(users.map(user => ({
        ...user,
        role: user.id === selectedMember.id ? 'COMMISSION_HEAD' : 'COMMISSION_MEMBER'
      })));
    } else if (confirmModalType === 'remove') {
      // Eğer başkan kaldırılıyorsa, önce başkanlığı kontrol et
      if (selectedMember.role === 'COMMISSION_HEAD') {
        alert('Başkanı kaldırmadan önce yeni bir başkan atamanız gerekmektedir.');
        return;
      }
      setUsers(users.filter(user => user.id !== selectedMember.id));
    }
  
    setShowConfirmModal(false);
    setSelectedMember(null);
  };

  // Arama filtresi
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Komisyon Üyeleri</h2>
            <button
              className="btn bg-green-600 text-white text-sm py-1 px-3 rounded"
              onClick={() => setShowAddModal(true)}
            >
              Komisyon Üyesi Ekle
            </button>
          </div>

          <div className="mb-4 flex justify-end">
            <div className="relative">
              <input
                type="text"
                placeholder="Üye ara..."
                className="border border-gray-300 rounded-lg p-2 pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${user.role === 'COMMISSION_HEAD'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-purple-100 text-purple-800'
                        }`}>
                        {user.role === 'COMMISSION_HEAD' ? 'Komisyon Başkanı' : 'Komisyon Üyesi'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {user.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-1">
                        {user.role !== 'COMMISSION_HEAD' && (
                          <button
                            className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded"
                            onClick={() => handleSetChairman(user)}
                          >
                            Başkan Yap
                          </button>
                        )}
                        <button
                          className="btn bg-red-500 text-white text-xs py-1 px-2 rounded"
                          onClick={() => handleRemoveMember(user)}
                        >
                          Kaldır
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modaller */}
        {showAddModal && (
          <AddMemberModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddMember}
          />
        )}

        {showConfirmModal && selectedMember && (
          <ConfirmModal
            type={confirmModalType}
            user={selectedMember}
            onConfirm={handleConfirm}
            onCancel={() => {
              setShowConfirmModal(false);
              setSelectedMember(null);
            }}
          />
        )}
      </div>
    </Container>
  );
};

export default CommissionManagement;