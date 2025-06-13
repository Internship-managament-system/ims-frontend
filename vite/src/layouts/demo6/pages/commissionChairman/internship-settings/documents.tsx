import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import axios from 'axios';

interface Document {
  id: string;
  description?: string;
  fileAddress?: string;
  fileName?: string;
  documentType?: string;
}

// Success Toast Component
const SuccessToast = ({ show, onClose, message }: { show: boolean; onClose: () => void; message: string }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
        <KeenIcon icon="check-circle" className="text-2xl" />
        <div className="flex-1">
          <p className="font-medium">Başarılı!</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button onClick={onClose} className="text-white hover:bg-green-600 rounded p-1">
          <KeenIcon icon="cross" className="text-lg" />
        </button>
      </div>
    </div>
  );
};

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('all');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    fileName: '',
    documentType: '',
    description: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);

  // API Base URL
  const API_BASE_URL = '/api/v1';

  // Desteklenen belge türleri (dosya uzantıları)
  const documentTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];

  // Belgeleri yükle
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('fileName', searchTerm);
      }
      if (selectedDocumentType !== 'all') {
        params.append('documentType', selectedDocumentType);
      }
      if (searchTerm) {
        params.append('description', searchTerm);
      }

      const response = await axios.get(`${API_BASE_URL}/documents?${params.toString()}`);
      setDocuments(response.data.result || response.data || []);
    } catch (error) {
      console.error('Belgeler yüklenirken hata:', error);
      alert('Belgeler yüklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda belgeleri yükle
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Arama ve filtre değişikliklerinde yeniden yükle
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDocuments();
      setCurrentPage(1);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedDocumentType]);

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
      alert('Lütfen tüm zorunlu alanları doldurun, belge türü seçin ve dosya yükleyin!');
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
        setShowSuccessToast(true);
        setToastMessage('Belge başarıyla yüklendi!');
      }
    } catch (error: any) {
      console.error('❌ Upload Error:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      alert(`Hata: ${error.response?.data?.message || error.message}`);
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
      alert('Lütfen zorunlu alanları doldurun ve belge türü seçin!');
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
        setShowSuccessToast(true);
        setToastMessage('Belge başarıyla güncellendi!');
      }
    } catch (error) {
      console.error('Belge güncellenirken hata:', error);
      alert('Belge güncellenirken bir hata oluştu!');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm("Bu belgeyi silmek istediğinizden emin misiniz?")) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/documents/${id}`);
        
        if (response.status === 200) {
          await fetchDocuments(); // Listeyi yenile
          setShowSuccessToast(true);
          setToastMessage('Belge başarıyla silindi!');
        }
      } catch (error) {
        console.error('Belge silinirken hata:', error);
        alert('Belge silinirken bir hata oluştu!');
      }
    }
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
    } catch (error) {
      console.error('Belge indirilirken hata:', error);
      alert('Belge indirilirken bir hata oluştu!');
    }
  };

  // Dosyayı görüntüle - file:// protokolünü HTTP'ye çevir
  const handleViewDocument = (document: Document) => {
    let fileAddress = document.fileAddress;
    
    if (fileAddress && fileAddress.trim()) {
      // file:/// protokolünü çıkar
      if (fileAddress.startsWith('file:///')) {
        fileAddress = fileAddress.replace('file:///', '');
      }
      
      // Backend server üzerinden dosyayı serve et
      // Path'i temizle
      const cleanPath = fileAddress.replace(/^[A-Z]:/, '').replace(/\\/g, '/');
      
      // Backend'de static file serving endpoint'i kullan
      const httpUrl = `${window.location.origin}${cleanPath}`;
      
      window.open(httpUrl, '_blank');
    } else {
      alert('Dosya yolu bulunamadı!');
    }
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDocumentType('all');
    setCurrentPage(1);
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

          {/* Filtreler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                  placeholder="Dosya adı, tür veya açıklama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <KeenIcon icon="magnifier" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Belge Türü</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                value={selectedDocumentType}
                onChange={(e) => setSelectedDocumentType(e.target.value)}
              >
                <option value="all">Tümü</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={handleClearFilters}
              >
                Filtreleri Temizle
              </button>
            </div>
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
                  <div key={document.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                    {/* Belge Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getFileIconColor(getDisplayFileName(document))}`}>
                          <KeenIcon icon={getFileIcon(getDisplayFileName(document))} className="text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => handleViewDocument(document)}
                            className="text-base font-semibold text-gray-900 hover:text-[#13126e] transition-colors truncate block w-full text-left cursor-pointer group-hover:text-[#13126e]"
                            title="Belgeyi yeni sekmede aç"
                          >
                            {getDisplayFileName(document)}
                          </button>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {getDisplayDocumentType(document)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Belge İçeriği */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Açıklama</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {document.description || 'Açıklama eklenmemiş.'}
                        </p>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Dosya Yolu</h4>
                        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded break-all">
                          {getDisplayFileAddress(document)}
                        </p>
                      </div>
                    </div>

                    {/* Belge Eylemler */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => handleViewDocument(document)}
                          className="flex items-center gap-2 text-[#13126e] hover:text-[#0f0f5a] font-medium text-sm transition-colors"
                        >
                          <KeenIcon icon="eye" className="text-sm" />
                          Görüntüle
                        </button>
                        
                        <div className="flex items-center gap-1">
                          <button 
                            className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center justify-center"
                            onClick={() => handleDownloadDocument(document)}
                            title="İndir"
                          >
                            <KeenIcon icon="arrow-down" className="text-sm" />
                          </button>
                          <button 
                            className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            onClick={() => handleEditDocument(document)}
                            title="Düzenle"
                          >
                            <KeenIcon icon="pencil" className="text-sm" />
                          </button>
                          <button 
                            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            onClick={() => handleDeleteDocument(document.id)}
                            title="Sil"
                          >
                            <KeenIcon icon="trash" className="text-sm" />
                          </button>
                        </div>
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-6 border w-full max-w-2xl shadow-xl rounded-xl bg-white m-4">
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingDocument ? 'Belgeyi Düzenle' : 'Yeni Belge Yükle'}
                  </h3>
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-2"
                    onClick={resetForm}
                  >
                    <KeenIcon icon="cross" className="text-xl" />
                  </button>
                </div>
              </div>
              
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

                {/* Modal Butonları */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    onClick={resetForm}
                  >
                    İptal
                  </button>
                  <button
                    className="flex-1 bg-[#13126e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0f0f5a] transition-colors"
                    onClick={editingDocument ? handleUpdateDocument : handleAddDocument}
                  >
                    {editingDocument ? 'Güncelle' : 'Yükle'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        <SuccessToast 
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          message={toastMessage}
        />
      </div>
    </Container>
  );
};

export default Documents; 