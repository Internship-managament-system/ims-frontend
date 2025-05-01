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
  const pageTitle = menuItem?.title || 'Admin Dashboard';

  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  return (
    <Container>
      <div className="p-5 w-full">
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-2">Admin Dashboard</h1>
          <div className="alert alert-info bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="mb-0">Hoş Geldiniz, {currentUser?.name} {currentUser?.surname}</p>
            <p className="mb-0">Rol: {currentUser?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Toplam Öğrenci</h2>
                <p className="text-gray-600 mt-1">Sistemde kayıtlı öğrenci sayısı</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">250</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Aktif Stajlar</h2>
                <p className="text-gray-600 mt-1">Devam eden staj sayısı</p>
              </div>
              <div className="p-2 bg-green-100 text-green-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">42</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Bekleyen Başvurular</h2>
                <p className="text-gray-600 mt-1">Onay bekleyen başvuru sayısı</p>
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
              <span className="text-3xl font-bold text-gray-900">18</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Toplam Komisyon Üyesi</h2>
                <p className="text-gray-600 mt-1">Sistemde kayıtlı komisyon üyeleri</p>
              </div>
              <div className="p-2 bg-purple-100 text-purple-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
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
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Onaylandı
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
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Reddedildi
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Hızlı İstatistikler</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Toplam Tamamlanan Stajlar</span>
                <span className="font-medium text-gray-900">156</span>
              </li>
              <li className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Bu Ay Yapılan Başvurular</span>
                <span className="font-medium text-gray-900">24</span>
              </li>
              <li className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Onay Oranı</span>
                <span className="font-medium text-gray-900">85%</span>
              </li>
              <li className="flex justify-between items-center p-2">
                <span className="text-gray-600">Ortalama Staj Süresi</span>
                <span className="font-medium text-gray-900">45 gün</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn bg-blue-600 text-white py-2 px-4 rounded">
                Kullanıcıları Yönet
              </button>
              <button className="btn bg-purple-600 text-white py-2 px-4 rounded">
                Raporlar
              </button>
              <button className="btn bg-green-600 text-white py-2 px-4 rounded">
                Duyuru Ekle
              </button>
              <button className="btn bg-yellow-600 text-white py-2 px-4 rounded">
                Ayarlar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;