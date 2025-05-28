// /pages/admin/settings/components/SettingsTabs.tsx
import React from 'react';
import { KeenIcon } from '@/components';

interface SettingsTabsProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const tabs = [
    {
      id: 'profile',
      title: 'Profil',
      icon: 'user'
    },
    {
      id: 'account',
      title: 'Hesap Yönetimi',
      icon: 'setting-2'
    }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSectionChange(tab.id)}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeSection === tab.id
              ? 'border-[#13126e] text-[#13126e] bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <KeenIcon icon={tab.icon} className="mr-2" />
          {tab.title}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabs;