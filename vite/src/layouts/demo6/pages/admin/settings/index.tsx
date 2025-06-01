import React from 'react';
import { Container } from '@/components';
import ProfileSettings from './components/ProfileSettings';
import PasswordChange from './components/PasswordChange';

const AdminSettings: React.FC = () => {
  return (
    <Container>
      <div className="p-5">
        {/* Başlık */}
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Sistem Ayarları
          </h1>
          <p className="text-gray-600">
            Kullanıcı bilgilerinizi görüntüleyin ve şifrenizi değiştirin
          </p>
        </div>

        {/* Profil Bilgileri ve Şifre Değiştirme */}
        <div className="grid grid-cols-1 gap-6">
          <ProfileSettings />
          <PasswordChange />
        </div>
      </div>
    </Container>
  );
};

export default AdminSettings; 