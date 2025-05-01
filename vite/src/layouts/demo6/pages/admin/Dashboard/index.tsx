// /layouts/demo6/pages/admin/Dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Container } from '@/components';

// Tabları import et
import Overview from './tabs/Overview';
import UserManagement from './tabs/UserManagement';
import ApplicationManagement from './tabs/ApplicationManagement';
import Settings from './tabs/Settings';
import Reports from './tabs/Reports';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);
  const pageTitle = menuItem?.title || 'Admin Dashboard';

  // Aktif tab durumu
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  // Aktif taba göre içerik renderla
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <UserManagement />;
      case 'applications':
        return <ApplicationManagement />;
      case 'settings':
        return <Settings />;
      case 'reports':
        return <Reports />;
      default:
        return <Overview />;
    }
  };

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

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button 
                className={`inline-block p-4 rounded-t-lg ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('overview')}
              >
                Genel Durum
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 rounded-t-lg ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('users')}
              >
                Kullanıcı Yönetimi
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 rounded-t-lg ${activeTab === 'applications' ? 'border-b-2 border-blue-600 text-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('applications')}
              >
                Başvuru Yönetimi
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 rounded-t-lg ${activeTab === 'settings' ? 'border-b-2 border-blue-600 text-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('settings')}
              >
                Sistem Ayarları
              </button>
            </li>
            <li>
              <button 
                className={`inline-block p-4 rounded-t-lg ${activeTab === 'reports' ? 'border-b-2 border-blue-600 text-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('reports')}
              >
                Raporlar
              </button>
            </li>
          </ul>
        </div>

        {/* Tab içeriğini göster */}
        {renderTabContent()}
      </div>
    </Container>
  );
};

export default Dashboard;