import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Container } from '@/components';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);
  const pageTitle = menuItem?.title || 'Komisyon Üyesi Dashboard';

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Bekleyen Başvurular</h2>
                <p className="text-gray-600 mt-1">Değerlendirmenizi bekleyen başvurular</p>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">12</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Onaylanan Başvurular</h2>
                <p className="text-gray-600 mt-1">Onayladığınız staj başvuruları</p>
              </div>
              <div className="p-2 bg-green-100 text-green-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">24</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Reddedilen Başvurular</h2>
                <p className="text-gray-600 mt-1">Reddettiğiniz staj başvuruları</p>
              </div>
              <div className="p-2 bg-red-100 text-red-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">3</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Son Başvurular</h2>
                <button className="btn bg-[#13126e] text-white text-sm py-1 px-3 rounded">
                  Tümünü Görüntüle
                </button>
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
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700">20190101023</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Ahmet Yılmaz</td>
                      <td className="px-4 py-3 text-sm text-gray-700">25.04.2025</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Yaz Stajı</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Beklemede
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                          İncele
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700">20190101045</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Ayşe Demir</td>
                      <td className="px-4 py-3 text-sm text-gray-700">24.04.2025</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Yaz Stajı</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Beklemede
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                          İncele
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700">20190101067</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Mehmet Kaya</td>
                      <td className="px-4 py-3 text-sm text-gray-700">23.04.2025</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Kış Stajı</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Beklemede
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                          İncele
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h2>
              <div className="space-y-3">
                <button className="btn bg-[#13126e] text-white w-full py-2 px-4 rounded">
                  Bekleyen Başvuruları Görüntüle
                </button>
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
      </div>
    </Container>
  );
};

export default Dashboard;