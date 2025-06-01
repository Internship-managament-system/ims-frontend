import React, { forwardRef, useMemo, useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { useAuthContext } from '@/auth';
import { KeenIcon } from '@/components';
import axios from 'axios';
import { getAuth } from '@/auth/_helpers';

// Backend'den gelen user tipini kullan
type User = {
  name: string;
  role: string; // Backend'den gelen role tipi
}

const SidebarFooter = forwardRef<HTMLDivElement>((props, ref) => {
  const { currentUser, logout } = useAuthContext();
  const [departmentName, setDepartmentName] = useState<string>('');

  // Departman adını fetch et
  useEffect(() => {
    const fetchDepartmentName = async () => {
      if (currentUser?.departmentId && !currentUser?.departmentName) {
        try {
          const response = await axios.get(`/api/v1/departments/${currentUser.departmentId}`, {
            headers: {
              'Authorization': `Bearer ${getAuth()?.access_token}`
            }
          });
          
          if (response.data && response.data.result) {
            setDepartmentName(response.data.result.name);
          }
        } catch (error) {
          console.error('Departman bilgisi alınamadı:', error);
        }
      } else if (currentUser?.departmentName) {
        setDepartmentName(currentUser.departmentName);
      }
    };

    fetchDepartmentName();
  }, [currentUser?.departmentId, currentUser?.departmentName]);

  // Departman adını gösteren roller
  const shouldShowDepartment = currentUser?.role && [
    'COMMISSION_CHAIRMAN', 
    'COMMISSION_MEMBER', 
    'STUDENT'
  ].includes(currentUser.role);

  // Departman adını al (önce API'den çekilen, sonra varsa currentUser'dan)
  const departmentDisplayName = departmentName || currentUser?.departmentName || currentUser?.department;

  const getRoleLabel = (role?: string) => {
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
        return 'Kullanıcı';
    }
  };

  const getProfileImage = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return '/media/eru/biyometrik.jpg';
      case 'COMMISSION_CHAIRMAN':
        return '/media/eru/commission-profile.jpg';
      case 'COMMISSION_MEMBER':
        return '/media/eru/commission-profile.jpg';
      case 'STUDENT':
        return '/media/eru/biyometrik.jpg';
      default:
        return '/media/eru/default-profile.jpg';
    }
  };

  const getRoleStyles = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'COMMISSION_CHAIRMAN':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMMISSION_MEMBER':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Kullanıcı menüsü
  const userMenuItems = useMemo(() => {
    const menuItems = [];

    // Komisyon Başkanı için özel menü
    if (currentUser?.role === 'COMMISSION_CHAIRMAN') {
      menuItems.push(
        {
          label: 'Yönetim Paneli',
          url: '/commissionChairman/dashboard',
          icon: 'mdi-view-dashboard-outline'
        }
      );
    }

    return menuItems;
  }, [currentUser?.role]);

  // Roller için tanımlama yap
  const getRoleDisplay = (role: string): string => {
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

  // Avatar resmini belirle
  const getAvatarUrl = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return '/media/eru/admin-profile.jpg';
      case 'COMMISSION_CHAIRMAN':
        return '/media/eru/admin-profile.jpg';
      case 'COMMISSION_MEMBER':
        return '/media/eru/commission-profile.jpg';
      case 'STUDENT':
        return '/media/eru/student-profile.jpg';
      default:
        return '/media/avatars/300-1.jpg';
    }
  };

  // Rol rengini belirle
  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return 'bg-primary';
      case 'COMMISSION_CHAIRMAN':
        return 'bg-primary';
      case 'COMMISSION_MEMBER':
        return 'bg-info';
      case 'STUDENT':
        return 'bg-success';
      default:
        return 'bg-gray-600';
    }
  };

  // Admin için özel menü
  if (currentUser?.role === 'COMMISSION_CHAIRMAN') {
    userMenuItems.push(
      {
        icon: 'home',
        label: 'Başkan Paneli',
        url: '/commissionChairman/dashboard',
      },
    );
  }

  return (
    <div ref={ref} className="flex justify-between items-center shrink-0 p-4 mb-3.5 border-t border-gray-200 mt-auto">
      <div className="flex items-center gap-3">
        {/* Avatar - Harfler ile */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#13126e] to-[#1f1e7e] flex items-center justify-center text-white font-semibold text-sm">
          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'K'}
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-900">
            {currentUser?.name || 'İsimsiz Kullanıcı'}
          </span>
          
          {/* Departman adı - sadece belirli roller için */}
          {shouldShowDepartment && departmentDisplayName && (
            <span className="text-xs text-gray-500 font-medium">
              {departmentDisplayName}
            </span>
          )}
          
          <span className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center ${getRoleStyles(currentUser?.role)}`}>
            {getRoleLabel(currentUser?.role)}
          </span>
        </div>
      </div>
      
      <button
        onClick={logout}
        className="w-9 h-9 bg-[#13126e] hover:bg-[#1f1e7e] text-white rounded-lg flex items-center justify-center transition-colors duration-200 group"
        title="Çıkış Yap"
      >
        <KeenIcon icon="exit-right" className="text-white text-sm group-hover:scale-110 transition-transform duration-200" />
      </button>
    </div>
  );
});

SidebarFooter.displayName = 'SidebarFooter';

export { SidebarFooter };