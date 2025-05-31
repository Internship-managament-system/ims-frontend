import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getMyInternshipApplications, InternshipApplication, InternshipStatus } from '@/services/internshipService';
import { Link } from 'react-router-dom';

// Başvuru durumu için renk ve etiket bilgileri
const statusConfig: Record<InternshipStatus, { label: string; color: string }> = {
  PENDING: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Onaylandı', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
  COMPLETED: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800' },
};

const MyApplicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Öğrencinin kendi başvurularını getir
  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ['my-internship-applications'],
    queryFn: getMyInternshipApplications
  });

  // Hata durumunda kullanıcıya bildir
  useEffect(() => {
    if (isError) {
      toast.error('Staj başvurularınız yüklenirken bir hata oluştu.');
    }
  }, [isError]);

  // Detay modalını aç
  const openDetailsModal = (application: InternshipApplication) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
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
      app.workplaceName.toLowerCase().includes(searchLower) ||
      app.status.toLowerCase().includes(searchLower) ||
      (app.statusText && app.statusText.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Staj Başvurularım</h2>
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
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">İşyeri</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Dönemi</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Türü</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                        Henüz staj başvurunuz bulunmamaktadır
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((application) => (
                      <tr key={application.id} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(application.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{application.workplaceName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {application.internshipPeriodText}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {application.internshipTypeText}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              statusConfig[application.status].color
                            }`}
                          >
                            {application.statusText || statusConfig[application.status].label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded"
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
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Staj Başvurusu Detayı</h3>
                <button className="text-gray-500" onClick={closeModal}>
                  <KeenIcon icon="cross" className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium mb-2">Başvuru Durumu</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          statusConfig[selectedApplication.status].color
                        }`}
                      >
                        {selectedApplication.statusText || statusConfig[selectedApplication.status].label}
                      </span>
                      <span className="text-gray-600">
                        Son güncelleme: {new Date(selectedApplication.updatedAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2">Genel Bilgiler</h4>
                  <div className="grid grid-cols-2 gap-4">
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
                      <p>{selectedApplication.internshipTypeText}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sağlık Sigortası</p>
                      <p>{selectedApplication.hasGeneralHealthInsurance ? 'Var' : 'Yok'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Çalışma Günleri</p>
                      <p>
                        {selectedApplication.weeklyWorkingDaysText}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2">İşyeri Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">İşyeri Adı</p>
                      <p>{selectedApplication.workplaceName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">İl/Ülke</p>
                      <p>{selectedApplication.provinceText}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Faaliyet Alanı</p>
                      <p>{selectedApplication.activityField}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">E-posta</p>
                      <p>{selectedApplication.workplaceEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefon</p>
                      <p>{selectedApplication.workplacePhone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Adres</p>
                      <p>{selectedApplication.workplaceAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded"
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