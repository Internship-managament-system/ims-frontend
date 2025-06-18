import React, { useState } from 'react';
import { Container } from '@/components';
import SettingsTabs from './components/SettingsTabs';
import ProfileSettings from './components/ProfileSettings';
import AccountManagement from './components/AccountManagement';

const StudentSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white rounded-lg shadow">
          <SettingsTabs
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="p-6">
            {activeSection === 'profile' && <ProfileSettings />}
            {activeSection === 'account' && <AccountManagement />}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default StudentSettings; 