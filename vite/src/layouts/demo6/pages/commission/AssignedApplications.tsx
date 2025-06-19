import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getAssignedInternshipApplications, getInternshipApplicationDetailById, InternshipApplicationDetail } from '@/services/internshipService';

// Komisyon üyesi için atanmış başvuru interface'i (gerçek API yapısına göre)
interface AssignedInternshipApplication {
  id: string;
  studentName: string;
  studentSurname: string;
  studentEmail: string;
  internshipName: string;
  companyName: string;
  status: string;
  appliedDate: string;
}
import { KeenIcon } from '@/components/keenicons';
import InternshipDetailsModal from '@/components/student/InternshipDetailsModal';
import { useNotifications } from '@/hooks/useNotifications';

const AssignedApplications: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);
  const pageTitle = menuItem?.title || 'Atanan Başvurular';

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const itemsPerPage = 10;

  // Bildirim hook'u
  const { getUnreadCountForApplication, markApplicationAsRead, refreshNotifications } = useNotifications();

  // Modal state'leri
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Atanmış staj başvurularını getir
  const { data: responseData, isLoading, error, refetch } = useQuery({
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


  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  // Filtreleme
  const filteredApplications = assignedApplications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  // Sayfalama
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  // Durum rengi
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

  // Durum metni
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'READY_FOR_ASSIGNMENT':
        return '📄 Belgelerinizi Yükleyebilirsiniz';
      case 'ASSIGNED':
        return '⏳ Başvurunuz İnceleniyor';
      case 'APPLICATION_APPROVED':
        return 'Başvurunuz Onaylandı! 🎉';
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

  return (
    <Container>
      <div className="p-5 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Atanan Staj Başvuruları</h1>
          <p className="text-gray-600">
            Size atanmış staj başvurularını inceleyebilir ve değerlendirebilirsiniz.
          </p>
        </div>

        {/* Filtreler */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Durum:</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
              >
                <option value="all">Tümü</option>
                <option value="PENDING">Beklemede</option>
                <option value="READY_FOR_ASSIGNMENT">Belge Yükleme Bekleniyor</option>
                <option value="ASSIGNED">İnceleme Bekliyor</option>
                <option value="APPLICATION_APPROVED">Başvuru Onaylandı</option>
                <option value="REJECTED">Başvuru Reddedildi</option>
                <option value="IN_PROGRESS">Staj Devam Ediyor</option>
                <option value="COMPLETED">Staj Tamamlandı</option>
              </select>
            </div>
            
            <button
              onClick={() => refetch()}
              className="btn bg-[#13126e] text-white text-sm py-1 px-3 rounded hover:bg-[#1f1e7e] flex items-center"
            >
              <KeenIcon icon="arrows-loop" className="mr-1" />
              Yenile
            </button>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Toplam Başvuru</h3>
            <p className="text-2xl font-bold text-gray-900">{assignedApplications.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-indigo-700">İnceleme Bekliyor</h3>
            <p className="text-2xl font-bold text-indigo-700">
              {assignedApplications.filter(app => app.status === 'ASSIGNED').length}
            </p>
          </div>
        </div>

        {/* Başvurular Tablosu */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Başvuru Listesi ({filteredApplications.length} başvuru)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staj Bilgileri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başvuru Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mesajlar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#13126e]"></div>
                        <span className="ml-3 text-gray-600">Yükleniyor...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-red-600">
                      Veri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.
                    </td>
                  </tr>
                ) : paginatedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {statusFilter === 'all' 
                        ? 'Size atanmış başvuru bulunmuyor.' 
                        : `${getStatusText(statusFilter)} durumunda başvuru bulunmuyor.`
                      }
                    </td>
                  </tr>
                ) : (
                  paginatedApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.studentName} {application.studentSurname}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.internshipName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Şirket: {application.companyName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Tür: {application.internshipName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.appliedDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleOpenDetailModal(application.id)}
                          className="relative p-2 text-gray-400 hover:text-[#13126e] transition-colors"
                          title="Mesajları görüntüle"
                        >
                          <KeenIcon icon="notification" className="text-lg" />
                          {/* Gerçek bildirim sayısı */}
                          {getUnreadCountForApplication(application.id) > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                              {getUnreadCountForApplication(application.id)}
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleOpenDetailModal(application.id)}
                          className="btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
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

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Toplam {filteredApplications.length} başvurudan{' '}
                  {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredApplications.length)} arası gösteriliyor
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn bg-gray-200 text-gray-700 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                  >
                    Önceki
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Sayfa {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn bg-gray-200 text-gray-700 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            </div>
          )}
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

export default AssignedApplications; 