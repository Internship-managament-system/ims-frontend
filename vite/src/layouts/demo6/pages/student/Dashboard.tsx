import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const pageTitle = menuItem?.title || 'Öğrenci Dashboard';

  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  return (
    <Container>
      <div className="p-5 w-full">
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-2">Öğrenci Dashboard</h1>
          <div className="alert alert-info bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="mb-0">Hoş Geldiniz, {currentUser?.name} {currentUser?.surname}</p>
            <p className="mb-0">Rol: {currentUser?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Staj Durumu</h2>
                <p className="text-gray-600 mt-1">Mevcut staj başvuru durumunuz</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Başvuru Yapılmadı
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Tamamlanan Stajlar</h2>
                <p className="text-gray-600 mt-1">Tamamladığınız toplam staj sayısı</p>
              </div>
              <div className="p-2 bg-green-100 text-green-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">0</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Gerekli Belgeler</h2>
                <p className="text-gray-600 mt-1">Staj başvurusu için gerekli belgeler</p>
              </div>
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.48-8.48l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/student/documents/required" className="btn flex items-center justify-center gap-2 bg-[#13126e] text-white">
                <span>Belgeleri Görüntüle</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Duyurular</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800">2025 Yaz Dönemi Staj Başvuruları Başladı!</h3>
              <p className="text-gray-700 mt-1">Başvurular için son tarih: 30 Mayıs 2025</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800">Staj Belgeleri Teslim Hatırlatması</h3>
              <p className="text-gray-700 mt-1">Stajını tamamlayan öğrenciler belgelerini en geç 2 hafta içinde teslim etmelidir.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Staj Başvurusu</h2>
          <p className="text-gray-600 mb-4">Staj başvurusu yapmak için aşağıdaki butona tıklayın.</p>
          <Link to="/student/internship/application" className="btn flex items-center justify-center gap-2 bg-[#13126e] text-white">
            <span>Staj Başvurusu Yap</span>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;