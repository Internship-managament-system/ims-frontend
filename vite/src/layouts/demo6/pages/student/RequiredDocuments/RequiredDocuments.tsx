import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RequiredDocumentsPage from './RequiredDocumentsPage';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';

const RequiredDocuments: React.FC = () => {
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);
  const pageTitle = menuItem?.title || 'Gerekli Belgeler';

  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  return <RequiredDocumentsPage />;
};

export { RequiredDocuments };