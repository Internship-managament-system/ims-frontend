import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

// Komisyon üyesi için atanmış staj defteri interface'i (gelecekteki API yapısı için hazır)
interface AssignedInternshipNotebook {
  id: string;
  studentName: string;
  studentSurname: string;
  studentEmail: string;
  internshipName: string;
  companyName: string;
  notebookStatus: string;
  submittedDate: string;
  studentNumber: string;
}

const AssignedNotebooks: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);
  const pageTitle = menuItem?.title || 'Atanan Defterler';

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const itemsPerPage = 10;

  // Endpoint henüz hazır olmadığı için boş data
  const assignedNotebooks: AssignedInternshipNotebook[] = [];
  const isLoading = false;
  const error = null;

  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  // Filtreleme
  const filteredNotebooks = assignedNotebooks.filter(notebook => {
    if (statusFilter === 'all') return true;
    return notebook.notebookStatus === statusFilter;
  });

  // Sayfalama
  const totalPages = Math.ceil(filteredNotebooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotebooks = filteredNotebooks.slice(startIndex, startIndex + itemsPerPage);

  // Durum rengi
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_APPROVAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Durum metni
  const getStatusText = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_APPROVAL':
        return '⏳ İnceleniyor';
      case 'APPROVED':
        return '✅ Onaylandı';
      case 'REJECTED':
        return '❌ Reddedildi';
      case 'UNDER_REVIEW':
        return '🔍 Değerlendiriliyor';
      default:
        return status;
    }
  };

  // Defterleri yenile fonksiyonu (gelecekte API çağrısı için)
  const refetchNotebooks = () => {
    console.log('Defterler yenileniyor... (API henüz hazır değil)');
  };

  return (
    <Container>
      <div className="p-5 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Atanan Staj Defterleri</h1>
          <p className="text-gray-600">
            Size atanmış staj defterlerini inceleyebilir ve değerlendirebilirsiniz.
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
                <option value="WAITING_FOR_APPROVAL">İnceleniyor</option>
                <option value="UNDER_REVIEW">Değerlendiriliyor</option>
                <option value="APPROVED">Onaylandı</option>
                <option value="REJECTED">Reddedildi</option>
              </select>
            </div>
            
            <button
              onClick={refetchNotebooks}
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
            <h3 className="text-lg font-medium text-gray-900">Toplam Defter</h3>
            <p className="text-2xl font-bold text-gray-900">{assignedNotebooks.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-yellow-700">İnceleme Bekliyor</h3>
            <p className="text-2xl font-bold text-yellow-700">
              {assignedNotebooks.filter(notebook => notebook.notebookStatus === 'WAITING_FOR_APPROVAL').length}
            </p>
          </div>
        </div>

        {/* Defterler Tablosu */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Defter Listesi ({filteredNotebooks.length} defter)
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
                    Teslim Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#13126e]"></div>
                        <span className="ml-3 text-gray-600">Yükleniyor...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-red-600">
                      Veri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.
                    </td>
                  </tr>
                ) : paginatedNotebooks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <KeenIcon icon="file-text" className="text-6xl text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">
                          {statusFilter === 'all' 
                            ? 'Henüz size atanmış defter bulunmuyor.' 
                            : `${getStatusText(statusFilter)} durumunda defter bulunmuyor.`
                          }
                        </p>
                        <p className="text-sm text-gray-500">
                          API endpoint henüz hazır değil. Yakında staj defterlerinizi burada görüntüleyebileceksiniz.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedNotebooks.map((notebook) => (
                    <tr key={notebook.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {notebook.studentName} {notebook.studentSurname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {notebook.studentNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {notebook.internshipName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Şirket: {notebook.companyName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(notebook.submittedDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notebook.notebookStatus)}`}>
                          {getStatusText(notebook.notebookStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => console.log('Defter detayını görüntüle:', notebook.id)}
                          className="btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                          title="Defteri görüntüle"
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
                  Toplam {filteredNotebooks.length} defterden{' '}
                  {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredNotebooks.length)} arası gösteriliyor
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
      </div>
    </Container>
  );
};

export default AssignedNotebooks; 