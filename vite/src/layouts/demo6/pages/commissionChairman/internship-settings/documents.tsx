import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

interface Document {
  id: string;
  description?: string;
  fileAddress?: string;
  fileName?: string;
  documentType?: string;
}

// Onay Modalı
const ConfirmModal = ({ open, onConfirm, onCancel, message }: { open: boolean; onConfirm: () => void; onCancel: () => void; message: string }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] border-2 border-red-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-xl">
            <KeenIcon icon="warning" className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Silme Onayı</h3>
        </div>
        <p className="mb-6 text-gray-700 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel} 
            className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-200"
          >
            İptal
          </button>
          <button 
            onClick={onConfirm} 
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <KeenIcon icon="trash" />
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

const Documents: React.FC = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);

  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    fileName: '',
    documentType: '',
    description: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewDocument, setViewDocument] = useState<Document | null>(null);

  // API Base URL
  const API_BASE_URL = '/api/v1';

  // Desteklenen belge türleri (dosya uzantıları)
  const documentTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];

  // Belgeleri yükle
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/documents`);
      setDocuments(response.data.result || response.data || []);
    } catch (error) {
      console.error('Belgeler yüklenirken hata:', error);
      toast({ title: "Hata", description: "Belgeler yüklenirken bir hata oluştu!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda belgeleri yükle
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Dosya adını temizleme fonksiyonu
  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .replace(/[çÇ]/g, 'c')
      .replace(/[ğĞ]/g, 'g')
      .replace(/[ıI]/g, 'i')
      .replace(/[öÖ]/g, 'o')
      .replace(/[şŞ]/g, 's')
      .replace(/[üÜ]/g, 'u')
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Diğer özel karakterleri underscore yap
      .replace(/_+/g, '_') // Birden fazla underscore'u tek yap
      .replace(/^_|_$/g, ''); // Başta ve sondaki underscore'ları kaldır
  };

  const handleAddDocument = async () => {
    if (!newDocument.fileName || selectedFileTypes.length === 0 || !selectedFile) {
      toast({ title: "Hata", description: "Lütfen tüm zorunlu alanları doldurun, belge türü seçin ve dosya yükleyin!", type: "error" });
      return;
    }

    const formData = new FormData();
    
    // Dosya adını temizle
    const sanitizedFileName = sanitizeFileName(newDocument.fileName);
    
    // Yeni dosya objesi oluştur (temizlenmiş adla)
    const cleanFile = new File([selectedFile], sanitizedFileName, {
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
    });
    
    // Sadece dosyayı FormData'ya ekle
    formData.append('file', cleanFile);
    
    // Query parameters (Swagger'daki gibi)
    const params = new URLSearchParams();
    params.append('fileName', sanitizedFileName);
    params.append('documentType', selectedFileTypes.join(','));
    if (newDocument.description) {
      params.append('description', newDocument.description);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/documents?${params.toString()}`, 
        formData
      );

      if (response.status === 200 || response.status === 201) {
        await fetchDocuments();
        resetForm();
        toast({ title: "Başarılı", description: "Belge başarıyla yüklendi!", type: "success" });
      }
    } catch (error: any) {
      console.error('❌ Upload Error:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      toast({ title: "Hata", description: error.response?.data?.message || error.message, type: "error" });
    }
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setNewDocument({...document});
    // Güvenli split işlemi
    const docType = document.documentType || '';
    setSelectedFileTypes(docType ? docType.split(',').filter(Boolean) : []);
    setShowAddModal(true);
  };

  const handleUpdateDocument = async () => {
    if (!editingDocument || !newDocument.fileName || selectedFileTypes.length === 0) {
      toast({ title: "Hata", description: "Lütfen zorunlu alanları doldurun ve belge türü seçin!", type: "error" });
      return;
    }

    try {
      const updateData = {
        fileName: newDocument.fileName,
        documentType: selectedFileTypes.join(','),
        description: newDocument.description || ''
      };

      const response = await axios.put(
        `${API_BASE_URL}/documents/${editingDocument.id}`, 
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        await fetchDocuments(); // Listeyi yenile
        resetForm();
        toast({ title: "Başarılı", description: "Belge başarıyla güncellendi!", type: "success" });
      }
    } catch (error) {
      console.error('Belge güncellenirken hata:', error);
      toast({ title: "Hata", description: "Belge güncellenirken bir hata oluştu!", type: "error" });
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/documents/${deleteId}`);
      if (response.status === 200) {
        await fetchDocuments();
        toast({ title: "Başarılı", description: "Belge başarıyla silindi!", type: "success" });
      }
    } catch (error) {
      console.error('Belge silinirken hata:', error);
      toast({ title: "Hata", description: "Belge silinirken bir hata oluştu!", type: "error" });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleDownloadDocument = async (document: Document) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents/${document.id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement('a');
      link.href = url;
      link.download = getDisplayFileName(document).replace('Dosya adı belirtilmemiş', 'belge');
      link.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "Başarılı", description: "Belge başarıyla indirildi!", type: "success" });
    } catch (error) {
      console.error('Belge indirilirken hata:', error);
      toast({ title: "Hata", description: "Belge indirilirken bir hata oluştu!", type: "error" });
    }
  };

  // Dosyayı görüntüle - file:// protokolünü HTTP'ye çevir
  const handleViewDocument = (document: Document) => {
    setViewDocument(document);
    setViewModalOpen(true);
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingDocument(null);
    setNewDocument({
      fileName: '',
      documentType: '',
      description: ''
    });
    setSelectedFile(null);
    setSelectedFileTypes([]);
  };

  const getFilteredDocuments = () => {
    // Filtreleme artık API tarafında yapılıyor
    return documents;
  };

  const getPaginatedDocuments = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return getFilteredDocuments().slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredDocuments().length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getFileIcon = (fileName: string) => {
    if (!fileName) return 'file';
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'file-pdf';
      case 'doc':
      case 'docx': return 'file-doc';
      case 'xls':
      case 'xlsx': return 'file-xls';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'file-image';
      default: return 'file';
    }
  };

  const getFileIconColor = (fileName: string) => {
    if (!fileName) return 'text-gray-600 bg-gray-50';
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'text-red-600 bg-red-50';
      case 'doc':
      case 'docx': return 'text-blue-600 bg-blue-50';
      case 'xls':
      case 'xlsx': return 'text-green-600 bg-green-50';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper fonksiyonlar API format compatibility için
  const getDisplayFileName = (document: Document) => {
    return document.fileName || 'Dosya adı belirtilmemiş';
  };

  const getDisplayFileAddress = (document: Document) => {
    return document.fileAddress || 'Dosya yolu belirtilmemiş';
  };

  const getDisplayDocumentType = (document: Document) => {
    return document.documentType || 'Tür belirtilmemiş';
  };

  // Belge görüntüleme modalı
  const DocumentViewModal = ({ open, onClose, document }: { open: boolean; onClose: () => void; document: Document | null }) => {
    if (!open || !document) return null;
    let fileAddress = document.fileAddress || '';
    let httpUrl = fileAddress;
    if (!fileAddress.startsWith('C:/')) {
      httpUrl = `${API_BASE_URL}/documents/${document.id}`;
    }
    const ext = (document.fileName || '').split('.').pop()?.toLowerCase();
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full relative border-2 border-[#13126e] max-h-[90vh] overflow-hidden flex flex-col m-4">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#13126e] to-[#1f1e7e] text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <KeenIcon icon="eye" className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{document.fileName}</h2>
                  <p className="text-blue-100 text-sm mt-1">Belge Önizleme</p>
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
          
          {/* Content */}
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
            {ext === 'pdf' ? (
              <iframe src={httpUrl} title="Belge" className="w-full h-full rounded-xl border border-gray-200 bg-white" />
            ) : ext === 'jpg' || ext === 'jpeg' || ext === 'png' ? (
              <img src={httpUrl} alt={document.fileName} className="max-h-full max-w-full rounded-xl border border-gray-200 shadow-lg" />
            ) : (
              <div className="text-center p-8">
                <div className="p-4 bg-[#13126e]/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <KeenIcon icon="document" className="text-4xl text-[#13126e]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Önizleme Mevcut Değil</h3>
                <p className="text-gray-600 mb-4">Bu dosya türü için önizleme desteklenmiyor.</p>
                <a 
                  href={httpUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-[#13126e] text-white px-6 py-3 rounded-xl hover:bg-[#0f0e5a] transition-colors duration-200 font-medium"
                >
                  <KeenIcon icon="external-link" />
                  Belgeyi Yeni Sekmede Aç
                </a>
              </div>
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
              <h2 className="text-2xl font-bold text-gray-900">Belge Yönetimi</h2>
              <p className="text-gray-600 mt-1">Staj süreciyle ilgili belgeleri yönetin</p>
            </div>
            <button 
              className="btn bg-[#13126e] text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-[#0f0f5a] transition-colors shadow-lg"
              onClick={() => setShowAddModal(true)}
            >
              <KeenIcon icon="plus" />
              <span>Yeni Belge Yükle</span>
            </button>
          </div>

          {/* Belgeler Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#13126e] mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Belgeler yükleniyor...</p>
              </div>
            ) : (
              <>
                {getPaginatedDocuments().map((document) => (
                  <div
                    key={document.id}
                    className="bg-white border-2 border-[#13126e]/20 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col min-h-[260px]"
                  >
                    {/* Belge Header */}
                    <div className="p-5 bg-gradient-to-r from-[#13126e] to-[#3a3a8e]">
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-bold text-white truncate" title={getDisplayFileName(document)}>
                          {getDisplayFileName(document)}
                        </span>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-white/80 text-[#13126e] w-fit">
                          {getDisplayDocumentType(document)}
                        </span>
                      </div>
                    </div>

                    {/* Belge İçeriği */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[#13126e] mb-1">Açıklama</h4>
                        <p className="text-gray-700 text-sm leading-relaxed min-h-[40px]">
                          {document.description || 'Açıklama eklenmemiş.'}
                        </p>
                      </div>
                    </div>

                    {/* Belge Eylemler */}
                    <div className="px-5 py-3 bg-[#f5f7fa] border-t border-[#13126e]/10 flex justify-between items-center">
                      <button
                        onClick={() => handleViewDocument(document)}
                        className="flex items-center gap-2 text-[#13126e] hover:text-[#0f0f5a] font-semibold text-sm transition-colors"
                      >
                        <KeenIcon icon="eye" className="text-base" />
                        Görüntüle
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                          onClick={() => handleDownloadDocument(document)}
                          title="İndir"
                        >
                          <KeenIcon icon="arrow-down" className="text-base" />
                        </button>
                        <button
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          onClick={() => handleEditDocument(document)}
                          title="Düzenle"
                        >
                          <KeenIcon icon="pencil" className="text-base" />
                        </button>
                        <button
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          onClick={() => handleDeleteDocument(document.id)}
                          title="Sil"
                        >
                          <KeenIcon icon="trash" className="text-base" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && getPaginatedDocuments().length === 0 && (
                  <div className="col-span-full text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                    <KeenIcon icon="folder-minus" className="text-6xl text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belge Bulunamadı</h3>
                    <p className="text-gray-500">
                      {getFilteredDocuments().length === 0 ? 'Henüz belge yüklenmemiş.' : 'Bu filtrelere uygun belge bulunamadı.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination */}
          {getTotalPages() > 1 && (
            <div className="mt-8 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Toplam {getFilteredDocuments().length} belgeden {' '}
                  {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getFilteredDocuments().length)} arası gösteriliyor
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <KeenIcon icon="left" className="text-sm" />
                </button>

                {Array.from({ length: getTotalPages() }, (_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
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

                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
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
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative border-2 border-[#13126e] max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#13126e] to-[#1f1e7e] text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <KeenIcon icon={editingDocument ? "pencil" : "plus"} className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {editingDocument ? 'Belgeyi Düzenle' : 'Yeni Belge Yükle'}
                      </h2>
                      <p className="text-blue-100 text-sm mt-1">
                        {editingDocument ? 'Mevcut belgeyi güncelleyin' : 'Sisteme yeni bir belge yükleyin'}
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
                {/* Dosya Seçimi */}
                {!editingDocument && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Dosya Seçin *
                    </label>
                    <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                      <strong>Uyarı:</strong> Dosya adında Türkçe karakter kullanmayın. Sistem otomatik olarak temizleyecektir.
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#13126e] transition-colors">
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setNewDocument({...newDocument, fileName: file.name});
                          }
                        }}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <KeenIcon icon="cloud-upload" className="text-5xl text-gray-400 mb-3" />
                        <span className="text-lg font-medium text-gray-600 mb-2">
                          {selectedFile ? selectedFile.name : 'Dosya seçmek için tıklayın'}
                        </span>
                        {selectedFile && (
                          <span className="text-sm text-gray-500">
                            {formatFileSize(selectedFile.size)}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {/* Dosya Adı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dosya Adı *
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                    placeholder="Dosya adını girin"
                    value={newDocument.fileName || ""}
                    onChange={(e) => setNewDocument({...newDocument, fileName: e.target.value})}
                  />
                </div>

                {/* Belge Türleri Seçimi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Belge Türleri * (Birden fazla seçebilirsiniz)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {documentTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="mr-3 h-4 w-4 text-[#13126e] focus:ring-[#13126e] border-gray-300 rounded"
                          checked={selectedFileTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFileTypes([...selectedFileTypes, type]);
                            } else {
                              setSelectedFileTypes(selectedFileTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <span className="text-sm font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Açıklama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Açıklama
                  </label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                    rows={4}
                    placeholder="Belge hakkında açıklama..."
                    value={newDocument.description || ""}
                    onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                  />
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
                <button
                  className="btn bg-[#13126e] text-white px-6 py-3 rounded-xl hover:bg-[#0f0e5a] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={editingDocument ? handleUpdateDocument : handleAddDocument}
                >
                  <KeenIcon icon={editingDocument ? "check" : "upload"} className="mr-2" />
                  {editingDocument ? 'Güncelle' : 'Yükle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onay Modalı */}
        <ConfirmModal open={confirmOpen} onConfirm={confirmDelete} onCancel={cancelDelete} message="Bu belgeyi silmek istediğinizden emin misiniz?" />

        {/* Belge görüntüleme modalı */}
        <DocumentViewModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} document={viewDocument} />
      </div>
    </Container>
  );
};

export default Documents; 