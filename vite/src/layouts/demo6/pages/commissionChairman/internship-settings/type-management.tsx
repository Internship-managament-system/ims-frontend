import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import axios from 'axios';
import { 
  getInternshipTopics,
} from '@/services/topicsService';
import { useQuery } from 'node_modules/@tanstack/react-query/build/modern/useQuery';
import { useToast } from '@/components/ui/use-toast';
import parse, { domToReact } from 'html-react-parser';

interface Rule {
  name: string;
  description: string;
  ruleType: string;
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

interface InternshipRuleDetail {
  name: string;
  description: string;
  type: string;
  documents: DocumentInfo[];
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
      toast({ title: "Hata", description: "Lütfen zorunlu alanları doldurun!", type: "error" });
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
        toast({ title: "Başarılı", description: "Staj türü başarıyla eklendi!", type: "success" });
      }
    } catch (error) {
      console.error('Staj türü eklenirken hata:', error);
      toast({ title: "Hata", description: "Staj türü eklenirken bir hata oluştu!", type: "error" });
    }
  };

  const handleEditType = (type: InternshipType) => {
    setEditingType(type);
    setNewType({ ...type });
    setShowAddModal(true);
  };

  const handleUpdateType = async () => {
    if (!editingType || !newType.name || !newType.description) {
      toast({ title: "Hata", description: "Lütfen zorunlu alanları doldurun!", type: "error" });
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
        toast({ title: "Başarılı", description: "Staj türü başarıyla güncellendi!", type: "success" });
      }
    } catch (error) {
      console.error('Staj türü güncellenirken hata:', error);
      toast({ title: "Hata", description: "Staj türü güncellenirken bir hata oluştu!", type: "error" });
    }
  };

  const handleDeleteType = async (id: string) => {
    if (window.confirm('Bu staj türünü silmek istediğinizden emin misiniz?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/internships/${id}`);

        if (response.status === 200) {
          await fetchInternshipTypes(); // Listeyi yenile
          toast({ title: "Başarılı", description: "Staj türü başarıyla silindi!", type: "success" });
        }
      } catch (error) {
        console.error('Staj türü silinirken hata:', error);
        toast({ title: "Hata", description: "Staj türü silinirken bir hata oluştu!", type: "error" });
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
          ruleType: 'TOPIC'
        }
      ]
    });
    setNewTopic({ name: '', description: '' });
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
    } catch (error) {
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
                return <ol className="list-decimal pl-6 space-y-1">{domToReact(domNode.children)}</ol>;
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
  const TypeDetailModal = ({ open, onClose, type, loading }: { open: boolean; onClose: () => void; type: any | null; loading: boolean }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative border-2 border-[#13126e] max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#13126e] flex items-center gap-2">
              <KeenIcon icon="briefcase" className="text-[#13126e] text-xl" />
              {type?.name || 'Staj Türü Detayı'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
              <KeenIcon icon="cross" className="text-2xl" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#13126e] mb-4"></div>
                <span className="text-gray-500">Yükleniyor...</span>
              </div>
            ) : type ? (
              <>
                <p className="text-gray-600 mb-4 text-lg">{type.description}</p>
                <div className="mb-6">
                  <span className="inline-block bg-[#13126e] text-white text-sm px-4 py-2 rounded-full font-semibold">
                    Süre: {type.durationOfDays} iş günü
                  </span>
                </div>
                {/* Kurallar */}
                {type.rules && type.rules.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">Kurallar</h4>
                    <ul className="space-y-4">
                      {type.rules.map((rule: any, idx: number) => (
                        <li key={idx} className="border-l-4 border-[#13126e] pl-4 py-2">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-semibold text-blue-900 text-base">{rule.name}</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">[{rule.type}]</span>
                          </div>
                          {rule.description && rule.description !== rule.name && (
                            <div className="text-gray-600 text-sm">
                              {renderDescription(rule.description)}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500">Detaylar yüklenemedi.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Staj Türü Yönetimi</h2>
              <p className="text-gray-600 mt-1">
                Staj türlerini ekleyin, düzenleyin ve ayarlarını yapın
              </p>
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
                    className="p-5 rounded-2xl border-2 border-[#13126e] bg-gradient-to-br from-[#f5f7fa] to-[#e9ecf8] shadow-md hover:shadow-xl transition-shadow cursor-pointer group relative"
                    onClick={() => handleTypeClick(type.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-[#13126e] group-hover:underline">{type.name}</h3>
                        </div>
                        <p className="text-gray-700 mb-4">{type.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {type.durationOfDays && (
                            <div>
                              <span className="text-sm font-medium text-[#13126e]">Süre (İş Günü):</span>
                              <p className="text-sm text-gray-700">{type.durationOfDays} gün</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4 z-10">
                        <button
                          className="btn bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200"
                          onClick={e => { e.stopPropagation(); handleEditType(type); }}
                          title="Düzenle"
                        >
                          <KeenIcon icon="pencil" />
                        </button>
                        <button
                          className="btn bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
                          onClick={e => { e.stopPropagation(); handleDeleteType(type.id); }}
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

        {/* Detay Modalı */}
        <TypeDetailModal open={detailModalOpen} onClose={() => setDetailModalOpen(false)} type={selectedType} loading={loadingDetail} />

        {/* Ekleme/Düzenleme Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingType ? 'Staj Türünü Düzenle' : 'Yeni Staj Türü Ekle'}
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600" onClick={resetForm}>
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
                            onChange={(e) =>
                              setNewType({ ...newType, description: e.target.value })
                            }
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
                        newType.rules.filter((r) => r.ruleType === 'DOCUMENT').length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Seçilen Belgeler:</h5>
                            <div className="grid grid-cols-1 gap-2">
                              {newType.rules
                                .filter((r) => r.ruleType === 'DOCUMENT')
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
                    <div className="bg-yellow-50 p-4 rounded-lg">
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
                                      (rule) =>
                                        rule.ruleType === 'TOPIC' &&
                                        rule.name === topic.title
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
                                            ruleType: 'TOPIC'
                                          }
                                        ]
                                      });
                                    } else {
                                      // Konuyu çıkar
                                      setNewType({
                                        ...newType,
                                        rules: currentRules.filter(
                                          (rule) =>
                                            !(
                                              rule.ruleType === 'TOPIC' &&
                                              rule.name === topic.title
                                            )
                                        )
                                      });
                                    }
                                  }}
                                />
                                <div className="flex-grow">
                                  <span className="text-sm font-medium text-gray-700">
                                    {topic.title}
                                  </span>
                                  <span className="text-xs text-gray-500 block">
                                    {topic.description}
                                  </span>
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
                        newType.rules.filter((r) => r.ruleType === 'TOPIC').length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Seçilen Konular:</h5>
                            <div className="grid grid-cols-1 gap-2">
                              {newType.rules
                                .filter((r) => r.ruleType === 'TOPIC')
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
                    disabled={!newType.name || !newType.description}
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
