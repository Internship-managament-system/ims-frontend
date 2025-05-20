// /pages/admin/settings/index.tsx
import React, { useState } from 'react';
import { Container } from '@/components';
import SettingsTabs from './components/SettingsTabs';
import GeneralSettings from './components/GeneralSettings';
import ChatbotManagement from './components/ChatbotManagement';
import { ResetPassword, ResetPasswordChange } from '@/auth/pages/jwt';
import PasswordChange from './components/PasswordChange';

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
            {activeSection === 'general' && <PasswordChange />}
            
          </div>
          
          
        </div>
      </div>
    </Container>
  );
};

export default Settings;