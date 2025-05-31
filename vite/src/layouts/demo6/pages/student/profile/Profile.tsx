import React, { useState, useEffect } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import * as authHelper from '@/auth/_helpers';
import axios from 'axios';

interface UserInfo {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  departmentId: string;
  permissions: string[];
}

interface Department {
  id: string;
  name: string;
}

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      
      // Kullanıcı bilgilerini çek
      const userResponse = await axios.get('/api/v1/users/info', {
        headers: {
          'Authorization': `Bearer ${authHelper.getAuth()?.access_token}`
        }
      });

      if (userResponse.data && userResponse.data.result) {
        setUserInfo(userResponse.data.result);

        // Bölüm bilgilerini çek
        if (userResponse.data.result.departmentId) {
          const departmentResponse = await axios.get(`/api/v1/departments/${userResponse.data.result.departmentId}`, {
            headers: {
              'Authorization': `Bearer ${authHelper.getAuth()?.access_token}`
            }
          });

          if (departmentResponse.data && departmentResponse.data.result) {
            setDepartment(departmentResponse.data.result);
          }
        }
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'Kullanıcı bilgileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'Öğrenci';
      case 'ADMIN':
        return 'Yönetici';
      case 'COMMISSION_MEMBER':
        return 'Komisyon Üyesi';
      default:
        return role;
    }
  };

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const getGradientColor = (name: string) => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-yellow-500 to-red-600',
      'from-indigo-500 to-purple-600',
      'from-pink-500 to-rose-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#13126e] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Yükleniyor...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <KeenIcon icon="information" className="text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!userInfo) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-gray-500">Kullanıcı bilgileri bulunamadı.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-white">
      <div className="flex flex-col gap-5 lg:gap-7.5 pt-8 px-6">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Profilim</h1>
          <p className="text-sm text-gray-600">
            Kişisel bilgilerinizi görüntüleyin.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradientColor(userInfo.name)} flex items-center justify-center text-white font-semibold text-lg`}>
                {getInitials(userInfo.name, userInfo.surname)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userInfo.name} {userInfo.surname}
                </h2>
                <p className="text-gray-600">{getRoleText(userInfo.role)}</p>
                {department && (
                  <p className="text-sm text-gray-500">{department.name}</p>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {userInfo.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {userInfo.surname}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {userInfo.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {getRoleText(userInfo.role)}
                  </div>
                </div>
              </div>
            </div>

            {department && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bölüm
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                  {department.name}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile; 