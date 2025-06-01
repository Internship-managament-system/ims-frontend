import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import axios from 'axios';

interface Rule {
  name: string;
  description: string;
  ruleType: string;
  documentIds?: string[];
}

interface InternshipType {
  id: string;
  name: string;
  description: string;
}

const TypeManagement: React.FC = () => {
  const [types, setTypes] = useState<InternshipType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<InternshipType | null>(null);
  const [newType, setNewType] = useState<Partial<InternshipType>>({
    id: "",
    name: "",
    description: ""
  });

  const [newTopic, setNewTopic] = useState<{name: string, description: string}>({
    name: "",
    description: ""
  });

  // API Base URL
  const API_BASE_URL = '/api/v1';

  // Belgeleri çek
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents`);
      setDocuments(response.data.result || response.data || []);
    } catch (error) {
      console.error('Belgeler yüklenirken hata:', error);
      setDocuments([]);
    }
  };

  // Staj türlerini çek
  const fetchInternshipTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/internships`);
      setTypes(response.data.result || response.data || []);
    } catch (error) {
      console.error('Staj türleri yüklenirken hata:', error);
      // Fallback olarak varsayılan türleri kullan
      
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda staj türlerini yükle
  useEffect(() => {
    fetchInternshipTypes();
    fetchDocuments();
  }, []);

  const handleAddType = async () => {
    if (!newType.name || !newType.description) {
      alert('Lütfen zorunlu alanları doldurun!');
      return;
    }
    
    try {
      const typeData = {
        name: newType.name,
      };

      const response = await axios.post(`${API_BASE_URL}/internships`, typeData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        await fetchInternshipTypes(); // Listeyi yenile
        resetForm();
        alert('Staj türü başarıyla eklendi!');
      }
    } catch (error) {
      console.error('Staj türü eklenirken hata:', error);
      alert('Staj türü eklenirken bir hata oluştu!');
    }
  };

  const handleEditType = (type: InternshipType) => {
    setEditingType(type);
    setNewType({...type});
    setShowAddModal(true);
  };

  const handleUpdateType = async () => {
    if (!editingType || !newType.name || !newType.description) {
      alert('Lütfen zorunlu alanları doldurun!');
      return;
    }
    
    try {
      const updateData = {
        name: newType.name
      };

      const response = await axios.put(`${API_BASE_URL}/internships/${editingType.id}`, updateData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        await fetchInternshipTypes(); // Listeyi yenile
        resetForm();
        alert('Staj türü başarıyla güncellendi!');
      }
    } catch (error) {
      console.error('Staj türü güncellenirken hata:', error);
      alert('Staj türü güncellenirken bir hata oluştu!');
    }
  };

  const handleDeleteType = async (id: string) => {
    if (window.confirm("Bu staj türünü silmek istediğinizden emin misiniz?")) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/internships/${id}`);
        
        if (response.status === 200) {
          await fetchInternshipTypes(); // Listeyi yenile
          alert('Staj türü başarıyla silindi!');
        }
      } catch (error) {
        console.error('Staj türü silinirken hata:', error);
        alert('Staj türü silinirken bir hata oluştu!');
      }
    }
  };

  


  const resetForm = () => {
    setShowAddModal(false);
    setEditingType(null);
    setNewType({
      id: "",
      name: "",
      description: ""
    });
    setNewTopic({name: "", description: ""});
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Staj Türü Yönetimi</h2>
              <p className="text-gray-600 mt-1">Staj türlerini ekleyin, düzenleyin ve ayarlarını yapın</p>
            </div>
            <button 
              className="btn bg-[#13126e] text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <KeenIcon icon="plus" />
              <span>Yeni Staj Türü</span>
            </button>
          </div>

          {/* Staj Türleri Listesi */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13126e] mx-auto mb-4"></div>
                <p className="text-gray-500">Staj türleri yükleniyor...</p>
              </div>
            ) : (
              <>
                {types.map((type) => (
                  <div 
                    key={type.id} 
                    className="p-5 rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-medium text-gray-900">{type.name}</h3>
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{type.description}</p>
                        
                       
                          {type.rules.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Kurallar:</h4>
                              <div className="flex flex-wrap gap-1">
                                {type.rules.map((rule, index) => (
                                  <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                    {rule.name} ({rule.ruleType})
                                  </span>
                                ))}
                              </div>
                            </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button 
                          className="btn bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200"
                          onClick={() => handleEditType(type)}
                          title="Düzenle"
                        >
                          <KeenIcon icon="pencil" />
                        </button>
                        <button 
                          className="btn bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
                          onClick={() => handleDeleteType(type.id)}
                          title="Sil"
                        >
                          <KeenIcon icon="trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && types.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                    <KeenIcon icon="file" className="text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500">Henüz staj türü eklenmemiş.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Ekleme/Düzenleme Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingType ? 'Staj Türünü Düzenle' : 'Yeni Staj Türü Ekle'}
                  </h3>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={resetForm}
                  >
                    <KeenIcon icon="cross" className="text-xl" />
                  </button>
                </div>
                
                <div className="max-h-[80vh] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Temel Bilgiler */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Temel Bilgiler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Staj Türü Adı *
                          </label>
                          <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            placeholder="Örn: Yazılım Stajı (İlk Staj)"
                            value={newType.name || ""}
                            onChange={(e) => setNewType({...newType, name: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Süre (İş Günü)
                          </label>
                          <input 
                            type="number" 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            value={newType.durationOfDays || 25}
                            onChange={(e) => setNewType({...newType, durationOfDays: parseInt(e.target.value)})}
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama *
                          </label>
                          <textarea 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            rows={3}
                            placeholder="Staj türü hakkında detaylı açıklama..."
                            value={newType.description || ""}
                            onChange={(e) => setNewType({...newType, description: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gerekli Belgeler */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Gerekli Belgeler</h4>
                      
                      <div className="space-y-4 mb-4">
                        {/* Mevcut Belgelerden Seçim */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mevcut Belgelerden Seç
                          </label>
                          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
                            {documents.map((doc) => (
                              <label key={doc.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300 mr-3"
                                  checked={newType.rules?.some(rule => rule.ruleType === 'DOCUMENT' && rule.documentIds?.includes(doc.id)) || false}
                                  onChange={(e) => {
                                    const currentRules = newType.rules || [];
                                    if (e.target.checked) {
                                      // Belgeyi ekle
                                      setNewType({
                                        ...newType, 
                                        rules: [...currentRules, {
                                          name: doc.fileName,
                                          description: doc.description || doc.fileName,
                                          ruleType: "DOCUMENT",
                                          documentIds: [doc.id]
                                        }]
                                      });
                                    } else {
                                      // Belgeyi çıkar
                                      setNewType({
                                        ...newType,
                                        rules: currentRules.filter(rule => !(rule.ruleType === 'DOCUMENT' && rule.documentIds?.includes(doc.id)))
                                      });
                                    }
                                  }}
                                />
                                <div className="flex-grow">
                                  <span className="text-sm font-medium text-gray-700">{doc.fileName}</span>
                                  <span className="text-xs text-gray-500 block">{doc.documentType}</span>
                                </div>
                              </label>
                            ))}
                            {documents.length === 0 && (
                              <p className="text-sm text-gray-500 p-2">Henüz belge yüklenmemiş</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {newType.rules && newType.rules.filter(r => r.ruleType === 'DOCUMENT').length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Seçilen Belgeler:</h5>
                          <div className="grid grid-cols-1 gap-2">
                            {newType.rules.filter(r => r.ruleType === 'DOCUMENT').map((rule, index) => (
                              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                                <div>
                                  <span className="text-sm font-medium text-gray-900">{rule.name}</span>
                                  <span className="text-xs text-gray-500 block">{rule.description}</span>
                                </div>
                                <button 
                                  className="btn bg-red-100 text-red-700 p-1 rounded"
                                  onClick={() => handleRemoveRule(newType.rules?.indexOf(rule) || 0)}
                                  type="button"
                                >
                                  <KeenIcon icon="trash" className="text-sm" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* İlgili Konular Seçimi */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">İlgili Konular</h4>
                      <p className="text-sm text-gray-600 mb-4">Bu staj türüne dahil olacak konuları ekleyin:</p>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Konu Adı *
                            </label>
                            <input 
                              type="text" 
                              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                              placeholder="Örn: Web Uygulaması Geliştirme"
                              value={newTopic.name}
                              onChange={(e) => setNewTopic({...newTopic, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Açıklama *
                            </label>
                            <input 
                              type="text" 
                              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                              placeholder="Konu hakkında açıklama"
                              value={newTopic.description}
                              onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <button 
                          className="btn bg-[#13126e] text-white px-4 py-2 rounded w-full"
                          onClick={handleAddTopic}
                          type="button"
                          disabled={!newTopic.name.trim() || !newTopic.description.trim()}
                        >
                          <KeenIcon icon="plus" className="mr-2" />
                          Konu Ekle
                        </button>
                      </div>
                      
                      {newType.rules && newType.rules.filter(r => r.ruleType === 'TOPIC').length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Eklenen Konular:</h5>
                          <div className="grid grid-cols-1 gap-2">
                            {newType.rules.filter(r => r.ruleType === 'TOPIC').map((rule, index) => (
                              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                                <span className="text-sm font-medium text-gray-900">{rule.name}</span>
                                <button 
                                  className="btn bg-red-100 text-red-700 p-1 rounded"
                                  onClick={() => handleRemoveRule(newType.rules?.indexOf(rule) || 0)}
                                  type="button"
                                >
                                  <KeenIcon icon="trash" className="text-sm" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button 
                    className="btn bg-gray-300 text-gray-700 px-6 py-2 rounded"
                    onClick={resetForm}
                  >
                    İptal
                  </button>
                  <button 
                    className="btn bg-[#13126e] text-white px-6 py-2 rounded"
                    onClick={editingType ? handleUpdateType : handleAddType}
                  >
                    {editingType ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TypeManagement; 