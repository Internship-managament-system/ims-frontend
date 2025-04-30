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

const SidebarHeader = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { pathname } = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(MENU_ROOT[1]);
  const { isRTL } = useLanguage();
  
  const handleInputChange = () => {};

  useEffect(() => {
    MENU_ROOT.forEach((item) => {
      if (item.rootPath && pathname.includes(item.rootPath)) {
        setSelectedMenuItem(item);
      }
    });
  }, [pathname]);

  return (
    <div ref={ref}>
      <div className="flex flex-col items-center px-3.5 h-auto py-4">
        {/* Logo ve Sistem Adı */}
        <Link to="/" className="flex flex-col items-center gap-1 mb-4">
          <div className="flex items-center gap-2">
            <img
              src={toAbsoluteUrl('/media/eru/erciyes-logo.png')}
              className="dark:hidden h-[50px] w-[55px]"
            />
            <img
              src={toAbsoluteUrl('/media/app/mini-logo-circle-dark.svg')}
              className="hidden dark:inline-block h-[42px]"
            />
            <span className="text-base md:text-lg font-bold tracking-wider text-[#13126e] uppercase whitespace-normal break-words md:whitespace-nowrap">STAJ BİLGİ SİSTEMİ</span>
          </div>
        </Link>
      </div>
    </div>
  );
});

export { SidebarHeader };