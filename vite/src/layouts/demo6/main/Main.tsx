//Main.tsx
import { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router';
import { useMenuCurrentItem } from '@/components/menu';
import {Sidebar, Toolbar, ToolbarActions, ToolbarHeading } from '../';
import { useMenus } from '@/providers';
import { useResponsive } from '@/hooks';
import { Link } from 'react-router-dom';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { KeenIcon } from '@/components/keenicons';


const Main = () => {
  const mobileMode = useResponsive('down', 'lg');
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20)
  });

  return (
    <Fragment>
      <Helmet>
        <title>{menuItem?.title}</title>
      </Helmet>

      <div className="flex grow w-full">
        <Sidebar />
        {mobileMode}

        <div className="flex flex-col lg:flex-row grow pt-[--tw-header-height] lg:pt-0 w-full">
          <div className="flex flex-col grow items-stretch w-full bg-white dark:bg-[--tw-content-bg-dark] overflow-y-auto lg:ml-[290px]">
            <div className="flex flex-col grow min-h-screen w-full">
              <main className="grow w-full" role="content">
                
              <Outlet />
              </main>

            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { Main };
