import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import axios from 'axios';
import { getInternshipTopics } from '@/services/topicsService';

import { useToast } from '@/components/ui/use-toast';
import parse, { domToReact } from 'html-react-parser';

interface Rule {
  name: string;
  description: string;
  ruleType: string;
  submissionType?: string;
  documentIds?: string[];
}

interface Topic {
  title: string;
  description: string;
  createdDate: string;
}
interface DocumentInfo {
  id: string;
  fileAddress: string;
  fileName: string;
  documentType: string;
  description: string;
  createdDate: string;
}

interface InternshipType {
  id: string;
  name: string;
  description: string;
  durationOfDays?: number;
  departmentId?: string;
  rules?: Rule[];
}

const TypeManagement: React.FC = () => {
  const { toast } = useToast();
  const [types, setTypes] = useState<InternshipType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<InternshipType | null>(null);
  const [newType, setNewType] = useState<Partial<InternshipType>>({
    id: '',
    name: '',
    description: '',
    durationOfDays: 25,
    rules: []
  });

  const [newTopic, setNewTopic] = useState<{ name: string; description: string }>({
    name: '',
    description: ''
  });
  const [newSubmissionDocument, setNewSubmissionDocument] = useState<{ name: string; description: string }>({
    name: '',
    description: ''
  });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

  // Konuları çek (endpoint daha sonra verilecek)
  const fetchTopics = async () => {
    try {
      const response = await getInternshipTopics();
      // Tip dönüşümü: InternshipTopic[] -> Topic[]
      const topics: Topic[] = response.map((item: any) => ({
        title: item.title,
        description: item.description,
        createdDate: item.createdDate || ''
      }));
      setTopics(topics);
    } catch (error) {
      console.error('Konular yüklenirken hata:', error);
      setTopics([]);
    }
  };

  const fetchInternShipDetail = async (internshipId: string) => {
    const response = await axios.get(`${API_BASE_URL}/internships/${internshipId}`);
    return response.data.result || response.data || [];
  };

  const fetchInternshipTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/internships`);
      const typesList = response?.data?.result || [];

      // Her staj türü için detay bilgisini çek (rules'ları almak için)
      const typesWithDetails = await Promise.all(
        typesList.map(async (type: any) => {
          try {
            const detailResponse = await fetchInternShipDetail(type.id);
            return { ...type, ...detailResponse };
          } catch (error) {
            console.error(`Staj türü detayı alınırken hata (ID: ${type.id}):`, error);
            return type;
          }
        })
      );

      setTypes(typesWithDetails);
    } catch (error) {
      console.error('Staj türleri yüklenirken hata:', error);
      setTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda staj türlerini yükle
  useEffect(() => {
    fetchInternshipTypes();
    fetchDocuments();
    fetchTopics();
  }, []);

  const handleAddType = async () => {
    if (!newType.name || !newType.description) {
      toast({ title: 'Hata', description: 'Lütfen zorunlu alanları doldurun!', type: 'error' });
      return;
    }

    try {
      const typeData = {
        name: newType.name,
        description: newType.description,
        durationOfDays: newType.durationOfDays || 25,
        rules: newType.rules || []
      };
      const response = await axios.post(`${API_BASE_URL}/internships`, typeData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200 || response.status === 201) {
        await fetchInternshipTypes(); // Listeyi yenile
        resetForm();
        toast({ title: 'Başarılı', description: 'Staj türü başarıyla eklendi!', type: 'success' });
      }
    } catch (error) {
      console.error('Staj türü eklenirken hata:', error);
      toast({ title: 'Hata', description: 'Staj türü eklenirken bir hata oluştu!', type: 'error' });
    }
  };

  const handleEditType = (type: InternshipType) => {
    setEditingType(type);
    setNewType({ ...type });
    setShowAddModal(true);
  };

  const handleUpdateType = async () => {
    if (!editingType || !newType.name || !newType.description) {
      toast({ title: 'Hata', description: 'Lütfen zorunlu alanları doldurun!', type: 'error' });
      return;
    }

    try {
      const updateData = {
        name: newType.name,
        description: newType.description,
        durationOfDays: newType.durationOfDays || 25,
        rules: newType.rules || []
      };

      const response = await axios.put(
        `${API_BASE_URL}/internships/${editingType.id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        await fetchInternshipTypes(); // Listeyi yenile
        resetForm();
        toast({
          title: 'Başarılı',
          description: 'Staj türü başarıyla güncellendi!',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Staj türü güncellenirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Staj türü güncellenirken bir hata oluştu!',
        type: 'error'
      });
    }
  };

  const handleDeleteType = async (id: string) => {
    if (window.confirm('Bu staj türünü silmek istediğinizden emin misiniz?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/internships/${id}`);

        if (response.status === 200) {
          await fetchInternshipTypes(); // Listeyi yenile
          toast({
            title: 'Başarılı',
            description: 'Staj türü başarıyla silindi!',
            type: 'success'
          });
        }
      } catch (error) {
        console.error('Staj türü silinirken hata:', error);
        toast({
          title: 'Hata',
          description: 'Staj türü silinirken bir hata oluştu!',
          type: 'error'
        });
      }
    }
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = [...(newType.rules || [])];
    updatedRules.splice(index, 1);
    setNewType({
      ...newType,
      rules: updatedRules
    });
  };

  const handleAddTopic = () => {
    if (newTopic.name.trim() === '' || newTopic.description.trim() === '') return;

    setNewType({
      ...newType,
      rules: [
        ...(newType.rules || []),
        {
          name: newTopic.name,
          description: newTopic.description,
          ruleType: 'TOPIC',
          submissionType: 'APPLICATION'
        }
      ]
    });
    setNewTopic({ name: '', description: '' });
  };

  const handleAddSubmissionDocument = () => {
    if (newSubmissionDocument.name.trim() === '' || newSubmissionDocument.description.trim() === '') return;

    setNewType({
      ...newType,
      rules: [
        ...(newType.rules || []),
        {
          name: newSubmissionDocument.name,
          description: newSubmissionDocument.description,
          ruleType: 'DOCUMENT',
          submissionType: 'SUBMISSION'
        }
      ]
    });
    setNewSubmissionDocument({ name: '', description: '' });
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingType(null);
    setNewType({
      id: '',
      name: '',
      description: '',
      durationOfDays: 25,
      rules: []
    });
    setNewTopic({ name: '', description: '' });
    setNewSubmissionDocument({ name: '', description: '' });
  };

  // Kart tıklanınca detay sorgusu at
  const handleTypeClick = async (typeId: string) => {
    setLoadingDetail(true);
    setDetailModalOpen(true);
    try {
      const response = await axios.get(`/api/v1/internships/${typeId}`);
      // Sadece gerekli alanları al
      const data = response.data.result;
      setSelectedType({
        name: data.name,
        description: data.description,
        durationOfDays: data.durationOfDays,
        rules: (data.rules || []).map((rule: any) => ({
          name: rule.name,
          description: rule.description,
          type: rule.type
        }))
      });
    } catch {
      setSelectedType(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Yardımcı fonksiyon: HTML açıklamayı sıralı maddeye çevir
  function renderDescription(description: string) {
    if (!description) return null;
    if (/<[a-z][\s\S]*>/i.test(description)) {
      return (
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          {parse(description, {
            replace: (domNode: any) => {
              if (domNode.name === 'ol') {
                return (
                  <ol className="list-decimal pl-6 space-y-1">{domToReact(domNode.children)}</ol>
                );
              }
              if (domNode.name === 'ul') {
                return <ul className="list-disc pl-6 space-y-1">{domToReact(domNode.children)}</ul>;
              }
              if (domNode.name === 'li') {
                return <li>{domToReact(domNode.children)}</li>;
              }
              if (domNode.name === 'p') {
                return <p className="mb-1">{domToReact(domNode.children)}</p>;
              }
            }
          })}
        </div>
      );
    }
    return <div className="text-xs text-gray-500 mt-1">{description}</div>;
  }

  // TypeDetailModal güncelle
  const getRuleTypeColor = (ruleType: string) => {
    switch (ruleType) {
      case 'DOCUMENT':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'TOPIC':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getRuleTypeIcon = (ruleType: string) => {
    switch (ruleType) {
      case 'DOCUMENT':
        return 'document';
      case 'TOPIC':
        return 'book';
      default:
        return 'information-2';
    }
  };

  const getRuleTypeText = (ruleType: string) => {
    switch (ruleType) {
      case 'DOCUMENT':
        return '📄 Belge';
      case 'TOPIC':
        return '📚 Konu';
      default:
        return ruleType;
    }
  };

  const TypeDetailModal = ({
    open,
    onClose,
    type,
    loading
  }: {
    open: boolean;
    onClose: () => void;
    type: any | null;
    loading: boolean;
  }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full relative border-2 border-[#13126e] max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#13126e] to-[#1f1e7e] text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <KeenIcon icon="briefcase" className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{type?.name || 'Staj Türü Detayı'}</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Staj türü kurallarını ve detaylarını inceleyin
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <KeenIcon icon="cross" className="text-2xl" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-60">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#13126e]/20"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#13126e] absolute top-0 left-0"></div>
                </div>
                <span className="text-gray-600 mt-4 font-medium">Detaylar yükleniyor...</span>
              </div>
            ) : type ? (
              <>
                {/* Genel Bilgiler */}
                <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#13126e] to-[#1f1e7e] p-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <KeenIcon icon="information-2" className="text-white text-xl" />
                      Genel Bilgiler
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start gap-6 mb-6">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <KeenIcon icon="text" className="text-[#13126e] text-lg" />
                          <span className="text-sm font-semibold text-[#13126e]">Açıklama</span>
                        </div>
                        <p className="text-gray-800 text-lg leading-relaxed">{type.description}</p>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center gap-2">
                          <KeenIcon icon="time" className="text-[#13126e] text-lg" />
                          <span className="text-sm font-semibold text-[#13126e]">Süre</span>
                        </div>
                        <span className="inline-flex items-center gap-2 bg-[#13126e] text-white px-4 py-2 rounded-xl font-semibold">
                          <KeenIcon icon="calendar" className="text-sm" />
                          {type.durationOfDays} iş günü
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kurallar */}
                {type.rules && type.rules.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#13126e] to-[#1f1e7e] p-4">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <KeenIcon icon="setting-2" className="text-white text-xl" />
                        Kurallar ve Gereksinimler
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                          {type.rules.length} kural
                        </span>
                      </h4>
                    </div>

                    <div className="p-6">
                      <div className="space-y-6">
                        {type.rules.map((rule: any, idx: number) => (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50/30"
                          >
                            <div className="p-5">
                              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-[#13126e]/10 rounded-xl">
                                    <KeenIcon
                                      icon={getRuleTypeIcon(rule.type)}
                                      className="text-[#13126e] text-lg"
                                    />
                                  </div>
                                  <h5 className="font-bold text-gray-900 text-lg">{rule.name}</h5>
                                </div>
                                <span
                                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${getRuleTypeColor(rule.type)}`}
                                >
                                  <KeenIcon icon={getRuleTypeIcon(rule.type)} className="text-sm" />
                                  {getRuleTypeText(rule.type)}
                                </span>
                              </div>

                              {rule.description && rule.description !== rule.name && (
                                <div className="text-gray-600 text-sm bg-white/70 p-4 rounded-xl border-l-4 border-[#13126e]">
                                  {renderDescription(rule.description)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-12 text-center">
                      <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <KeenIcon icon="setting-2" className="text-4xl text-gray-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-700 mb-2">Kural Bulunmuyor</h4>
                      <p className="text-gray-500">Bu staj türü için henüz kural tanımlanmamış.</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-12 text-center">
                  <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <KeenIcon icon="warning" className="text-4xl text-red-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">Detaylar Yüklenemedi</h4>
                  <p className="text-gray-500">Staj türü detayları yüklenirken bir hata oluştu.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container>
      <div className="p-6">
        {/* Header Section */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#13126e]/10 rounded-xl">
                <KeenIcon icon="setting-2" className="text-2xl text-[#13126e]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Staj Türü Yönetimi</h2>
                <p className="text-gray-600 mt-1">
                  Staj türlerini ekleyin, düzenleyin ve ayarlarını yapın
                </p>
              </div>
            </div>
            <button
              className="btn bg-[#13126e] text-white px-6 py-3 rounded-xl hover:bg-[#0f0e5a] transition-colors duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              onClick={() => setShowAddModal(true)}
            >
              <KeenIcon icon="plus" />
              <span>Yeni Staj Türü</span>
            </button>
          </div>
        </div>

        {/* Staj Türleri Listesi */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13126e] mx-auto mb-4"></div>
            <p className="text-gray-500">Staj türleri yükleniyor...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {types.map((type) => (
              <div
                key={type.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                onClick={() => handleTypeClick(type.id)}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#13126e] to-[#1f1e7e] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors">
                        {type.name}
                      </h3>
                      {type.durationOfDays && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                          <KeenIcon icon="time" className="text-xs" />
                          <span>Süre: {type.durationOfDays} iş günü</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteType(type.id);
                        }}
                        title="Sil"
                      >
                        <KeenIcon icon="trash" className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div
                    className="text-gray-700 text-sm leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: type.description }}
                  />

                  {/* Footer */}
                  {type.rules && type.rules.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="document" className="text-xs" />
                        <span>{type.rules.length} kural tanımlı</span>
                      </div>
                      <span className="text-xs text-[#13126e] font-medium">
                        Detayları görüntüle →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {types.length === 0 && (
              <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                <KeenIcon icon="folder-minus" className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Henüz Staj Türü Eklenmemiş
                </h3>
                <p className="text-gray-500 mb-4">Staj türlerini ekleyerek başlayabilirsiniz.</p>
                <button
                  className="btn bg-[#13126e] text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  onClick={() => setShowAddModal(true)}
                >
                  <KeenIcon icon="plus" />
                  <span>İlk Staj Türünü Ekle</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Detay Modalı */}
        <TypeDetailModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          type={selectedType}
          loading={loadingDetail}
        />

        {/* Ekleme/Düzenleme Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full relative border-2 border-[#13126e] max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#13126e] to-[#1f1e7e] text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <KeenIcon
                        icon={editingType ? 'pencil' : 'plus'}
                        className="text-white text-2xl"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {editingType ? 'Staj Türünü Düzenle' : 'Yeni Staj Türü Ekle'}
                      </h2>
                      <p className="text-blue-100 text-sm mt-1">
                        {editingType
                          ? 'Mevcut staj türünü güncelleyin'
                          : 'Yeni bir staj türü oluşturun'}
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
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
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
                          value={newType.name || ''}
                          onChange={(e) => setNewType({ ...newType, name: e.target.value })}
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
                          onChange={(e) =>
                            setNewType({ ...newType, durationOfDays: parseInt(e.target.value) })
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açıklama *
                        </label>
                        <textarea
                          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                          rows={4}
                          placeholder="Staj türü hakkında detaylı açıklama..."
                          value={newType.description || ''}
                          onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gerekli Belgeler */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Gerekli Belgeler</h4>

                    <div className="space-y-4 mb-4">
                      {/* Mevcut Belgelerden Seçim */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mevcut Belgelerden Seç
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
                          {documents.map((doc) => (
                            <label
                              key={doc.id}
                              className="flex items-center p-2 hover:bg-gray-50 rounded"
                            >
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 mr-3"
                                checked={
                                  newType.rules?.some(
                                    (rule) =>
                                      rule.ruleType === 'DOCUMENT' &&
                                      rule.submissionType === 'APPLICATION' &&
                                      rule.documentIds?.includes(doc.id)
                                  ) || false
                                }
                                onChange={(e) => {
                                  const currentRules = newType.rules || [];
                                  if (e.target.checked) {
                                    // Belgeyi ekle
                                    setNewType({
                                      ...newType,
                                      rules: [
                                        ...currentRules,
                                        {
                                          name: doc.fileName,
                                          description: doc.description || doc.fileName,
                                          ruleType: 'DOCUMENT',
                                          submissionType: 'APPLICATION',
                                          documentIds: [doc.id]
                                        }
                                      ]
                                    });
                                  } else {
                                    // Belgeyi çıkar
                                    setNewType({
                                      ...newType,
                                      rules: currentRules.filter(
                                        (rule) =>
                                          !(
                                            rule.ruleType === 'DOCUMENT' &&
                                            rule.submissionType === 'APPLICATION' &&
                                            rule.documentIds?.includes(doc.id)
                                          )
                                      )
                                    });
                                  }
                                }}
                              />
                              <div className="flex-grow">
                                <span className="text-sm font-medium text-gray-700">
                                  {doc.fileName}
                                </span>
                                <span className="text-xs text-gray-500 block">
                                  {doc.documentType}
                                </span>
                              </div>
                            </label>
                          ))}
                          {documents.length === 0 && (
                            <p className="text-sm text-gray-500 p-2">Henüz belge yüklenmemiş</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {newType.rules &&
                      newType.rules.filter((r) => r.ruleType === 'DOCUMENT' && r.submissionType === 'APPLICATION').length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Seçilen Başvuru Belgeleri:</h5>
                          <div className="grid grid-cols-1 gap-2">
                            {newType.rules
                              .filter((r) => r.ruleType === 'DOCUMENT' && r.submissionType === 'APPLICATION')
                              .map((rule, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                                >
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {rule.name}
                                    </span>
                                    <span className="text-xs text-gray-500 block">
                                      {rule.description}
                                    </span>
                                  </div>
                                  <button
                                    className="btn bg-red-100 text-red-700 p-1 rounded"
                                    onClick={() =>
                                      handleRemoveRule(newType.rules?.indexOf(rule) || 0)
                                    }
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
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h4 className="text-md font-medium text-gray-900 mb-4">İlgili Konular</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Bu staj türüne dahil olacak konuları seçin:
                    </p>

                    <div className="space-y-6">
                      {/* Mevcut Konulardan Seçim */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mevcut Konulardan Seç
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
                          {topics.map((topic) => (
                            <label
                              key={topic.title}
                              className="flex items-center p-2 hover:bg-gray-50 rounded"
                            >
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 mr-3"
                                checked={
                                  newType.rules?.some(
                                    (rule) => rule.ruleType === 'TOPIC' && rule.submissionType === 'APPLICATION' && rule.name === topic.title
                                  ) || false
                                }
                                onChange={(e) => {
                                  const currentRules = newType.rules || [];
                                  if (e.target.checked) {
                                    // Konuyu ekle
                                    setNewType({
                                      ...newType,
                                      rules: [
                                        ...currentRules,
                                        {
                                          name: topic.title,
                                          description: topic.description,
                                          ruleType: 'TOPIC',
                                          submissionType: 'APPLICATION'
                                        }
                                      ]
                                    });
                                  } else {
                                    // Konuyu çıkar
                                    setNewType({
                                      ...newType,
                                      rules: currentRules.filter(
                                        (rule) =>
                                          !(rule.ruleType === 'TOPIC' && rule.submissionType === 'APPLICATION' && rule.name === topic.title)
                                      )
                                    });
                                  }
                                }}
                              />
                              <div className="flex-grow">
                                <span className="text-sm font-medium text-gray-700">
                                  {topic.title}
                                </span>
                                <div
                                  className="text-xs text-gray-500 mt-1 [&>p]:mb-1 [&>p]:text-gray-500 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:space-y-1 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:space-y-1 [&>li]:text-gray-500 [&>strong]:font-semibold [&>strong]:text-gray-600"
                                  dangerouslySetInnerHTML={{ __html: topic.description }}
                                />
                              </div>
                            </label>
                          ))}
                          {topics.length === 0 && (
                            <p className="text-sm text-gray-500 p-2">Henüz konu eklenmemiş</p>
                          )}
                        </div>
                      </div>

                      {/* Yeni Konu Ekleme */}
                      <div className="border-t border-gray-200 pt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Yeni Konu Ekle</h5>
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
                              onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
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
                              onChange={(e) =>
                                setNewTopic({ ...newTopic, description: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <button
                          className="btn bg-[#13126e] text-white px-4 py-2 rounded w-full mt-3"
                          onClick={handleAddTopic}
                          type="button"
                          disabled={!newTopic.name.trim() || !newTopic.description.trim()}
                        >
                          <KeenIcon icon="plus" className="mr-2" />
                          Konu Ekle
                        </button>
                      </div>
                    </div>

                    {newType.rules &&
                      newType.rules.filter((r) => r.ruleType === 'TOPIC' && r.submissionType === 'APPLICATION').length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Seçilen Konular:</h5>
                          <div className="grid grid-cols-1 gap-2">
                            {newType.rules
                              .filter((r) => r.ruleType === 'TOPIC' && r.submissionType === 'APPLICATION')
                              .map((rule, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                                >
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {rule.name}
                                    </span>
                                    <span className="text-xs text-gray-500 block">
                                      {rule.description}
                                    </span>
                                  </div>
                                  <button
                                    className="btn bg-red-100 text-red-700 p-1 rounded"
                                    onClick={() =>
                                      handleRemoveRule(newType.rules?.indexOf(rule) || 0)
                                    }
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

                  {/* Staj Defteri Ekle */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Staj Defteri Belgeleri</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Staj sırasında öğrencinin teslim etmesi gereken belgeleri ekleyin:
                    </p>

                    <div className="space-y-6">
                      {/* Yeni Staj Defteri Belgesi Ekleme */}
                      <div className="border-t border-gray-200 pt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Yeni Staj Defteri Belgesi Ekle</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Belge Adı *
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                              placeholder="Örn: Haftalık Staj Raporu"
                              value={newSubmissionDocument.name}
                              onChange={(e) => setNewSubmissionDocument({ ...newSubmissionDocument, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Açıklama *
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                              placeholder="Belge hakkında açıklama"
                              value={newSubmissionDocument.description}
                              onChange={(e) =>
                                setNewSubmissionDocument({ ...newSubmissionDocument, description: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <button
                          className="btn bg-[#13126e] text-white px-4 py-2 rounded w-full mt-3"
                          onClick={handleAddSubmissionDocument}
                          type="button"
                          disabled={!newSubmissionDocument.name.trim() || !newSubmissionDocument.description.trim()}
                        >
                          <KeenIcon icon="plus" className="mr-2" />
                          Staj Defteri Belgesi Ekle
                        </button>
                      </div>
                    </div>

                    {newType.rules &&
                      newType.rules.filter((r) => r.ruleType === 'DOCUMENT' && r.submissionType === 'SUBMISSION').length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Seçilen Staj Defteri Belgeleri:</h5>
                          <div className="grid grid-cols-1 gap-2">
                            {newType.rules
                              .filter((r) => r.ruleType === 'DOCUMENT' && r.submissionType === 'SUBMISSION')
                              .map((rule, index) => (
                                <div
                                  key={`submission_rule_${index}`}
                                  className="flex items-center justify-between bg-blue-50 p-3 rounded border border-blue-200"
                                >
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">
                                      📖 {rule.name}
                                    </span>
                                    <span className="text-xs text-blue-600 block">
                                      Staj Defteri - {rule.description}
                                    </span>
                                  </div>
                                  <button
                                    className="btn bg-red-100 text-red-700 p-1 rounded"
                                    onClick={() =>
                                      handleRemoveRule(newType.rules?.indexOf(rule) || 0)
                                    }
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

              {/* Footer */}
              <div className="border-t border-gray-200 bg-white p-6 flex justify-end space-x-3">
                <button
                  className="btn bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  onClick={resetForm}
                >
                  İptal
                </button>
                {!editingType && (
                  <button
                    className="btn bg-[#13126e] text-white px-6 py-3 rounded-xl hover:bg-[#0f0e5a] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddType}
                    disabled={!newType.name || !newType.description}
                  >
                    <KeenIcon icon="plus" className="mr-2" />
                    Ekle
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detay Modalı */}
        <TypeDetailModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          type={selectedType}
          loading={loadingDetail}
        />
      </div>
    </Container>
  );
};

export default TypeManagement;
