import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getMyInternshipApplicationsList, 
  getInternshipApplicationDetailById,
  uploadInternshipDocument,
  InternshipApplicationListItem,
  InternshipApplicationDetail 
} from '@/services/internshipService';
import { Link, useNavigate } from 'react-router-dom';

// Topic açıklamalarını düzgün formatta render eden component
const TopicDescriptionRenderer: React.FC<{ description: string }> = ({ description }) => {
  // HTML taglerini parse et ve düzgün formatta göster
  const parseHTMLContent = (content: string) => {
    if (!content) return null

    // Basit HTML temizleme ve dönüştürme
    let cleanContent = content
      .replace(/<\/?(p|div|span)[^>]*>/gi, '') // p, div, span taglerini kaldır
      .replace(/<br\s*\/?>/gi, '\n') // br taglerini yeni satır yap
      .replace(/&nbsp;/gi, ' ') // Non-breaking space'leri normal space yap
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&amp;/gi, '&')
      .trim()

    // Liste öğelerini yakala
    const listItems = cleanContent.match(/<li[^>]*>(.*?)<\/li>/gi)
    const hasOrderedList = /<ol[^>]*>/i.test(content)
    const hasUnorderedList = /<ul[^>]*>/i.test(content)

    if (listItems) {
      // Liste öğelerini temizle
      const items = listItems.map(item => 
        item.replace(/<\/?li[^>]*>/gi, '').trim()
      )

      return (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className={`inline-block w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5 ${
                hasOrderedList ? 'bg-blue-600' : 'bg-indigo-600'
              }`}>
                {hasOrderedList ? index + 1 : '•'}
              </span>
              <span className="flex-1 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      )
    }

    // Eğer liste yoksa normal paragraf olarak göster ama satır sonlarını koru
    const paragraphs = cleanContent.split('\n').filter(p => p.trim())
    
    return (
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">{paragraph}</p>
        ))}
      </div>
    )
  }

  return <div>{parseHTMLContent(description)}</div>
}

// Yeni başvuru durumu için renk ve etiket bilgileri
const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Onaylandı', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
  COMPLETED: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800' },
  READY_FOR_ASSIGNMENT: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  ASSIGNED: { label: 'Onaylandı', color: 'bg-indigo-100 text-indigo-800' },
  IN_PROGRESS: { label: 'Devam Ediyor', color: 'bg-orange-100 text-orange-800' },
};

const MyApplicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplicationDetail | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Öğrencinin kendi başvurularını getir (YENİ API)
  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ['internship-applications-list'],
    queryFn: getMyInternshipApplicationsList
  });

  // Hata durumunda kullanıcıya bildir
  useEffect(() => {
    if (isError) {
      toast.error('Staj başvurularınız yüklenirken bir hata oluştu.');
    }
  }, [isError]);

  // Detay modalını aç (API'den detayları getir)
  const openDetailsModal = async (application: InternshipApplicationListItem) => {
    try {
      const details = await getInternshipApplicationDetailById(application.id);
      setSelectedApplication(details);
      setShowDetailsModal(true);
    } catch (error) {
      toast.error('Başvuru detayları yüklenirken hata oluştu.');
    }
  };

  // Modalı kapat
  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedApplication(null);
  };

  // Arama filtreleme
  const filteredApplications = applications.filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.companyName.toLowerCase().includes(searchLower) ||
      app.internshipName.toLowerCase().includes(searchLower) ||
      app.status.toLowerCase().includes(searchLower) ||
      (statusConfig[app.status]?.label || '').toLowerCase().includes(searchLower)
    );
  });

  // Document yükleme fonksiyonu
  const handleDocumentUpload = async (requirementId: string, file: File) => {
    if (!selectedApplication) return;

    const uploadKey = `${selectedApplication.id}-${requirementId}`;
    setUploadingDocuments(prev => new Set([...prev, uploadKey]));

    try {
      await uploadInternshipDocument(
        selectedApplication.id,
        requirementId,
        file,
        file.name
      );

      toast.success('Belge başarıyla yüklendi!');
      
      // Detay verisini yenile
      queryClient.invalidateQueries({ 
        queryKey: ['internship-application-detail', selectedApplication.id] 
      });
      
      // Modal'ı yeniden aç (güncel veriyle)
      const updatedDetail = await getInternshipApplicationDetailById(selectedApplication.id);
      setSelectedApplication(updatedDetail);

    } catch (error) {
      console.error('Document upload error:', error);
      toast.error('Belge yüklenirken bir hata oluştu');
    } finally {
      setUploadingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadKey);
        return newSet;
      });
    }
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Staj Başvurularım</h2>
            <Link to="/student/application-form">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Yeni Başvuru
              </button>
            </Link>
          </div>

          <div className="mb-4 flex justify-end">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Başvuru ara..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-10 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : isError ? (
              <div className="py-10 text-center text-red-500">
                <p>Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Başvuru Tarihi</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Adı</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Şirket</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                        Henüz staj başvurunuz bulunmamaktadır
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((application) => (
                      <tr key={application.id} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(application.appliedDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                          {application.internshipName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {application.companyName}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              statusConfig[application.status]?.color || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {statusConfig[application.status]?.label || application.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm flex gap-2">
                          <button
                            className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                            onClick={() => openDetailsModal(application)}
                          >
                            Detay
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detay Modalı - YENİ API İLE */}
        {showDetailsModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-[#13126e] to-[#1f1e7e]">
                <div className="flex items-center gap-3">
                  <KeenIcon icon="briefcase" className="text-white text-2xl" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Staj Başvurusu Detayı</h3>
                    <p className="text-blue-100 text-sm">{selectedApplication.companyName}</p>
                  </div>
                </div>
                <button className="text-white hover:text-blue-200 transition-colors" onClick={closeModal}>
                  <KeenIcon icon="cross" className="text-2xl" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">

              <div className="space-y-6">
                {/* Başvuru Durumu */}
                <div>
                  <h4 className="text-md font-medium mb-2">Başvuru Durumu</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        statusConfig[selectedApplication.status]?.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusConfig[selectedApplication.status]?.label || selectedApplication.status}
                    </span>
                  </div>
                </div>

                {/* Genel Bilgiler */}
                <div>
                  <h4 className="text-md font-medium mb-2">Genel Bilgiler</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Staj Adı</p>
                      <p>{selectedApplication.internshipName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Şirket</p>
                      <p>{selectedApplication.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Başlangıç Tarihi</p>
                      <p>{new Date(selectedApplication.startDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bitiş Tarihi</p>
                      <p>{new Date(selectedApplication.endDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Staj Türü</p>
                      <p>{selectedApplication.type === 'VOLUNTARY' ? 'Gönüllü' : 'Zorunlu'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sağlık Sigortası</p>
                      <p>{selectedApplication.hasGeneralHealthInsurance ? 'Var' : 'Yok'}</p>
                    </div>
                  </div>
                </div>

                {/* Öğrenci Bilgileri */}
                <div>
                  <h4 className="text-md font-medium mb-2">Öğrenci Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
                      <p>{selectedApplication.studentName} {selectedApplication.studentSurname}</p>
                    </div>
                  </div>
                </div>

                {/* Document Requirements */}
                {selectedApplication.requirements && selectedApplication.requirements.filter(req => req.ruleType === 'DOCUMENT').length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <KeenIcon icon="folder" className="text-[#13126e] text-xl" />
                      <h4 className="text-lg font-semibold text-gray-900">Belge Gereksinimleri</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedApplication.requirements
                        .filter(req => req.ruleType === 'DOCUMENT')
                        .map((requirement) => (
                        <div key={requirement.id} className="bg-white border-2 border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <KeenIcon icon="document" className="text-[#13126e] text-lg" />
                              <h5 className="font-semibold text-gray-900">{requirement.name}</h5>
                            </div>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                requirement.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-800'
                                  : requirement.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : requirement.status === 'WAITING_FOR_UPLOAD'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {requirement.status === 'WAITING_FOR_UPLOAD' ? 'Yükleme Bekleniyor' :
                               requirement.status === 'APPROVED' ? 'Onaylandı' :
                               requirement.status === 'REJECTED' ? 'Reddedildi' : requirement.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{requirement.description}</p>
                          
                          {/* Upload Section */}
                          <div className="border-t border-gray-100 pt-4">
                            <div className="flex flex-col gap-3">
                              <label className="text-sm font-medium text-gray-700">
                                📤 Belge Yükle:
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleDocumentUpload(requirement.id, file);
                                    }
                                  }}
                                  className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#13126e] file:text-white hover:file:bg-[#1f1e7e] file:transition-colors file:cursor-pointer"
                                  disabled={uploadingDocuments.has(`${selectedApplication.id}-${requirement.id}`)}
                                />
                                {uploadingDocuments.has(`${selectedApplication.id}-${requirement.id}`) && (
                                  <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                                    Yükleniyor...
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Uploaded Documents */}
                            {requirement.documents && requirement.documents.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-gray-100">
                                <p className="text-sm font-medium text-gray-700 mb-2">📋 Yüklenen Belgeler:</p>
                                <div className="space-y-2">
                                  {requirement.documents.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                                      <KeenIcon icon="document" className="text-blue-600" />
                                      <span className="text-sm text-blue-800 font-medium">{doc.fileName}</span>
                                      <div className="ml-auto">
                                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                          Yüklendi
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic Information */}
                {selectedApplication.requirements && selectedApplication.requirements.filter(req => req.ruleType === 'TOPIC').length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <KeenIcon icon="information" className="text-blue-600 text-xl" />
                      <h4 className="text-lg font-semibold text-gray-900">Staj Konuları ve Bilgiler</h4>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <div className="space-y-4">
                        {selectedApplication.requirements
                          .filter(req => req.ruleType === 'TOPIC')
                          .map((requirement, index) => (
                          <div key={requirement.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-blue-900 mb-2">{requirement.name}</h5>
                              <div className="text-sm text-blue-800 leading-relaxed">
                                <TopicDescriptionRenderer description={requirement.description} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Başvuru Tarihi:</span> {new Date(selectedApplication.startDate).toLocaleDateString('tr-TR')}
                  </div>
                  <button
                    className="btn bg-gradient-to-r from-[#13126e] to-[#1f1e7e] text-white py-2 px-6 rounded-lg hover:from-[#1f1e7e] hover:to-[#13126e] transition-all duration-200 font-medium"
                    onClick={closeModal}
                  >
                    <KeenIcon icon="cross" className="mr-2" />
                    Kapat
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

export default MyApplicationsPage; 