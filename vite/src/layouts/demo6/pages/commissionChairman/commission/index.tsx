import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@/components';
import AddMemberModal from './components/AddMemberModal';
import ConfirmModal from './components/ConfirmModal';
import { 
  getAllCommissionMembers, 
  createCommissionMember, 
  deleteCommissionMember, 
  makeChairman,
  removeChairman,
  CommissionMember,
  NewCommissionMember,
  getDepartmentById
} from '@/services/commissionService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '@/auth/useAuthContext';
import axios from 'axios';

// User info endpoint
const GET_USER_URL = `/api/v1/users/info`;

const CommissionManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalType, setConfirmModalType] = useState<'chairman' | 'remove' | 'removeChairman'>('chairman');
  const [selectedMember, setSelectedMember] = useState<CommissionMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentInfo, setDepartmentInfo] = useState({
    id: '',
    name: ''
  });
  const [chairman, setChairman] = useState<CommissionMember | null>(null);
  
  const queryClient = useQueryClient();
  const { currentUser, logout } = useAuthContext();
  
  // Komisyon rolünü belirle - Bu fonksiyonu useEffect'ten önce tanımlayalım
  const getCommissionRole = useCallback((user: CommissionMember): string => {
    // Role değeri boş veya undefined kontrolü
    if (!user.role) {
      console.error('Role değeri bulunamadı:', user);
      return 'Komisyon Üyesi';
    }
    
    // API'den gelen role değerine göre kontrol et - büyük/küçük harf duyarsız
    const roleUpper = typeof user.role === 'string' ? user.role.toUpperCase() : '';
    
    if (roleUpper === 'COMMISSION_CHAIRMAN' || 
        roleUpper.includes('CHAIRMAN')) {
      return 'Komisyon Başkanı';
    }
    
    // Varsayılan olarak komisyon üyesi
    return 'Komisyon Üyesi';
  }, []);
  
  // Kullanıcı ve departman bilgilerini yükle
  useEffect(() => {
    const fetchUserAndDepartmentInfo = async () => {
      if (!currentUser) return;
      
      try {
        // Güncel kullanıcı bilgilerini al
        const userResponse = await axios.get(GET_USER_URL);
        const userData = userResponse.data.result;
        
        // Departman ID'si varsa, departman bilgisini al
        if (userData?.departmentId) {
          try {
            const departmentData = await getDepartmentById(userData.departmentId as number);
            setDepartmentInfo({
              id: departmentData.id.toString(),
              name: departmentData.name
            });
          } catch (deptError) {
            console.error('Departman bilgisi alınamadı:', deptError);
          }
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error);
      }
    };
    
    fetchUserAndDepartmentInfo();
  }, [currentUser]);

  // API'den komisyon üyelerini çekme
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['commission-members'],
    queryFn: getAllCommissionMembers
  });
  
  // API yanıtını kontrol et
  useEffect(() => {
    if (users.length > 0) {
      const chairmanUser = users.find(user => getCommissionRole(user) === 'Komisyon Başkanı');
      setChairman(chairmanUser || null);
    }
  }, [users, getCommissionRole]);

  // Komisyon üyesi ekleme mutation
  const addMemberMutation = useMutation({
    mutationFn: (newUserData: NewCommissionMember) => createCommissionMember(newUserData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-members'] });
      setShowAddModal(false);
      toast.success('Komisyon üyesi başarıyla eklendi');
    },
    onError: (err) => {
      toast.error('Komisyon üyesi eklenirken bir hata oluştu');
      console.error('Komisyon üyesi ekleme hatası:', err);
    }
  });

  // Komisyon üyesi silme mutation
  const removeMemberMutation = useMutation({
    mutationFn: (id: number | string) => deleteCommissionMember(id as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-members'] });
      setShowConfirmModal(false);
      setSelectedMember(null);
      toast.success('Komisyon üyesi başarıyla silindi');
    },
    onError: (err) => {
      toast.error('Komisyon üyesi silinirken bir hata oluştu');
      console.error('Komisyon üyesi silme hatası:', err);
    }
  });

  // Başkan atama mutation
  const makeChairmanMutation = useMutation({
    mutationFn: (id: number | string) => makeChairman(id as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-members'] });
      setShowConfirmModal(false);
      setSelectedMember(null);
      toast.success('Komisyon başkanı başarıyla atandı, lütfen tekrar giriş yapın');
      
      // Sistemden çıkış yap ve login sayfasına yönlendir
      setTimeout(() => {
        logout();
      }, 2000); // 2 saniye bekleyip çıkış yap
    },
    onError: (err) => {
      toast.error('Komisyon başkanı atanırken bir hata oluştu');
      console.error('Komisyon başkanı atama hatası:', err);
    }
  });

  // Başkanlıktan çıkarma mutation
  const removeChairmanMutation = useMutation({
    mutationFn: (id: number | string) => removeChairman(id as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-members'] });
      setShowConfirmModal(false);
      setSelectedMember(null);
      toast.success('Komisyon başkanlığı görevi başarıyla kaldırıldı');
    },
    onError: (err) => {
      toast.error('Komisyon başkanlığı görevi kaldırılırken bir hata oluştu');
      console.error('Komisyon başkanlığından çıkarma hatası:', err);
    }
  });

  // Üye ekleme
  const handleAddMember = (newUserData: NewCommissionMember) => {
    // Email, ad ve soyad kontrolü
    if (!newUserData.email || !newUserData.name || !newUserData.surname) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    // Kullanıcının departmanId'sini ekle
    const updatedUserData = {
      ...newUserData,
      departmentId: departmentInfo.id || currentUser?.departmentId
    };

    // Departman ID kontrolü
    if (!updatedUserData.departmentId) {
      toast.error('Departman bilgisi bulunamadı. Lütfen yönetici ile iletişime geçin.');
      return;
    }

    addMemberMutation.mutate(updatedUserData);
  };

  // Başkan atama işlemi
  const handleSetChairman = (user: CommissionMember) => {
    // Zaten başkan olan kullanıcı seçilirse işlem yapma
    if (!user.role) {
      toast.error('Kullanıcı rol bilgisi bulunamadı.');
      return;
    }
    
    const roleUpper = user.role.toUpperCase();
    if (roleUpper === 'ADMIN' || roleUpper === 'COMMISSION_CHAIRMAN' || roleUpper.includes('CHAIRMAN')) {
      toast.error('Bu kullanıcı zaten komisyon başkanı.');
      return;
    }
    
    // Mevcut başkanı kontrol et
    const currentChairman = users.find(u => {
      if (!u.role) return false;
      const uRoleUpper = u.role.toUpperCase();
      return uRoleUpper === 'COMMISSION_CHAIRMAN' || (uRoleUpper !== 'ADMIN' && uRoleUpper.includes('CHAIRMAN'));
    });
    
    setSelectedMember(user);
    setConfirmModalType('chairman');
    setShowConfirmModal(true);
  };

  // Başkanlıktan çıkarma işlemi
  const handleRemoveChairman = (user: CommissionMember) => {
    if (!user.role) {
      toast.error('Kullanıcı rol bilgisi bulunamadı.');
      return;
    }
    
    const roleUpper = user.role.toUpperCase();
    if (roleUpper !== 'COMMISSION_CHAIRMAN' && !roleUpper.includes('CHAIRMAN')) {
      toast.error('Bu kullanıcı zaten komisyon başkanı değil.');
      return;
    }
    
    // Sistemde kaç başkan var kontrol et
    const chairmenCount = users.filter(u => {
      if (!u.role) return false;
      const uRoleUpper = u.role.toUpperCase();
      return uRoleUpper === 'COMMISSION_CHAIRMAN' || uRoleUpper.includes('CHAIRMAN');
    }).length;
    
    // Eğer sadece bir başkan varsa ve başkanlıktan çıkarılmak isteniyorsa uyarı ver
    if (chairmenCount <= 1) {
      toast.error('Sistemde en az bir komisyon başkanı olmalıdır. Başkanlıktan çıkarmadan önce yeni bir başkan atayın.');
      return;
    }
    
    setSelectedMember(user);
    setConfirmModalType('removeChairman');
    setShowConfirmModal(true);
  };

  // Üye çıkarma işlemi
  const handleRemoveMember = (user: CommissionMember) => {
    if (!user.role) {
      toast.error('Kullanıcı rol bilgisi bulunamadı.');
      return;
    }
    
    const roleUpper = user.role.toUpperCase();
    
    // Komisyon başkanı rolündeki kullanıcıları kaldırmayı engelle
    if (roleUpper === 'COMMISSION_CHAIRMAN' || roleUpper.includes('CHAIRMAN')) {
      toast.error('Komisyon başkanı rolündeki kullanıcılar komisyondan çıkarılamaz.');
      return;
    }
    
    setSelectedMember(user);
    setConfirmModalType('remove');
    setShowConfirmModal(true);
  };

  // İşlem onaylama
  const handleConfirm = () => {
    if (!selectedMember) return;
  
    if (confirmModalType === 'chairman') {
      makeChairmanMutation.mutate(selectedMember.id);
    } else if (confirmModalType === 'removeChairman') {
      removeChairmanMutation.mutate(selectedMember.id);
    } else if (confirmModalType === 'remove') {
      // API, silme işlemi için doğrudan endpoint çağrısı yapıyor
      // Bu işlem kullanıcının rolünü otomatik olarak STUDENT yapıyor
      removeMemberMutation.mutate(selectedMember.id);
    }
  };

  // Görüntülenecek isim belirle
  const getDisplayName = (user: CommissionMember): string => {
    return user.fullName || `${user.name || ''} ${user.surname || ''}`;
  };

  // İşlem butonlarını göster/gizle - başkan yapma butonunu gösterip göstermeme
  const shouldShowChairmanButton = (user: CommissionMember): boolean => {
    // Sadece COMMISSION_MEMBER rolündeki üyeler için başkan yapma butonunu göster
    if (!user.role) return false;
    
    const roleUpper = user.role.toUpperCase();
    return roleUpper === 'COMMISSION_MEMBER' || 
           (roleUpper !== 'COMMISSION_CHAIRMAN' && !roleUpper.includes('CHAIRMAN'));
  };

  // Arama filtresi
  const filteredUsers = users.filter(user => {
    const displayName = getDisplayName(user).toLowerCase();
    const email = user.email.toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return displayName.includes(term) || email.includes(term);
  });

  // Komisyon başkanı rolünü kontrol et
  const isAdminUser = (user: CommissionMember): boolean => {
    if (!user.role) return false;
    const roleUpper = user.role.toUpperCase();
    return roleUpper === 'COMMISSION_CHAIRMAN' || roleUpper.includes('CHAIRMAN');
  };

  if (error) {
    return (
      <Container className="min-h-screen bg-white">
        <div className="pt-8 px-6">
          <div className="p-6">
            <p className="text-red-500">Komisyon üyeleri yüklenirken bir hata oluştu.</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-white">
      <div className="pt-8 px-6">
        <div className="p-6 mb-6">
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
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Üye ara..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-10 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Ad Soyad</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">E-posta</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Rol</th>
                    
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700">{getDisplayName(user)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          getCommissionRole(user) === 'Komisyon Başkanı' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-purple-100 text-purple-800'
                        }`}>
                          {getCommissionRole(user)}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-1">
                          {shouldShowChairmanButton(user) && (
                            <button
                              className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded"
                              onClick={() => handleSetChairman(user)}
                              disabled={makeChairmanMutation.isPending}
                            >
                              {makeChairmanMutation.isPending && selectedMember?.id === user.id 
                                ? 'İşleniyor...' 
                                : 'Başkan Yap'}
                            </button>
                          )}

                          {/* Komisyon başkanları için başkanlıktan çıkarma butonu */}
                          {isAdminUser(user) && user.id !== currentUser?.id && (
                            <button
                              className="btn bg-amber-500 text-white text-xs py-1 px-2 rounded"
                              onClick={() => handleRemoveChairman(user)}
                              disabled={removeChairmanMutation.isPending}
                            >
                              {removeChairmanMutation.isPending && selectedMember?.id === user.id 
                                ? 'İşleniyor...' 
                                : 'Başkanlıktan Çıkar'}
                            </button>
                          )}

                          {/* Komisyon üyeleri için kaldır butonu */}
                          {!isAdminUser(user) && (
                            <button
                              className="btn bg-red-500 text-white text-xs py-1 px-2 rounded"
                              onClick={() => handleRemoveMember(user)}
                              disabled={removeMemberMutation.isPending}
                            >
                              {removeMemberMutation.isPending && selectedMember?.id === user.id 
                                ? 'İşleniyor...' 
                                : 'Kaldır'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modaller */}
        {showAddModal && (
          <AddMemberModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddMember}
            isLoading={addMemberMutation.isPending}
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
            isLoading={
              confirmModalType === 'chairman' 
                ? makeChairmanMutation.isPending 
                : confirmModalType === 'removeChairman'
                ? removeChairmanMutation.isPending
                : removeMemberMutation.isPending
            }
          />
        )}
      </div>
    </Container>
  );
};

export default CommissionManagement;