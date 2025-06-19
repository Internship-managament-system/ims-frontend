import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getMyInternshipApplicationsList, 
  getInternshipApplicationDetailById,
  getInternshipDetail,
  uploadInternshipDocument,
  InternshipApplicationListItem,
  InternshipApplicationDetail,
  InternshipDetail
} from '@/services/internshipService';

// Staj defteri belgesi interface'i
interface SubmissionDocument {
  id: string;
  name: string;
  description: string;
  type?: string; // API'de "type" olarak geliyor
  ruleType?: string; // Backward compatibility
  submissionType?: string;
  status?: string; // API'den gelen tüm status değerlerini destekle
  fileName?: string;
  fileSize?: string;
  uploadDate?: string;
  rejectionReason?: string;
}

const NotebookUpload: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplicationDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submissionDocuments, setSubmissionDocuments] = useState<SubmissionDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  // Her başvuru için staj defteri durumunu sakla
  const [applicationNotebookStatus, setApplicationNotebookStatus] = useState<Record<string, string>>({});

  // API'den kullanıcının staj başvurularını çek
  const { data: applications = [], isLoading: applicationsLoading, error: applicationsError } = useQuery({
    queryKey: ['internshipApplicationsList'],
    queryFn: getMyInternshipApplicationsList
  });

  // Başvurular yüklendiğinde her birinin staj defteri durumunu kontrol et
  useEffect(() => {
    if (applications.length > 0) {
      applications.forEach(async (app) => {
        if (app.status === 'APPLICATION_APPROVED') {
          try {
            const detail = await getInternshipApplicationDetailById(app.id);
            const defterDocuments = detail.requirements?.filter(req => 
              req.ruleType === 'DOCUMENT' && 
              req.name && req.name.toUpperCase().includes('DEFTER')
            ) || [];
            
            if (defterDocuments.length === 0) {
              setApplicationNotebookStatus(prev => ({
                ...prev,
                [app.id]: 'NO_NOTEBOOK_REQUIRED'
              }));
            } else {
              const hasWaitingUpload = defterDocuments.some(doc => 
                doc.status === 'WAITING_FOR_UPLOAD' || !doc.status
              );
              const hasWaitingApproval = defterDocuments.some(doc => 
                doc.status === 'WAITING_FOR_APPROVAL'
              );
              const allApproved = defterDocuments.every(doc => 
                doc.status === 'APPROVED'
              );
              
              if (hasWaitingUpload) {
                setApplicationNotebookStatus(prev => ({
                  ...prev,
                  [app.id]: 'UPLOAD_REQUIRED'
                }));
              } else if (hasWaitingApproval) {
                setApplicationNotebookStatus(prev => ({
                  ...prev,
                  [app.id]: 'UNDER_REVIEW'
                }));
              } else if (allApproved) {
                setApplicationNotebookStatus(prev => ({
                  ...prev,
                  [app.id]: 'APPROVED'
                }));
              }
            }
          } catch (error) {
            console.error('Staj defteri durumu kontrol edilemedi:', error);
          }
        }
      });
    }
  }, [applications]);

  // Detay modalını aç
  const openDetailsModal = async (application: InternshipApplicationListItem) => {
    setLoadingDetail(true);
    setShowModal(true);
    try {
      console.log('🔍 Staj detay modal açılıyor, ID:', application.id);
      
      // 1. ApplicationDetail API'sinden başvuru detayını al
      const applicationDetail = await getInternshipApplicationDetailById(application.id);
      setSelectedApplication(applicationDetail);
      
      // 2. InternshipType API'sinden staj tipinin kurallarını al (SUBMISSION belgeler için)
      let internshipDetail: InternshipDetail | null = null;
      if (applicationDetail.internshipId) {
        try {
          console.log('🔍 InternshipType sorgulanıyor, internshipId:', applicationDetail.internshipId);
          internshipDetail = await getInternshipDetail(applicationDetail.internshipId);
          console.log('📦 InternshipType Response:', internshipDetail);
        } catch (error) {
          console.error('⚠️ InternshipType alınamadı:', error);
        }
      }
      
      // 3. Staj defteri belgelerini topla
      const submissionDocs: SubmissionDocument[] = [];
      
      // ApplicationDetail'dan DEFTER isimli belgeleri al
      const applicationRequirements = applicationDetail.requirements || [];
      const defterDocuments = applicationRequirements.filter(req => 
        req.ruleType === 'DOCUMENT' && 
        req.name && req.name.toUpperCase().includes('DEFTER')
      );
      
      // InternshipType'dan SUBMISSION belgelerini al
      const internshipRules = internshipDetail?.rules || [];
      const submissionRules = internshipRules.filter(rule => 
        rule.type === 'DOCUMENT' && 
        rule.submissionType === 'SUBMISSION'
      );
      
      console.log('📄 DEFTER belgeleri (ApplicationDetail):', defterDocuments);
      console.log('📄 SUBMISSION belgeleri (InternshipType):', submissionRules);
      
      // DEFTER belgelerini ekle
      defterDocuments.forEach(req => {
        submissionDocs.push({
          id: req.id,
          name: req.name,
          description: req.description,
          ruleType: req.ruleType,
          submissionType: 'SUBMISSION', // Manuel set et
          status: req.status || 'WAITING_FOR_UPLOAD',
          fileName: req.documents && req.documents.length > 0 ? req.documents[0].fileName : undefined,
          fileSize: req.documents && req.documents.length > 0 ? 'Yüklendi' : undefined,
          uploadDate: req.documents && req.documents.length > 0 ? new Date().toISOString() : undefined
        });
      });
      
      // SUBMISSION kurallarını ekle (eğer DEFTER'de yoksa)
      submissionRules.forEach(rule => {
        const existsInDefter = submissionDocs.some(doc => doc.name === rule.name);
        if (!existsInDefter) {
          submissionDocs.push({
            id: rule.id,
            name: rule.name,
            description: rule.description,
            type: rule.type,
            submissionType: rule.submissionType,
            status: 'WAITING_FOR_UPLOAD', // Default status
          });
        }
      });
      
      setSubmissionDocuments(submissionDocs);
      console.log('📖 Final Staj defteri belgeleri:', submissionDocs);
      
    } catch (error) {
      console.error('Başvuru detayı alınırken hata:', error);
      toast.error('Başvuru detayı alınamadı');
      setShowModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Modalı kapat
  const closeModal = () => {
    setSelectedApplication(null);
    setShowModal(false);
    setSubmissionDocuments([]);
    setSelectedFile(null);
    setUploadingFor(null);
  };

  // Status renkleri
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_UPLOADED':
      case 'WAITING_FOR_UPLOAD':
        return 'bg-yellow-100 text-yellow-800';
      case 'UPLOADED':
      case 'WAITING_FOR_APPROVAL':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
      case 'DENIED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NOT_UPLOADED':
      case 'WAITING_FOR_UPLOAD':
        return '📤 Yükleme Bekleniyor';
      case 'UPLOADED':
      case 'WAITING_FOR_APPROVAL':
        return '⏳ İnceleniyor';
      case 'APPROVED':
        return '✅ Onaylandı';
      case 'REJECTED':
      case 'DENIED':
        return '❌ Reddedildi';
      default:
        return status;
    }
  };

  // Dosya seçim işlemi
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // PDF kontrolü
      if (file.type !== 'application/pdf') {
        toast.error('Sadece PDF dosyaları yükleyebilirsiniz');
        return;
      }
      
      // Boyut kontrolü (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Dosya boyutu 10MB\'dan büyük olamaz');
        return;
      }
      
      setSelectedFile(file);
      setUploadingFor(documentId);
    }
  };

  // Dosya yükleme işlemi
  const handleUpload = async () => {
    if (!selectedFile || !uploadingFor || !selectedApplication) return;

    try {
      console.log('📤 Staj defteri yükleme başlatılıyor:', {
        applicationId: selectedApplication.id,
        requirementId: uploadingFor,
        fileName: selectedFile.name,
        fileSize: selectedFile.size
      });

      // Gerçek API ile dosya yükle
      await uploadInternshipDocument(
        selectedApplication.id,
        uploadingFor,
        selectedFile,
        selectedFile.name
      );

      // Başarılı toast
      toast.success('📖 Staj defteri belgesi başarıyla yüklendi!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
          fontWeight: '600',
          padding: '16px',
          borderRadius: '12px'
        }
      });

      // UI'ı güncelle
      setSubmissionDocuments(prev => prev.map(doc => 
        doc.id === uploadingFor 
          ? {
              ...doc,
              status: 'WAITING_FOR_APPROVAL',
              fileName: selectedFile.name,
              fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: new Date().toISOString().split('T')[0]
            }
          : doc
      ));

      // Ana listedeki durumu güncelle
      if (selectedApplication) {
        setApplicationNotebookStatus(prev => ({
          ...prev,
          [selectedApplication.id]: 'UNDER_REVIEW'
        }));
      }

      // Reset
      setSelectedFile(null);
      setUploadingFor(null);
      
      // Reset file input
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => input.value = '');

    } catch (error: any) {
      console.error('❌ Staj defteri yükleme hatası:', error);
      
      if (error.response) {
        const status = error.response.status;
        switch (status) {
          case 400:
            toast.error('Geçersiz dosya. Lütfen PDF formatında yükleyin.');
            break;
          case 413:
            toast.error('Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.');
            break;
          case 415:
            toast.error('Sadece PDF dosyaları yükleyebilirsiniz.');
            break;
          default:
            toast.error('Staj defteri yüklenirken hata oluştu.');
        }
      } else {
        toast.error('Staj defteri yüklenirken hata oluştu.');
      }
      
      // Reset
      setSelectedFile(null);
      setUploadingFor(null);
    }
  };

  // Başvuru durumu renkleri
  const getApplicationStatusColor = (status: string, applicationId: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'APPLICATION_APPROVED':
        const notebookStatus = applicationNotebookStatus[applicationId];
        switch (notebookStatus) {
          case 'UPLOAD_REQUIRED':
            return 'bg-orange-100 text-orange-800';
          case 'UNDER_REVIEW':
            return 'bg-blue-100 text-blue-800';
          case 'APPROVED':
          case 'NO_NOTEBOOK_REQUIRED':
            return 'bg-green-100 text-green-800';
          default:
            return 'bg-emerald-100 text-emerald-800'; // Loading durumu
        }
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusText = (status: string, applicationId: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Staj Tamamlandı';
      case 'IN_PROGRESS':
        return 'Staj Devam Ediyor';
      case 'APPLICATION_APPROVED':
        const notebookStatus = applicationNotebookStatus[applicationId];
        switch (notebookStatus) {
          case 'UPLOAD_REQUIRED':
            return '📖 Staj Defteri Yükleyin';
          case 'UNDER_REVIEW':
            return '⏳ Staj Defteri İnceleniyor';
          case 'APPROVED':
            return '✅ Başvuru Onaylandı';
          case 'NO_NOTEBOOK_REQUIRED':
            return '✅ Başvuru Onaylandı';
          default:
            return 'Başvuru Onaylandı'; // Loading durumu
        }
      default:
        return status;
    }
  };

  return (
    <Container className="min-h-screen bg-white">
      <div className="flex flex-col gap-5 lg:gap-7.5 pt-8 px-6">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Staj Defteri Yükleme</h1>
          <p className="text-sm text-gray-600">
            Onaylanmış stajlarınız için staj defteri belgelerinizi yükleyin.
          </p>
        </div>

        {/* Upload Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <KeenIcon icon="information" className="text-blue-600 text-lg mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Yükleme Talimatları</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Staj defteri belgeleri PDF formatında olmalıdır</li>
                <li>• Maksimum dosya boyutu: 10 MB</li>
                <li>• Dosya adı Türkçe karakter içermemelidir</li>
                <li>• Sadece onaylanmış veya devam eden stajlar için yükleme yapabilirsiniz</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Staj Başvurularım</h2>
            
            {applicationsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13126e]"></div>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <KeenIcon icon="book-open" className="text-4xl mx-auto" />
                </div>
                <p className="text-gray-500">Henüz staj başvurunuz bulunmamaktadır.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{application.internshipName}</h3>
                          <span className="text-sm text-gray-600">({application.companyName})</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(application.status, application.id)}`}>
                            {getApplicationStatusText(application.status, application.id)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>📅 Başvuru: {new Date(application.appliedDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {(application.status === 'APPLICATION_APPROVED' || 
                          application.status === 'IN_PROGRESS' || 
                          application.status === 'COMPLETED') ? (
                          <button
                            onClick={() => openDetailsModal(application)}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-[#13126e] hover:bg-[#0f0e5a] rounded transition-colors"
                          >
                            <KeenIcon icon="book" className="text-xs" />
                            Staj Defteri Yükle
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded">
                            Staj henüz onaylanmadı
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && uploadingFor && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <KeenIcon icon="check-circle" className="text-green-600 text-lg" />
              <div>
                <h3 className="font-medium text-green-900">Seçilen Dosya</h3>
                <p className="text-sm text-green-800">
                  {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Staj Defteri Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full relative border-2 border-[#13126e] max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#13126e] to-[#1f1e7e] text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <KeenIcon icon="book" className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Staj Defteri Yükleme</h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {selectedApplication?.internshipName} - {selectedApplication?.companyName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <KeenIcon icon="cross" className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {loadingDetail ? (
                <div className="flex flex-col items-center justify-center h-60">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#13126e]/20"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#13126e] absolute top-0 left-0"></div>
                  </div>
                  <span className="text-gray-600 mt-4 font-medium">Staj defteri belgeleri yükleniyor...</span>
                </div>
              ) : submissionDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <KeenIcon icon="book-open" className="text-6xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Staj Defteri Belgesi Bulunamadı
                  </h3>
                  <p className="text-gray-500">Bu staj için henüz staj defteri belgesi tanımlanmamış.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Staj Bilgileri</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Staj Türü:</span>
                        <span className="ml-2 font-medium">{selectedApplication?.internshipName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Firma:</span>
                        <span className="ml-2 font-medium">{selectedApplication?.companyName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Başlangıç:</span>
                        <span className="ml-2 font-medium">{selectedApplication?.startDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Bitiş:</span>
                        <span className="ml-2 font-medium">{selectedApplication?.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Staj Defteri Belgeleri</h3>
                    <div className="space-y-4">
                      {submissionDocuments.map((document) => (
                        <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-900">📖 {document.name}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status || 'NOT_UPLOADED')}`}>
                                  {getStatusText(document.status || 'NOT_UPLOADED')}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{document.description}</p>
                              
                              {document.fileName && (
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  <span>📄 {document.fileName}</span>
                                  <span>📊 {document.fileSize}</span>
                                  <span>📅 {new Date(document.uploadDate!).toLocaleDateString('tr-TR')}</span>
                                </div>
                              )}

                              {document.rejectionReason && (
                                <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
                                  <strong>Red Gerekçesi:</strong> {document.rejectionReason}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {(document.status === 'NOT_UPLOADED' || 
                                document.status === 'WAITING_FOR_UPLOAD' || 
                                document.status === 'REJECTED' || 
                                document.status === 'DENIED' ||
                                !document.status) ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleFileSelect(e, document.id)}
                                    className="hidden"
                                    id={`file-${document.id}`}
                                  />
                                  <label
                                    htmlFor={`file-${document.id}`}
                                    className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm text-[#13126e] hover:bg-[#13126e] hover:text-white border border-[#13126e] rounded transition-colors"
                                  >
                                    <KeenIcon icon="upload" className="text-xs" />
                                    Dosya Seç
                                  </label>
                                  {uploadingFor === document.id && selectedFile && (
                                    <button
                                      onClick={handleUpload}
                                      className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                                    >
                                      <KeenIcon icon="check" className="text-xs" />
                                      Yükle
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <button
                                  className="flex items-center gap-1 px-3 py-1 text-sm text-[#13126e] hover:bg-[#13126e] hover:text-white border border-[#13126e] rounded transition-colors"
                                >
                                  <KeenIcon icon="download" className="text-xs" />
                                  İndir
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-white p-6 flex justify-end">
              <button
                onClick={closeModal}
                className="btn bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default NotebookUpload; 