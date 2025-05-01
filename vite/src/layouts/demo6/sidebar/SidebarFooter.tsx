import React, { forwardRef } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { useAuthContext } from '@/auth';
import { KeenIcon } from '@/components';

// Backend'den gelen user tipini kullan
type User = {
  name: string;
  role: string; // Backend'den gelen role tipi
}

const SidebarFooter = forwardRef<HTMLDivElement>((props, ref) => {
  const { currentUser, logout } = useAuthContext();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Yönetici';
      case 'COMMISSION_HEAD':
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
        return '/media/eru/admin-profile.jpg';
      case 'COMMISSION_HEAD':
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
        return 'bg-purple-100 text-purple-800';
      case 'COMMISSION_HEAD':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMMISSION_MEMBER':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={ref} className="flex justify-between items-center shrink-0 p-4 mb-3.5 border-t border-gray-200 mt-auto">
      <div className="flex items-center gap-2.5">
        <img
          className="size-10 rounded-full justify-center border border-[#13126e] shrink-0"
          src={toAbsoluteUrl(getProfileImage(currentUser?.role))}
          alt="Profil"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {currentUser?.name || 'İsimsiz Kullanıcı'}
          </span>
          <span className={`text-xs px-2 py-0.5 inline-flex items-center justify-center ${getRoleStyles(currentUser?.role)}`}>
            {getRoleLabel(currentUser?.role)}
          </span>
        </div>
      </div>
      
      <div
        onClick={logout}
        className="btn btn-icon btn-icon-lg size-10 bg-[#13126e] hover:bg-[#1f1e7e] text-white flex items-center justify-center cursor-pointer"
      >
        <KeenIcon icon="exit-right" className="text-white" />
      </div>
    </div>
  );
});

SidebarFooter.displayName = 'SidebarFooter';

export { SidebarFooter };