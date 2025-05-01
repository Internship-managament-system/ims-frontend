// /pages/admin/settings/index.tsx
import React, { useState } from 'react';
import { Container } from '@/components';
import SettingsTabs from './components/SettingsTabs';
import GeneralSettings from './components/GeneralSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('general');

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white rounded-lg shadow">
          <SettingsTabs
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="p-6">
            {activeSection === 'general' && <GeneralSettings />}
            {activeSection === 'notifications' && <NotificationSettings />}
            {activeSection === 'security' && <SecuritySettings />}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Settings;