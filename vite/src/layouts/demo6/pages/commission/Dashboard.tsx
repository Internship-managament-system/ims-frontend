import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { useQuery } from '@tanstack/react-query';
import { getAssignedInternshipApplications, getInternshipApplicationDetailById, InternshipApplicationDetail } from '@/services/internshipService';
import InternshipDetailsModal from '@/components/student/InternshipDetailsModal';
import { useNotifications } from '@/hooks/useNotifications';

// Komisyon üyesi için atanmış başvuru interface'i (gerçek API yapısına göre)
interface AssignedInternshipApplication {
  id: string;
  studentEmail: string;
  studentNumber: string;
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

  // Bildirim hook'u
  const { getUnreadCountForApplication, markApplicationAsRead, totalUnreadCount, refreshNotifications } = useNotifications();

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
    
    // Bildirimi okundu olarak işaretle
    markApplicationAsRead(applicationId);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedApplicationId(null);
  };

  // Status türkçeleştirme fonksiyonu
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'READY_FOR_ASSIGNMENT':
        return 'Belge Yükleme Bekleniyor';
      case 'ASSIGNED':
        return '⏳ İnceleme Bekliyor';
      case 'APPLICATION_APPROVED':
        return 'Başvuru Onaylandı';
      case 'REJECTED':
        return 'Başvuru Reddedildi';
      case 'IN_PROGRESS':
        return 'Staj Devam Ediyor';
      case 'COMPLETED':
        return 'Staj Tamamlandı';
      // Eski APPROVED enum'u için backward compatibility
      case 'APPROVED':
        return 'Başvuru Onaylandı';
      default:
        return status;
    }
  };

  // Status renk fonksiyonu
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'READY_FOR_ASSIGNMENT':
        return 'bg-purple-100 text-purple-800';
      case 'ASSIGNED':
        return 'bg-indigo-100 text-indigo-800';
      case 'APPLICATION_APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      // Eski APPROVED enum'u için backward compatibility
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  return (
    <Container>
      <div className="p-5 w-full">
        {/* Hoş Geldin Bölümü */}
        <div className="bg-gradient-to-r from-[#13126e] to-[#3a3a8e] rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz, {currentUser?.name} {currentUser?.surname}</h1>
              <p className="text-blue-100 text-lg">Size atanan başvuruları inceleyin ve değerlendirin</p>
            </div>
            <div className="hidden lg:block">
              <div className="p-4 bg-white/20 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
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

        {/* Son Başvurular - Full Width */}
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
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Ad Soyad</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Başvuru Tarihi</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Tipi</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Mesajlar</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-600">Yükleniyor...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-red-600">
                          Veri yüklenirken hata oluştu.
                        </td>
                      </tr>
                    ) : assignedApplications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          Size atanmış başvuru bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      assignedApplications.slice(0, 5).map((application) => (
                        <tr key={application.id} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {application.studentName} {application.studentSurname}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {new Date(application.appliedDate).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{application.internshipName}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                              {getStatusLabel(application.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <button
                              onClick={() => handleOpenDetailModal(application.id)}
                              className="relative p-1 text-gray-400 hover:text-[#13126e] transition-colors"
                              title="Mesajları görüntüle"
                            >
                              <KeenIcon icon="notification" className="text-base" />
                              {/* Gerçek bildirim sayısı */}
                              {getUnreadCountForApplication(application.id) > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                                  {getUnreadCountForApplication(application.id)}
                                </span>
                              )}
                            </button>
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

        {/* Detay Modalı */}
        <InternshipDetailsModal
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          application={assignedApplications.find(app => app.id === selectedApplicationId) || null}
          detail={applicationDetail as InternshipApplicationDetail || null}
          loading={isDetailLoading}
          isCommissionMember={true}
          onRequirementUpdate={() => {
            // Belge onaylandığında/reddedildiğinde modal'ı kapayıp tekrar açmak yerine
            // sadece application detail verisini yenile
            console.log('🔄 onRequirementUpdate tetiklendi - modal yenilenmeyecek');
          }}
          onMessageSent={() => {
            // Bildirimleri yeniden yükle
            refreshNotifications();
          }}
        />
      </div>
    </Container>
  );
};

export default Dashboard;