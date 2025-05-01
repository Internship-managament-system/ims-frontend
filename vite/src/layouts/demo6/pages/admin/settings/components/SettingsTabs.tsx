// /pages/admin/settings/components/SettingsTabs.tsx
import React from 'react';

interface SettingsTabsProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="flex border-b">
      <button
        className={`px-6 py-4 ${
          activeSection === 'general' ? 'border-b-2 border-[#13126e] text-[#13126e]' : ''
        }`}
        onClick={() => onSectionChange('general')}
      >
        Genel Ayarlar
      </button>
      <button
        className={`px-6 py-4 ${
          activeSection === 'notifications' ? 'border-b-2 border-[#13126e] text-[#13126e]' : ''
        }`}
        onClick={() => onSectionChange('notifications')}
      >
        Bildirim Ayarları
      </button>
      <button
        className={`px-6 py-4 ${
          activeSection === 'security' ? 'border-b-2 border-[#13126e] text-[#13126e]' : ''
        }`}
        onClick={() => onSectionChange('security')}
      >
        Güvenlik Ayarları
      </button>
    </div>
  );
};

export default SettingsTabs;