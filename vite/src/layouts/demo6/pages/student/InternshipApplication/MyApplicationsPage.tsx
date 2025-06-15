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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Staj Başvurusu Detayı</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>
                  <KeenIcon icon="cross" className="h-5 w-5" />
                </button>
              </div>

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

                {/* Requirements */}
                {selectedApplication.requirements && selectedApplication.requirements.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium mb-2">Gereksinimler</h4>
                    <div className="space-y-3">
                      {selectedApplication.requirements.map((requirement) => (
                        <div key={requirement.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-sm font-medium">{requirement.name}</h5>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                requirement.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-800'
                                  : requirement.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {requirement.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{requirement.description}</p>
                          <p className="text-xs text-gray-500">Tür: {requirement.ruleType}</p>
                          
                          {/* Document Upload for DOCUMENT type requirements */}
                          {requirement.ruleType === 'DOCUMENT' && (
                            <div className="mt-3">
                              <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-gray-700">
                                  Belge Yükle:
                                </label>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleDocumentUpload(requirement.id, file);
                                    }
                                  }}
                                  className="text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  disabled={uploadingDocuments.has(`${selectedApplication.id}-${requirement.id}`)}
                                />
                                {uploadingDocuments.has(`${selectedApplication.id}-${requirement.id}`) && (
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Documents */}
                          {requirement.documents && requirement.documents.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Yüklenen Belgeler:</p>
                              <div className="space-y-1">
                                {requirement.documents.map((doc: any) => (
                                  <div key={doc.id} className="text-sm text-blue-600 hover:text-blue-800">
                                    📄 {doc.fileName}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                    onClick={closeModal}
                  >
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