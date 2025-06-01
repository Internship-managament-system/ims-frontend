import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import axios from 'axios';

interface Document {
  id: string;
  fileAddress: string;
  fileName: string;
  documentType: string;
  description: string;
  createdDate: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('all');

  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    fileName: '',
    documentType: '',
    description: '',
    createdDate: new Date().toISOString().split('T')[0]
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
      setDocuments(response.data.result || []);
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

  const handleAddDocument = async () => {
    if (!newDocument.fileName || selectedFileTypes.length === 0 || !selectedFile) {
      alert('Lütfen tüm zorunlu alanları doldurun, belge türü seçin ve dosya yükleyin!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const params = new URLSearchParams();
      params.append('fileName', newDocument.fileName);
      params.append('documentType', selectedFileTypes.join(','));
      if (newDocument.description) {
        params.append('description', newDocument.description);
      }

      const response = await axios.post(
        `${API_BASE_URL}/documents?${params.toString()}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        await fetchDocuments(); // Listeyi yenile
        resetForm();
        alert('Belge başarıyla yüklendi!');
      }
    } catch (error) {
      console.error('Belge yüklenirken hata:', error);
      alert('Belge yüklenirken bir hata oluştu!');
    }
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setNewDocument({...document});
    setSelectedFileTypes(document.documentType ? document.documentType.split(',') : []);
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
        alert('Belge başarıyla güncellendi!');
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
          alert('Belge başarıyla silindi!');
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
      link.download = document.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Belge indirilirken hata:', error);
      alert('Belge indirilirken bir hata oluştu!');
    }
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingDocument(null);
    setNewDocument({
      fileName: '',
      documentType: '',
      description: '',
      createdDate: new Date().toISOString().split('T')[0]
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Belge Yönetimi</h2>
              <p className="text-gray-600 mt-1">Staj süreciyle ilgili belgeleri yönetin</p>
            </div>
            <button 
              className="btn bg-[#13126e] text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <KeenIcon icon="plus" />
              <span>Yeni Belge Yükle</span>
            </button>
          </div>

          {/* Filtreler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
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
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
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
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                onClick={handleClearFilters}
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>

          {/* Belgeler Listesi */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13126e] mx-auto mb-4"></div>
                <p className="text-gray-500">Belgeler yükleniyor...</p>
              </div>
            ) : (
              <>
                {getPaginatedDocuments().map((document) => (
                  <div key={document.id} className="p-5 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4 flex-grow">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <KeenIcon icon={getFileIcon(document.fileName)} className="text-2xl text-blue-600" />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{document.fileName}</h3>
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {document.documentType}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{document.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Yüklenme Tarihi:</span>
                              <span className="ml-2">{new Date(document.createdDate).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div>
                              <span className="font-medium">Dosya Yolu:</span>
                              <span className="ml-2 text-xs">{document.fileAddress}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button 
                          className="btn bg-green-100 text-green-700 p-2 rounded hover:bg-green-200"
                          onClick={() => handleDownloadDocument(document)}
                          title="İndir"
                        >
                          <KeenIcon icon="download" />
                        </button>
                        <button 
                          className="btn bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200"
                          onClick={() => handleEditDocument(document)}
                          title="Düzenle"
                        >
                          <KeenIcon icon="pencil" />
                        </button>
                        <button 
                          className="btn bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
                          onClick={() => handleDeleteDocument(document.id)}
                          title="Sil"
                        >
                          <KeenIcon icon="trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && getPaginatedDocuments().length === 0 && (
                  <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                    <KeenIcon icon="file" className="text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500">
                      {getFilteredDocuments().length === 0 ? 'Henüz belge yüklenmemiş.' : 'Bu sayfa için belge bulunamadı.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination */}
          {getTotalPages() > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Toplam {getFilteredDocuments().length} belgeden {' '}
                  {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getFilteredDocuments().length)} arası gösteriliyor
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
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
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingDocument ? 'Belgeyi Düzenle' : 'Yeni Belge Yükle'}
                  </h3>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={resetForm}
                  >
                    <KeenIcon icon="cross" className="text-xl" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Dosya Seçimi */}
                  {!editingDocument && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosya Seçin *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#13126e] transition-colors">
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
                          <KeenIcon icon="cloud-upload" className="text-4xl text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-600">
                            {selectedFile ? selectedFile.name : 'Dosya seçmek için tıklayın'}
                          </span>
                          {selectedFile && (
                            <span className="text-xs text-gray-500 mt-1">
                              {formatFileSize(selectedFile.size)}
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Dosya Adı */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosya Adı *
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                      placeholder="Örn: staj-beyanname.pdf"
                      value={newDocument.fileName || ""}
                      onChange={(e) => setNewDocument({...newDocument, fileName: e.target.value})}
                    />
                  </div>

                  {/* Belge Türü */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Belge Türü *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {documentTypes.map((type) => (
                        <label key={type} className="flex items-center p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 mr-2"
                            checked={selectedFileTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFileTypes([...selectedFileTypes, type]);
                              } else {
                                setSelectedFileTypes(selectedFileTypes.filter(t => t !== type));
                              }
                            }}
                          />
                          <span className="text-xs text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                    {selectedFileTypes.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <span className="text-xs text-blue-800">
                          Seçilen türler: {selectedFileTypes.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Açıklama */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                      rows={3}
                      placeholder="Belge hakkında açıklama..."
                      value={newDocument.description || ""}
                      onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                    />
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
                    onClick={editingDocument ? handleUpdateDocument : handleAddDocument}
                  >
                    {editingDocument ? 'Güncelle' : 'Yükle'}
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

export default Documents; 