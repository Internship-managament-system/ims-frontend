import React, { useState, useEffect } from 'react';
import { KeenIcon } from '@/components';
import axios from 'axios';
import * as authHelper from '@/auth/_helpers';

interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  permissions: string[];
  departmentId: string;
}

interface Department {
  name: string;
  code: string;
}

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/users/info', {
        headers: {
          'Authorization': `Bearer ${authHelper.getAuth()?.access_token}`
        }
      });
      
      if (response.data && response.data.result) {
        const userProfile = response.data.result;
        setProfile(userProfile);
        
        // Eğer departmentId varsa, bölüm bilgisini çek
        if (userProfile.departmentId) {
          await fetchDepartmentInfo(userProfile.departmentId);
        }
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError('Profil bilgileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentInfo = async (departmentId: string) => {
    try {
      const response = await axios.get(`/api/v1/departments/${departmentId}`, {
        headers: {
          'Authorization': `Bearer ${authHelper.getAuth()?.access_token}`
        }
      });
      
      if (response.data && response.data.result) {
        setDepartment(response.data.result);
      }
    } catch (error) {
      console.error('Department fetch error:', error);
      // Bölüm bilgisi alınamazsa sessizce devam et
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#13126e]"></div>
          <span className="text-gray-600">Profil bilgileri yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <KeenIcon icon="warning" className="text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <KeenIcon icon="information" className="text-gray-500 mr-2" />
          <span className="text-gray-700">Profil bilgileri bulunamadı.</span>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Sistem Yöneticisi';
      case 'COMMISSION_CHAIRMAN':
        return 'Komisyon Başkanı';
      case 'COMMISSION_MEMBER':
        return 'Komisyon Üyesi';
      case 'STUDENT':
        return 'Öğrenci';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Profil Bilgileri</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#13126e] to-[#1f1e7e] flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name.charAt(0)}{profile.surname.charAt(0)}
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {profile.name} {profile.surname}
              </h3>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                  {profile.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                  {profile.surname}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                  {profile.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                  {getRoleDisplayName(profile.role)}
                </div>
              </div>

              {department && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bölüm
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                    {department.name}
                  </div>
                </div>
              )}

              {department && department.code && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bölüm Kodu
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm">
                    {department.code}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings; 