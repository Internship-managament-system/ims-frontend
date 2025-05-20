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
      
    </div>
  );
};

export default SettingsTabs;