import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { SlateEditor } from '@/components/slate-editor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getInternshipTopics, 
  createInternshipTopic, 
  updateInternshipTopic, 
  deleteInternshipTopic,
  InternshipTopic,
  NewInternshipTopic
} from '@/services/topicsService';

const TopicPool: React.FC = () => {
  const queryClient = useQueryClient();
  
  // API'den konuları çek
  const { data: topics = [], isLoading, error } = useQuery({
    queryKey: ['internship-topics'],
    queryFn: getInternshipTopics,
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<InternshipTopic | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [newTopic, setNewTopic] = useState<Partial<NewInternshipTopic>>({
    title: "",
    description: ""
  });

  // Konu ekleme mutation
  const createTopicMutation = useMutation({
    mutationFn: createInternshipTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internship-topics'] });
      resetForm();
      toast.success('Konu başarıyla eklendi!');
    },
    onError: (error: any) => {
      console.error('Konu ekleme hatası:', error);
      toast.error('Konu eklenirken bir hata oluştu.');
    }
  });

  // Konu güncelleme mutation
  const updateTopicMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: NewInternshipTopic }) => 
      updateInternshipTopic(id, { id: String(id), ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internship-topics'] });
      resetForm();
      toast.success('Konu başarıyla güncellendi!');
    },
    onError: (error: any) => {
      console.error('Konu güncelleme hatası:', error);
      toast.error('Konu güncellenirken bir hata oluştu.');
    }
  });

  // Konu silme mutation
  const deleteTopicMutation = useMutation({
    mutationFn: deleteInternshipTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internship-topics'] });
      toast.success('Konu başarıyla silindi!');
    },
    onError: (error: any) => {
      console.error('Konu silme hatası:', error);
      toast.error('Konu silinirken bir hata oluştu.');
    }
  });

  const handleAddTopic = () => {
    if (!newTopic.title || !newTopic.description) {
      toast.error('Lütfen zorunlu alanları doldurun!');
      return;
    }
    
    createTopicMutation.mutate({
      title: newTopic.title,
      description: newTopic.description
    });
  };

  const handleEditTopic = (topic: InternshipTopic) => {
    setEditingTopic(topic);
    setNewTopic({
      title: topic.title,
      description: topic.description
    });
    setShowAddModal(true);
  };

  const handleUpdateTopic = () => {
    if (!editingTopic || !newTopic.title || !newTopic.description) {
      toast.error('Lütfen zorunlu alanları doldurun!');
      return;
    }

    if (!editingTopic.id) {
      toast.error('Konu ID bulunamadı!');
      return;
    }
    
    updateTopicMutation.mutate({
      id: editingTopic.id,
      data: {
        title: newTopic.title,
        description: newTopic.description
      }
    });
  };

  const handleDeleteTopic = (id: string) => {
    if (window.confirm("Bu konuyu silmek istediğinizden emin misiniz?")) {
      deleteTopicMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingTopic(null);
    setNewTopic({
      title: "",
      description: ""
    });
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

  // Loading durumu
  if (isLoading) {
    return (
      <Container>
        <div className="p-5">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Konular yükleniyor...</div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <Container>
        <div className="p-5">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500">Konular yüklenirken bir hata oluştu.</div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

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
              disabled={createTopicMutation.isPending}
            >
              <KeenIcon icon="plus" />
              <span>{createTopicMutation.isPending ? 'Ekleniyor...' : 'Yeni Konu Ekle'}</span>
            </button>
          </div>

          {/* Konular Listesi */}
          <div className="space-y-4">
            {getPaginatedTopics().map((topic, index) => {
              const uniqueKey = topic.id ? `topic-${topic.id}` : `topic-index-${index}-${currentPage}`;
              return (
                <div 
                  key={uniqueKey}
                  className="p-5 rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div key={`content-${topic.id || index}`} className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{topic.id || `#${index + 1}`}: {topic.title}</h3>
                      </div>
                      
                      <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: topic.description }}></div>
                      
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Oluşturma Tarihi:</span>
                        <p className="text-sm text-gray-600">{new Date(topic.createdDate).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                    
                    <div key={`actions-${topic.id || index}`} className="flex gap-2 ml-4">
                      <button 
                        key={`edit-${topic.id || index}`}
                        className="btn bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200"
                        onClick={() => handleEditTopic(topic)}
                        title="Düzenle"
                        disabled={updateTopicMutation.isPending}
                      >
                        <KeenIcon icon="pencil" />
                      </button>
                      <button 
                        key={`delete-${topic.id || index}`}
                        className="btn bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
                        onClick={() => {
                          if (topic.id) {
                            handleDeleteTopic(topic.id);
                          }
                        }}
                        title="Sil"
                        disabled={deleteTopicMutation.isPending || !topic.id}
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
                <p className="text-gray-500">Henüz konu bulunamadı.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {getTotalPages() > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <div key="pagination-info" className="flex items-center text-sm text-gray-700">
                <span>
                  Toplam {getFilteredTopics().length} konudan {' '}
                  {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getFilteredTopics().length)} arası gösteriliyor
                </span>
              </div>
              
              <div key="pagination-controls" className="flex items-center space-x-2">
                {/* Önceki Sayfa */}
                <button
                  key="prev-button"
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
                      key={`pagination-page-${page}-${getTotalPages()}`}
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
                  key="next-button"
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
                    <div key="basic-info" className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Temel Bilgiler</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div key="title-field">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Konu Adı *
                          </label>
                          <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            placeholder="Konu adını girin"
                            value={newTopic.title || ""}
                            onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                          />
                        </div>
                        
                        <div key="description-field">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama *
                          </label>
                          <SlateEditor
                            value={newTopic.description || ""}
                            onChange={(value) => setNewTopic({...newTopic, description: value})}
                            placeholder="Konu hakkında detaylı açıklama yazın. Metin biçimlendirme araçlarını kullanabilirsiniz."
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button 
                    className="btn bg-gray-300 text-gray-700 px-6 py-2 rounded"
                    onClick={resetForm}
                    disabled={createTopicMutation.isPending || updateTopicMutation.isPending}
                  >
                    İptal
                  </button>
                  <button 
                    className="btn bg-[#13126e] text-white px-6 py-2 rounded"
                    onClick={editingTopic ? handleUpdateTopic : handleAddTopic}
                    disabled={createTopicMutation.isPending || updateTopicMutation.isPending}
                  >
                    {createTopicMutation.isPending || updateTopicMutation.isPending 
                      ? 'İşleniyor...' 
                      : (editingTopic ? 'Güncelle' : 'Ekle')
                    }
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