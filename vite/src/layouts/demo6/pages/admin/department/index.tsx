import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import axios from 'axios';
import { getAuth } from '@/auth';

interface Faculty {
  id: string;
  name: string;
  code: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  createdAt?: string;
}

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({ name: '', code: '', facultyId: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fakülte ve departman verilerini getir
  useEffect(() => {
    Promise.all([fetchFaculties(), fetchDepartments()]);
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
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

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/departments', {
        headers: {
          'Authorization': `Bearer ${getAuth()?.access_token}`
        }
      });
      
      if (response.data && response.data.result) {
        setDepartments(response.data.result);
      }
    } catch (err: any) {
      console.error('Departman verilerini getirme hatası:', err);
      setError('Departman verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Departman ekleme işlemi
  const handleAddDepartment = async () => {
    if (!newDepartment.name || !newDepartment.code || !newDepartment.facultyId) {
      setError('Departman adı, kodu ve fakülte seçimi zorunludur.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/v1/departments', newDepartment, {
        headers: {
          'Authorization': `Bearer ${getAuth()?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        // Başarılı olursa departmanları tekrar getir
        await fetchDepartments();
        setNewDepartment({ name: '', code: '', facultyId: '' });
        setShowAddModal(false);
      }
    } catch (err: any) {
      console.error('Departman ekleme hatası:', err);
      setError('Departman eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Departman düzenleme işlemi - API endpoint olmadığı için şimdilik yorum satırı
  /*
  const handleEditDepartment = async () => {
    if (!currentDepartment) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/v1/departments/${currentDepartment.id}`, currentDepartment, {
        headers: {
          'Authorization': `Bearer ${getAuth()?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        await fetchDepartments();
        setShowEditModal(false);
        setCurrentDepartment(null);
      }
    } catch (err: any) {
      console.error('Departman güncelleme hatası:', err);
      setError('Departman güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  */

  // Departman silme işlemi - API endpoint olmadığı için şimdilik yorum satırı
  /*
  const handleDeleteDepartment = async () => {
    if (!currentDepartment) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/v1/departments/${currentDepartment.id}`, {
        headers: {
          'Authorization': `Bearer ${getAuth()?.access_token}`
        }
      });
      
      if (response.status === 200) {
        await fetchDepartments();
        setShowDeleteModal(false);
        setCurrentDepartment(null);
      }
    } catch (err: any) {
      console.error('Departman silme hatası:', err);
      setError('Departman silinirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  */

  // API endpoints olmadığı için geçici çözüm
  const handleEditDepartment = () => {
    if (!currentDepartment) return;
    
    const updatedDepartments = departments.map(department => 
      department.id === currentDepartment.id ? currentDepartment : department
    );
    
    setDepartments(updatedDepartments);
    setShowEditModal(false);
    setCurrentDepartment(null);
  };

  const handleDeleteDepartment = () => {
    if (!currentDepartment) return;
    
    const updatedDepartments = departments.filter(department => 
      department.id !== currentDepartment.id
    );
    
    setDepartments(updatedDepartments);
    setShowDeleteModal(false);
    setCurrentDepartment(null);
  };

  // Fakülteye göre ve arama terimine göre filtreleme
  const filteredDepartments = departments.filter(department => {
    const matchesFacultyFilter = selectedFacultyId ? department.facultyId === selectedFacultyId : true;
    const matchesSearchTerm = 
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFacultyFilter && matchesSearchTerm;
  });

  // Fakülte adını getir
  const getFacultyName = (facultyId: string): string => {
    const faculty = faculties.find(f => f.id === facultyId);
    return faculty ? faculty.name : 'Bilinmeyen Fakülte';
  };

  return (
    <Container>
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departman Yönetimi</h1>
            <p className="text-gray-600 mt-1">Departmanları ekle, düzenle ve yönet</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            <KeenIcon icon="plus" className="text-white" />
            <span>Yeni Departman</span>
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

        {/* Arama ve Filtreler */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ara</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Departman adı veya kodu ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeenIcon icon="search" className="text-gray-500" />
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fakülteye Göre Filtrele</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedFacultyId}
                onChange={(e) => setSelectedFacultyId(e.target.value)}
              >
                <option value="">Tüm Fakülteler</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Departman Listesi */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin h-8 w-8 border-t-2 border-b-2 border-green-600 rounded-full mb-2"></div>
              <p className="text-gray-600">Departmanlar yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departman Adı
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kod
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fakülte
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDepartments.map((department) => (
                    <tr key={department.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{department.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{department.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{getFacultyName(department.facultyId)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setCurrentDepartment(department);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Düzenle
                          </button>
                          <button 
                            onClick={() => {
                              setCurrentDepartment(department);
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
                  
                  {filteredDepartments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        {departments.length === 0 ? 'Henüz departman bulunmuyor' : 'Arama kriterlerine uygun departman bulunamadı'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Yeni Departman Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Departman Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departman Adı</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Departman adını girin"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departman Kodu</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Departman kodunu girin (ör: BM)"
                  value={newDepartment.code}
                  onChange={(e) => setNewDepartment({...newDepartment, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fakülte</label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newDepartment.facultyId}
                  onChange={(e) => setNewDepartment({...newDepartment, facultyId: e.target.value})}
                >
                  <option value="">Fakülte Seçin</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
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
                onClick={handleAddDepartment}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
                disabled={loading || !newDepartment.name || !newDepartment.code || !newDepartment.facultyId}
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

      {/* Departman Düzenleme Modal */}
      {showEditModal && currentDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Departman Düzenle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departman Adı</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Departman adını girin"
                  value={currentDepartment.name}
                  onChange={(e) => setCurrentDepartment({...currentDepartment, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departman Kodu</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Departman kodunu girin (ör: BM)"
                  value={currentDepartment.code}
                  onChange={(e) => setCurrentDepartment({...currentDepartment, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fakülte</label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={currentDepartment.facultyId}
                  onChange={(e) => setCurrentDepartment({...currentDepartment, facultyId: e.target.value})}
                >
                  <option value="">Fakülte Seçin</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
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
                onClick={handleEditDepartment}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
                disabled={loading || !currentDepartment.name || !currentDepartment.code || !currentDepartment.facultyId}
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

      {/* Departman Silme Modal */}
      {showDeleteModal && currentDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Departman Sil</h3>
            <p className="text-gray-600">
              <strong>{currentDepartment.name}</strong> departmanını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
                onClick={handleDeleteDepartment}
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

export default DepartmentManagement; 