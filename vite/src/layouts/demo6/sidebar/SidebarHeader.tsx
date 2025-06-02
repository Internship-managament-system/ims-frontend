import React, { forwardRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import {
  Menu,
  MenuArrow,
  MenuIcon,
  MenuItem,
  MenuLabel,
  MenuLink,
  MenuSub,
  MenuTitle
} from '@/components/menu';
import { MENU_ROOT } from '@/config';
import { KeenIcon } from '@/components';
import { useLanguage } from '@/i18n';
import { useAuthContext } from '@/auth';
import axios from 'axios';
import { getAuth } from '@/auth/_helpers';

const SidebarHeader = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { pathname } = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(MENU_ROOT[1]);
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const [departmentName, setDepartmentName] = useState<string>('');
  
  const handleInputChange = () => {};

  useEffect(() => {
    MENU_ROOT.forEach((item) => {
      if (item.rootPath && pathname.includes(item.rootPath)) {
        setSelectedMenuItem(item);
      }
    });
  }, [pathname]);

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

  // Debug için console log
  console.log('SidebarHeader Debug:', {
    userRole: currentUser?.role,
    shouldShowDepartment,
    departmentId: currentUser?.departmentId,
    departmentName,
    departmentDisplayName,
    fullUser: currentUser
  });

  return (
    <div ref={ref}>
      <div className="flex flex-col items-center px-3.5 h-auto py-4">
        {/* Logo ve Sistem Adı */}
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="flex items-center gap-2">
            <img
              src={toAbsoluteUrl('/media/eru/erciyes-logo.png')}
              className="dark:hidden h-[50px] w-[55px]"
            />
            <img
              src={toAbsoluteUrl('/media/app/mini-logo-circle-dark.svg')}
              className="hidden dark:inline-block h-[42px]"
            />
            <div className="flex flex-col items-center">
              <span className="text-base md:text-lg font-bold tracking-wider text-[#13126e] uppercase whitespace-normal break-words md:whitespace-nowrap text-center">
                STAJ BİLGİ SİSTEMİ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export { SidebarHeader };