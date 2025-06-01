import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

interface InternshipTopic {
  id: string;
  name: string;
  description: string;
  examples: string[];
  createdDate: string;
}

const TopicPool: React.FC = () => {
  const [topics, setTopics] = useState<InternshipTopic[]>([
    {
      id: 'Y-1',
      name: 'Web Uygulaması Geliştirme',
      description: 'Modern web teknolojileri kullanarak uygulama geliştirme',
      examples: ['React.js ile e-ticaret sitesi', 'Vue.js ile dashboard', 'Node.js API geliştirme'],
      createdDate: '2024-01-15'
    },
    {
      id: 'Y-2',
      name: 'Mobil Uygulama Geliştirme',
      description: 'iOS ve Android platformları için mobil uygulama geliştirme',
      examples: ['Flutter ile çoklu platform uygulama', 'React Native projesi', 'Native iOS/Android app'],
      createdDate: '2024-01-15'
    },
    {
      id: 'Y-3',
      name: 'Veri Analizi ve Makine Öğrenmesi',
      description: 'Büyük veri analizi ve yapay zeka uygulamaları',
      examples: ['Python ile veri madenciliği', 'TensorFlow modeli geliştirme', 'Tableau dashboard'],
      createdDate: '2024-01-15'
    },
    {
      id: 'D-1',
      name: 'Gömülü Sistem Geliştirme',
      description: 'Mikroişlemci tabanlı gömülü sistem projeleri',
      examples: ['Arduino ile IoT projesi', 'Raspberry Pi uygulaması', 'STM32 programlama'],
      createdDate: '2024-01-15'
    },
    {
      id: 'D-2',
      name: 'Ağ Altyapısı ve Güvenlik',
      description: 'Ağ sistemleri kurulumu ve güvenlik uygulamaları',
      examples: ['Cisco ağ konfigürasyonu', 'Güvenlik duvarı kurulumu', 'Penetrasyon testleri'],
      createdDate: '2024-01-15'
    },
    {
      id: 'R-1',
      name: 'Akademik Araştırma Projesi',
      description: 'Üniversite laboratuvarlarında araştırma ve geliştirme',
      examples: ['Bilimsel makale yazımı', 'Deneysel çalışma', 'Patent başvurusu'],
      createdDate: '2024-01-15'
    },
    {
      id: 'G-1',
      name: 'Proje Yönetimi ve Süreç Analizi',
      description: 'İş süreçleri analizi ve proje yönetimi deneyimi',
      examples: ['Agile metodolojileri', 'Scrum süreçleri', 'İş analizi raporları'],
      createdDate: '2024-01-15'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<InternshipTopic | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [newTopic, setNewTopic] = useState<Partial<InternshipTopic>>({
    id: "",
    name: "",
    description: "",
    examples: [],
    createdDate: new Date().toISOString().split('T')[0]
  });

  const [newExample, setNewExample] = useState<string>("");

  const handleAddTopic = () => {
    if (!newTopic.name || !newTopic.description) {
      alert('Lütfen zorunlu alanları doldurun!');
      return;
    }
    
    const topicToAdd: InternshipTopic = {
      id: newTopic.id || generateTopicId(),
      name: newTopic.name,
      description: newTopic.description,
      examples: newTopic.examples || [],
      createdDate: newTopic.createdDate || new Date().toISOString().split('T')[0]
    };
    
    setTopics([...topics, topicToAdd]);
    setCurrentPage(1);
    resetForm();
    alert('Konu başarıyla eklendi!');
  };

  const handleEditTopic = (topic: InternshipTopic) => {
    setEditingTopic(topic);
    setNewTopic({...topic});
    setShowAddModal(true);
  };

  const handleUpdateTopic = () => {
    if (!editingTopic || !newTopic.name || !newTopic.description) {
      alert('Lütfen zorunlu alanları doldurun!');
      return;
    }
    
    setTopics(topics.map(t => 
      t.id === editingTopic.id 
        ? { ...t, ...newTopic }
        : t
    ));
    
    resetForm();
    alert('Konu başarıyla güncellendi!');
  };

  const handleDeleteTopic = (id: string) => {
    if (window.confirm("Bu konuyu silmek istediğinizden emin misiniz?")) {
      setTopics(topics.filter(t => t.id !== id));
      alert('Konu silindi!');
    }
  };

  const handleAddExample = () => {
    if (newExample.trim() === "") return;
    
    setNewTopic({
      ...newTopic,
      examples: [...(newTopic.examples || []), newExample.trim()]
    });
    setNewExample("");
  };

  const handleRemoveExample = (index: number) => {
    const updatedExamples = [...(newTopic.examples || [])];
    updatedExamples.splice(index, 1);
    setNewTopic({
      ...newTopic,
      examples: updatedExamples
    });
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingTopic(null);
    setNewTopic({
      id: "",
      name: "",
      description: "",
      examples: [],
      createdDate: new Date().toISOString().split('T')[0]
    });
    setNewExample("");
  };

  const generateTopicId = () => {
    const allNumbers = topics.map(t => {
      const match = t.id.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }).filter(n => n > 0);
    
    const nextNumber = allNumbers.length > 0 ? Math.max(...allNumbers) + 1 : 1;
    return `K-${nextNumber}`;
  };

  const getFilteredTopics = () => {
    return topics;
  };

  const getPaginatedTopics = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return getFilteredTopics().slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredTopics().length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Konu Havuzu Yönetimi</h2>
              <p className="text-gray-600 mt-1">Staj konularını kategorilere göre yönetin ve düzenleyin</p>
            </div>
            <button 
              className="btn bg-[#13126e] text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <KeenIcon icon="plus" />
              <span>Yeni Konu Ekle</span>
            </button>
          </div>

          {/* Konular Listesi */}
          <div className="space-y-4">
            {getPaginatedTopics().map((topic) => {
              return (
                <div 
                  key={topic.id} 
                  className="p-5 rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{topic.id}: {topic.name}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{topic.description}</p>
                      
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Oluşturma Tarihi:</span>
                        <p className="text-sm text-gray-600">{new Date(topic.createdDate).toLocaleDateString('tr-TR')}</p>
                      </div>

                      {topic.examples.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Proje Örnekleri:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {topic.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button 
                        className="btn bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200"
                        onClick={() => handleEditTopic(topic)}
                        title="Düzenle"
                      >
                        <KeenIcon icon="pencil" />
                      </button>
                      <button 
                        className="btn bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
                        onClick={() => handleDeleteTopic(topic.id)}
                        title="Sil"
                      >
                        <KeenIcon icon="trash" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {getPaginatedTopics().length === 0 && (
              <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-500">Bu kategoride konu bulunamadı.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {getTotalPages() > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Toplam {getFilteredTopics().length} konudan {' '}
                  {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getFilteredTopics().length)} arası gösteriliyor
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Önceki Sayfa */}
                <button
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <KeenIcon icon="left" className="text-sm" />
                </button>

                {/* Sayfa Numaraları */}
                {Array.from({ length: getTotalPages() }, (_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      className={`px-3 py-2 rounded text-sm font-medium ${
                        currentPage === page
                          ? 'bg-[#13126e] text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Sonraki Sayfa */}
                <button
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    currentPage === getTotalPages()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === getTotalPages()}
                >
                  <KeenIcon icon="right" className="text-sm" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ekleme/Düzenleme Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingTopic ? 'Konuyu Düzenle' : 'Yeni Konu Ekle'}
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
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Konu Adı *
                          </label>
                          <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            placeholder="Konu adını girin"
                            value={newTopic.name || ""}
                            onChange={(e) => setNewTopic({...newTopic, name: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama *
                          </label>
                          <textarea 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            rows={3}
                            placeholder="Konu hakkında detaylı açıklama"
                            value={newTopic.description || ""}
                            onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Proje Örnekleri */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Proje Örnekleri</h4>
                      
                      <div className="flex gap-2 mb-3">
                        <input 
                          type="text" 
                          className="flex-grow border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                          placeholder="Yeni örnek proje ekle..."
                          value={newExample}
                          onChange={(e) => setNewExample(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddExample()}
                        />
                        <button 
                          className="btn bg-[#13126e] text-white px-3 py-2 rounded"
                          onClick={handleAddExample}
                          type="button"
                        >
                          <KeenIcon icon="plus" />
                        </button>
                      </div>
                      
                      {newTopic.examples && newTopic.examples.length > 0 && (
                        <div className="space-y-2">
                          {newTopic.examples.map((example, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                              <span className="text-sm text-gray-700">{example}</span>
                              <button 
                                className="btn bg-red-100 text-red-700 p-1 rounded"
                                onClick={() => handleRemoveExample(index)}
                                type="button"
                              >
                                <KeenIcon icon="trash" className="text-sm" />
                              </button>
                            </div>
                          ))}
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
                    onClick={editingTopic ? handleUpdateTopic : handleAddTopic}
                  >
                    {editingTopic ? 'Güncelle' : 'Ekle'}
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

export default TopicPool; 