// /src/layouts/demo6/toolbar/ToolbarCommissionChairman.tsx
import React from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { useAuthContext } from '@/auth';

export interface IToolbarCommissionChairmanProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ToolbarCommissionChairman: React.FC<IToolbarCommissionChairmanProps> = ({ activeTab, onTabChange }) => {
  const { currentUser } = useAuthContext();

  // CommissionChairman toolbar tabs
  const tabs = [
    { id: 'overview', title: 'Genel Durum' },
    { id: 'users', title: 'Komisyon Üyeleri' },
    { id: 'applications', title: 'Başvuru Yönetimi' },
    { id: 'documents', title: 'Belge Yönetimi' },
    { id: 'faq', title: 'SSS Yönetimi' },
    { id: 'settings', title: 'Sistem Ayarları' },
    { id: 'reports', title: 'Raporlar' }
  ];

  return (
    <div className="pb-5">
      <Container className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center flex-wrap gap-1 lg:gap-5">
          <h1 className="font-medium text-lg text-gray-900">Komisyon Başkanı Dashboard</h1>
          
          <div className="flex items-center gap-1 text-sm font-normal">
            <span className="text-gray-700">Yönetim</span>
            <span className="text-gray-400 text-sm">/</span>
            <span className="text-gray-900">Dashboard</span>
          </div>
        </div>
        
        <div className="flex items-center flex-wrap gap-1.5 lg:gap-3.5">
          {/* Notification bell icon */}
          <button className="btn btn-icon btn-icon-lg size-10 hover:bg-gray-100 rounded-md flex items-center justify-center cursor-pointer relative">
            <KeenIcon icon="notification" className="text-gray-600" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">3</span>
          </button>
          
          {/* Quick actions */}
          <div className="dropdown">
            <button className="btn btn-primary flex items-center gap-2 px-4 py-2 rounded-md" style={{ backgroundColor: '#13126e' }}>
              <span>Hızlı İşlemler</span>
              <KeenIcon icon="down" className="text-white text-xs" />
            </button>
            
            {/* Dropdown menu items would go here */}
          </div>
        </div>
      </Container>
      
      {/* Tab navigation */}
      <Container>
        <div className="border-b border-gray-200 mt-2">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            {tabs.map((tab) => (
              <li className="mr-2" key={tab.id}>
                <button 
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === tab.id 
                      ? 'border-b-2 border-[#13126e] text-[#13126e]' 
                      : 'hover:text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
};

export { ToolbarCommissionChairman };