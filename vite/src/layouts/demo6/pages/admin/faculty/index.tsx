import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import axios from 'axios';
import { getAuth } from '@/auth';

interface Faculty {
  id: string;
  name: string;
  code: string;
  address?: string;
  departments?: {
    name: string;
    code: string;
  }[];
  createdAt?: string;
}

const FacultyManagement: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState<Faculty | null>(null);
  const [newFaculty, setNewFaculty] = useState<Partial<Faculty>>({ name: '', code: '', address: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fakülteleri getir
  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/v1/faculties', {
        headers: {
          'Authorization': `Bearer ${getAuth()?.access_token}`
        }
      });
      
      if (response.data && response.data.result) {
        setFaculties(response.data.result);
      }
    } catch (err: any) {
      console.error('Fakülte verilerini getirme hatası:', err);
      setError('Fakülte verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Fakülte ekleme işlemi
  const handleAddFaculty = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/v1/faculties', newFaculty, {
        headers: {
          'Authorization': `Bearer ${getAuth()?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Backend void döndürüyor, başarılıysa buraya gelir
      await fetchFaculties();
      setNewFaculty({ name: '', code: '', address: '' });
      setShowAddModal(false);
    } catch (err: any) {
      console.error('Fakülte ekleme hatası:', err);
      setError('Fakülte eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Fakülte düzenleme işlemi
  const handleEditFaculty = async () => {
    if (!currentFaculty) return;
    
    setLoading(true);
    setError(null);
    try {
      // Sadece gerekli alanları gönder
      const updateData = {
        name: currentFaculty.name,
        code: currentFaculty.code,
        address: currentFaculty.address || ''
      };

      await axios.put(`/api/v1/faculties/${currentFaculty.id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${getAuth()?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Backend void döndürüyor, başarılıysa buraya gelir
      await fetchFaculties();
      setShowEditModal(false);
      setCurrentFaculty(null);
    } catch (err: any) {
      console.error('Fakülte güncelleme hatası:', err);
      setError('Fakülte güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Fakülte silme işlemi
  const handleDeleteFaculty = async () => {
    if (!currentFaculty) return;
    
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/v1/faculties/${currentFaculty.id}`, {
        headers: {
          'Authorization': `Bearer ${getAuth()?.access_token}`
        }
      });
      
      // Backend void döndürüyor, başarılıysa buraya gelir
      await fetchFaculties();
      setShowDeleteModal(false);
      setCurrentFaculty(null);
    } catch (err: any) {
      console.error('Fakülte silme hatası:', err);
      setError('Fakülte silinirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Arama işlemi
  const filteredFaculties = faculties.filter(faculty => 
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fakülte Yönetimi</h1>
            <p className="text-gray-600 mt-1">Fakülteleri ekle, düzenle ve yönet</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            <KeenIcon icon="plus" className="text-white" />
            <span>Yeni Fakülte</span>
          </button>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <KeenIcon icon="information" className="text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Arama */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ara</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fakülte adı veya kodu ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeenIcon icon="search" className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fakülte Listesi */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-600 rounded-full mb-2"></div>
              <p className="text-gray-600">Fakülteler yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fakülte Adı
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kod
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adres
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFaculties.map((faculty) => (
                    <tr key={faculty.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{faculty.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{faculty.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{faculty.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setCurrentFaculty(faculty);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Düzenle
                          </button>
                          <button 
                            onClick={() => {
                              setCurrentFaculty(faculty);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredFaculties.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        {faculties.length === 0 ? 'Henüz fakülte bulunmuyor' : 'Arama kriterlerine uygun fakülte bulunamadı'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Yeni Fakülte Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Fakülte Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fakülte Adı</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fakülte adını girin"
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fakülte Kodu</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fakülte kodunu girin (ör: MF)"
                  value={newFaculty.code}
                  onChange={(e) => setNewFaculty({...newFaculty, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres (Opsiyonel)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fakülte adresini girin"
                  value={newFaculty.address || ''}
                  onChange={(e) => setNewFaculty({...newFaculty, address: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={handleAddFaculty}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
                disabled={loading || !newFaculty.name || !newFaculty.code}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                    Ekleniyor...
                  </>
                ) : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fakülte Düzenleme Modal */}
      {showEditModal && currentFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fakülte Düzenle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fakülte Adı</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fakülte adını girin"
                  value={currentFaculty.name}
                  onChange={(e) => setCurrentFaculty({...currentFaculty, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fakülte Kodu</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fakülte kodunu girin (ör: MF)"
                  value={currentFaculty.code}
                  onChange={(e) => setCurrentFaculty({...currentFaculty, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres (Opsiyonel)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fakülte adresini girin"
                  value={currentFaculty.address || ''}
                  onChange={(e) => setCurrentFaculty({...currentFaculty, address: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={handleEditFaculty}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
                disabled={loading || !currentFaculty.name || !currentFaculty.code}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                    Güncelleniyor...
                  </>
                ) : 'Güncelle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fakülte Silme Modal */}
      {showDeleteModal && currentFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fakülte Sil</h3>
            <p className="text-gray-600">
              <strong>{currentFaculty.name}</strong> fakültesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={handleDeleteFaculty}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                    Siliniyor...
                  </>
                ) : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default FacultyManagement; 