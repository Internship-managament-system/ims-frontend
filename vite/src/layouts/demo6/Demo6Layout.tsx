// /src/layouts/demo6/Demo6Layout.tsx
import useBodyClasses from '@/hooks/useBodyClasses';
import { Demo6LayoutProvider, Main } from './';
import { useAuthContext } from '@/auth';
import { useEffect, useState } from 'react';
import { SidebarMenuAdmin } from './sidebar/SidebarMenuAdmin';
import { MENU_SIDEBAR } from '@/config';
import { useMenus } from '@/providers';

const Demo6Layout = () => {
  const { currentUser } = useAuthContext();
  const { setMenuConfig, menuConfig } = useMenus();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCommissionMember, setIsCommissionMember] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  // Set body classes for layout styling
  useBodyClasses(`
    [--tw-page-bg:#F6F6F9]
    [--tw-page-bg-dark:var(--tw-coal-200)]
    [--tw-content-bg:var(--tw-light)]
    [--tw-content-bg-dark:var(--tw-coal-500)]
    [--tw-content-scrollbar-color:#e8e8e8]
    [--tw-header-height:60px]
    [--tw-sidebar-width:290px]
    [--tw-sidebar-width-sm:250px]
    bg-[--tw-page-bg]
    dark:bg-[--tw-page-bg-dark]
    lg:overflow-hidden
  `);

  // Determine user role
  useEffect(() => {
    if (!currentUser) return;

    // Kullanıcı rolünü kontrol et
    const isChairman = currentUser.role === 'COMMISSION_CHAIRMAN';
    setIsAdmin(isChairman);
    setIsCommissionMember(currentUser.role === 'COMMISSION_MEMBER');
    setIsStudent(currentUser.role === 'STUDENT');
    
    // Eğer menu config mevcut değilse veya önceki rol ayarlarından farklıysa güncelle
    if (!menuConfig || 
        menuConfig.isAdmin !== isChairman || 
        menuConfig.isCommissionMember !== (currentUser.role === 'COMMISSION_MEMBER') || 
        menuConfig.isStudent !== (currentUser.role === 'STUDENT')) {
      setMenuConfig({
        isAdmin: isChairman,
        isCommissionMember: currentUser.role === 'COMMISSION_MEMBER',
        isStudent: currentUser.role === 'STUDENT'
      });
    }
    
    // If the user is a chairman, we'll override with admin-specific menu in the SidebarMenuPrimary component
    
  }, [currentUser, setMenuConfig]);

  return (
    // Providing layout context and rendering the main content
    <Demo6LayoutProvider>
      <Main />
    </Demo6LayoutProvider>
  );
};

export { Demo6Layout };