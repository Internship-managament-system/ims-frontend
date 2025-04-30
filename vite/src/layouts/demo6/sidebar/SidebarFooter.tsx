import React, { forwardRef } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { useAuthContext } from '@/auth';
import { KeenIcon } from '@/components';

const SidebarFooter = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { logout } = useAuthContext();

  return (
    <div ref={ref} className="flex justify-between items-center shrink-0 p-4 mb-3.5 border-t border-gray-200 mt-auto">
      <div className="flex items-center gap-2.5">
        <img
          className="size-10 rounded-full justify-center border border-[#13126e] shrink-0"
          src={toAbsoluteUrl('/media/eru/biyometrik.jpg')}
          alt="Öğrenci Profil"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            Mikdat Can Şimşek
          </span>
          <span className="text-xs text-gray-600">
            Öğrenci
          </span>
        </div>
      </div>
      
      <div
        onClick={logout}
        className="btn btn-icon btn-icon-lg size-10 bg-[#13126e] hover:bg-[#1f1e7e] text-white rounded-md flex items-center justify-center cursor-pointer"
      >
        <KeenIcon icon="exit-right" className="text-white" />
      </div>
    </div>
  );
});

export { SidebarFooter };