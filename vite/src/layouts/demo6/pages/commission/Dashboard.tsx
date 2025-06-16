import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getAssignedInternshipApplications, getInternshipApplicationDetailById, InternshipApplicationDetail } from '@/services/internshipService';
import InternshipDetailsModal from '@/components/student/InternshipDetailsModal';

// Komisyon üyesi için atanmış başvuru interface'i (gerçek API yapısına göre)
interface AssignedInternshipApplication {
  id: string;
  studentName: string;
  studentSurname: string;
  internshipName: string;
  companyName: string;
  status: string;
  appliedDate: string;
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);
  const pageTitle = menuItem?.title || 'Komisyon Üyesi Dashboard';

  // Modal state'leri
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Atanmış staj başvurularını getir
  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['assigned-internship-applications'],
    queryFn: getAssignedInternshipApplications,
  });

  // Detay modalı için query
  const { data: applicationDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['internship-application-detail', selectedApplicationId],
    queryFn: () => getInternshipApplicationDetailById(selectedApplicationId!),
    enabled: !!selectedApplicationId && isDetailModalOpen,
  });

  // API'den gelen veriyi doğru yapıya çevir  
  const assignedApplications: AssignedInternshipApplication[] = (responseData as any)?.result || responseData || [];

  console.log('📋 Atanmış başvurular response:', responseData);
  console.log('📋 Processed başvurular:', assignedApplications);

  // İstatistikleri hesapla (API'de sadece ASSIGNED durumu var gibi görünüyor)
  const statistics = {
    total: assignedApplications.length,
    assigned: assignedApplications.filter(app => app.status === 'ASSIGNED').length,
    // Diğer durumlar için şimdilik sıfır
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  // Modal fonksiyonları
  const handleOpenDetailModal = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedApplicationId(null);
  };

  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  return (
    <Container>
      <div className="p-5 w-full">
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-2">Komisyon Üyesi Dashboard</h1>
          <div className="alert alert-info bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="mb-0">Hoş Geldiniz, {currentUser?.name} {currentUser?.surname}</p>
            <p className="mb-0">Rol: {currentUser?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Toplam Atanan Başvuru</h2>
                <p className="text-gray-600 mt-1">Size atanan toplam başvuru sayısı</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{statistics.total}</span>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Atanmış Başvurular</h2>
                <p className="text-gray-600 mt-1">İncelemenizi bekleyen başvurular</p>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{statistics.assigned}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Son Başvurular</h2>
                <a 
                  href="/commission/assigned-applications"
                  className="btn bg-[#13126e] text-white text-sm py-1 px-3 rounded hover:bg-[#1f1e7e]"
                >
                  Tümünü Görüntüle
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci No</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Ad Soyad</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Başvuru Tarihi</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Tipi</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-600">Yükleniyor...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-red-600">
                          Veri yüklenirken hata oluştu.
                        </td>
                      </tr>
                    ) : assignedApplications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Size atanmış başvuru bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      assignedApplications.slice(0, 5).map((application) => (
                        <tr key={application.id} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm text-gray-700">-</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {application.studentName} {application.studentSurname}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {new Date(application.appliedDate).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{application.internshipName}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              application.status === 'ASSIGNED' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {application.status === 'ASSIGNED' && '⏳ İnceleme Bekliyor'}
                              {application.status !== 'ASSIGNED' && application.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button 
                              onClick={() => handleOpenDetailModal(application.id)}
                              className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                              title="Detayları görüntüle"
                            >
                              İncele
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h2>
              <div className="space-y-3">
                <a 
                  href="/commission/assigned-applications"
                  className="btn bg-[#13126e] text-white w-full py-2 px-4 rounded hover:bg-[#1f1e7e] block text-center"
                >
                  Bekleyen Başvuruları Görüntüle
                </a>
                <button className="btn bg-blue-600 text-white w-full py-2 px-4 rounded">
                  Staj Raporlarını İncele
                </button>
                <button className="btn bg-green-600 text-white w-full py-2 px-4 rounded">
                  Duyuru Oluştur
                </button>
                <button className="btn bg-gray-600 text-white w-full py-2 px-4 rounded">
                  İstatistikleri Görüntüle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detay Modalı */}
        <InternshipDetailsModal
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          application={assignedApplications.find(app => app.id === selectedApplicationId) || null}
          detail={applicationDetail as InternshipApplicationDetail || null}
          loading={isDetailLoading}
        />
      </div>
    </Container>
  );
};

export default Dashboard;