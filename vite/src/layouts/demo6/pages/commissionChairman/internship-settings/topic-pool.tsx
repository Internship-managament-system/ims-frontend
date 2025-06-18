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

// Onay Modalı
const ConfirmModal = ({ open, onConfirm, onCancel, message }: { open: boolean; onConfirm: () => void; onCancel: () => void; message: string }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px]">
        <p className="mb-6 text-gray-800">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700">İptal</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">Sil</button>
        </div>
      </div>
    </div>
  );
};

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTopicMutation.mutate(deleteId);
    }
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Konu Havuzu Yönetimi</h2>
              <p className="text-gray-600 mt-2">Staj konularını kategorilere göre yönetin ve düzenleyin</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <KeenIcon icon="book" className="text-sm" />
                  <span>{getFilteredTopics().length} Konu</span>
                </div>
              </div>
            </div>
            <button 
              className="btn bg-[#13126e] text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-[#0f0f5a] transition-colors shadow-lg"
              onClick={() => setShowAddModal(true)}
              disabled={createTopicMutation.isPending}
            >
              <KeenIcon icon="plus" />
              <span>{createTopicMutation.isPending ? 'Ekleniyor...' : 'Yeni Konu Ekle'}</span>
            </button>
          </div>

          {/* Konular Listesi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getPaginatedTopics().map((topic, index) => (
                <div 
                  key={`topic-${topic.id}`}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Başlık Bölümü */}
                  <div className="bg-gradient-to-r from-[#13126e] to-[#1a1875] p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-white flex-grow pr-4">
                        {topic.title}
                      </h3>
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <button 
                          key={`edit-${topic.id}`}
                          className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                          onClick={() => handleEditTopic(topic)}
                          title="Düzenle"
                          disabled={updateTopicMutation.isPending}
                        >
                          <KeenIcon icon="pencil" className="text-sm" />
                        </button>
                        <button 
                          key={`delete-${topic.id}`}
                          className="p-2 bg-white/20 text-white rounded-lg hover:bg-red-500 hover:bg-opacity-80 transition-colors"
                          onClick={() => handleDeleteTopic(topic.id)}
                          title="Sil"
                          disabled={deleteTopicMutation.isPending}
                        >
                          <KeenIcon icon="trash" className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* İçerik Bölümü */}
                  <div className="p-6">
                    <div 
                      className="text-gray-700 leading-relaxed [&>p]:mb-3 [&>p]:text-gray-700 [&>p]:leading-relaxed
                        [&>strong]:text-gray-900 [&>strong]:font-semibold
                        [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:space-y-2 [&>ol]:my-4
                        [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:space-y-2 [&>ul]:my-4
                        [&>li]:text-gray-700 [&>li]:leading-relaxed [&>li]:pl-1
                        [&>ol>li]:text-gray-700 [&>ol>li]:leading-relaxed
                        [&>ul>li]:text-gray-700 [&>ul>li]:leading-relaxed
                        [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:text-gray-900 [&>h1]:mb-2 [&>h1]:mt-4
                        [&>h2]:text-base [&>h2]:font-semibold [&>h2]:text-gray-900 [&>h2]:mb-2 [&>h2]:mt-4
                        [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mb-2 [&>h3]:mt-4"
                      dangerouslySetInnerHTML={{ __html: topic.description }}
                    />
                  </div>

                  {/* Alt Bilgi */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="calendar" className="text-xs" />
                        <span>
                          Oluşturma: {topic.createdDate ? new Date(topic.createdDate).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            
            {getPaginatedTopics().length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                <KeenIcon icon="folder-minus" className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Konu Eklenmemiş</h3>
                <p className="text-gray-500 mb-4">Staj konu havuzuna yeni konular ekleyerek başlayabilirsiniz.</p>
                <button 
                  className="btn bg-[#13126e] text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  onClick={() => setShowAddModal(true)}
                >
                  <KeenIcon icon="plus" />
                  <span>İlk Konuyu Ekle</span>
                </button>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full relative border-2 border-[#13126e] max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#13126e] to-[#1f1e7e] text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <KeenIcon icon={editingTopic ? "pencil" : "plus"} className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {editingTopic ? 'Konuyu Düzenle' : 'Yeni Konu Ekle'}
                      </h2>
                      <p className="text-blue-100 text-sm mt-1">
                        {editingTopic ? 'Mevcut konuyu güncelleyin' : 'Staj konu havuzuna yeni bir konu ekleyin'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={resetForm}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <KeenIcon icon="cross" className="text-2xl" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-6">
                  {/* Temel Bilgiler */}
                  <div key="basic-info" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
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

              {/* Footer */}
              <div className="border-t border-gray-200 bg-white p-6 flex justify-end space-x-3">
                <button 
                  className="btn bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  onClick={resetForm}
                  disabled={createTopicMutation.isPending || updateTopicMutation.isPending}
                >
                  İptal
                </button>
                <button 
                  className="btn bg-[#13126e] text-white px-6 py-3 rounded-xl hover:bg-[#0f0e5a] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={editingTopic ? handleUpdateTopic : handleAddTopic}
                  disabled={createTopicMutation.isPending || updateTopicMutation.isPending}
                >
                  <KeenIcon icon={editingTopic ? "check" : "plus"} className="mr-2" />
                  {createTopicMutation.isPending || updateTopicMutation.isPending 
                    ? 'İşleniyor...' 
                    : (editingTopic ? 'Güncelle' : 'Ekle')
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onay Modalı */}
        <ConfirmModal open={confirmOpen} onConfirm={confirmDelete} onCancel={cancelDelete} message="Bu konuyu silmek istediğinizden emin misiniz?" />
      </div>
    </Container>
  );
};

export default TopicPool; 