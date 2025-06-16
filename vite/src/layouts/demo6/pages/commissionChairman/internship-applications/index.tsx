import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getInternshipApplicationsForCommission,
  getInternshipApplicationDetailById,
  InternshipApplicationListItem,
  InternshipApplicationDetail,
} from '@/services/internshipService';

// Başvuru durumu için renk ve etiket bilgileri
const statusConfig: Record<string, { label: string; color: string; description: string }> = {
  PENDING: { 
    label: 'Beklemede', 
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Yeni başvuru, işlem bekliyor'
  },
  APPROVED: { 
    label: 'Onaylandı', 
    color: 'bg-green-100 text-green-800',
    description: 'Başvuru komisyon tarafından onaylandı'
  },
  REJECTED: { 
    label: 'Reddedildi', 
    color: 'bg-red-100 text-red-800',
    description: 'Başvuru komisyon tarafından reddedildi'
  },
  COMPLETED: { 
    label: 'Tamamlandı', 
    color: 'bg-blue-100 text-blue-800',
    description: 'Staj süreci başarıyla tamamlandı'
  },
  READY_FOR_ASSIGNMENT: { 
    label: 'Komisyon Üyesine Atamaya Hazır', 
    color: 'bg-purple-100 text-purple-800',
    description: 'Belgeler tamamlandı, komisyon üyesi ataması bekliyor'
  },
  ASSIGNED: { 
    label: 'Komisyon Üyesine Atandı', 
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Başvuru komisyon üyesi tarafından inceleniyor'
  },
  IN_PROGRESS: { 
    label: 'Staj Devam Ediyor', 
    color: 'bg-blue-100 text-blue-800',
    description: 'Onaylanan başvuru, staj süreci devam ediyor'
  },
};

const InternshipApplicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplicationDetail | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const queryClient = useQueryClient();

  // Komisyon başkanı için staj başvurularını getir (YENİ API)
  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ['commission-internship-applications'],
    queryFn: getInternshipApplicationsForCommission,
  });

  // Detay modalını aç
  const openDetailsModal = async (application: InternshipApplicationListItem) => {
    try {
      console.log('🔍 Detay modal açılıyor, ID:', application.id);
      const applicationDetail = await getInternshipApplicationDetailById(application.id);
      setSelectedApplication(applicationDetail);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Başvuru detayı alınırken hata:', error);
      toast.error('Başvuru detayı alınamadı');
    }
  };

  // Modalı kapat
  const closeModal = () => {
    setSelectedApplication(null);
    setShowDetailsModal(false);
  };

  // Arama filtreleme
  const filteredApplications = applications.filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    
    return (
      app.companyName.toLowerCase().includes(searchLower) ||
      app.internshipName.toLowerCase().includes(searchLower) ||
      app.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Container className="min-h-screen bg-white">
      <div className="pt-8 px-6">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Staj Başvuruları</h2>
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
                        Staj başvurusu bulunamadı
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

        {/* Detay Modalı */}
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
                    <div className="flex flex-col gap-2">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          statusConfig[selectedApplication.status]?.color || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {statusConfig[selectedApplication.status]?.label || selectedApplication.status}
                      </span>
                      {statusConfig[selectedApplication.status]?.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {statusConfig[selectedApplication.status].description}
                        </p>
                      )}
                    </div>
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

export default InternshipApplicationsPage; 