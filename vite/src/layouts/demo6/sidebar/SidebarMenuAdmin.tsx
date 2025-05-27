// /src/layouts/demo6/sidebar/SidebarMenuAdmin.tsx
import clsx from 'clsx';
import { KeenIcon } from '@/components/keenicons';
import {
  Menu,
  MenuArrow,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle
} from '@/components/menu';

const SidebarMenuAdmin = () => {
  const buildMenuArrow = () => {
    return (
      <MenuArrow className="text-gray-600 menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
        <KeenIcon icon="down" className="text-xs menu-item-show:hidden" />
        <KeenIcon icon="up" className="text-xs hidden menu-item-show:inline-flex" />
      </MenuArrow>
    );
  };

  // Admin specific menu items
  const adminMenuItems = [
    {
      title: 'Genel Durum',
      icon: 'element-11',
      path: '/admin/dashboard',
    },
    {
      title: 'Komisyon Üyeleri',
      icon: 'people',
      path: '/admin/commission',
    },
    {
      title: 'Başvuru Yönetimi',
      icon: 'document',
      children: [
        {
          title: 'Genel Durum',
          path: '/admin/applications/overview',
        },
        {
          title: 'Başvurular',
          path: '/admin/applications/list',
        },
        {
          title: 'Değerlendirmeler',
          path: '/admin/applications/evaluations',
        },
        {
          title: 'Atamalar',
          path: '/admin/applications/assignments',
        },
      ]
    },
    {
      title: 'Belge Yönetimi',
      icon: 'folder',
      path: '/admin/documents',
    },
    {
      title: 'Staj Ayarları',
      icon: 'setting-2',
      children: [
        {
          title: 'Başvuru Süresi',
          path: '/admin/internship-settings/application-period',
        },
        {
          title: 'Defter Toplama Tarihleri',
          path: '/admin/internship-settings/notebook-dates',
        },
        {
          title: 'Red Gerekçeleri',
          path: '/admin/internship-settings/rejection-reasons',
        },
        {
          title: 'Staj Detayları',
          path: '/admin/internship-settings/internship-details',
        },
      ]
    },
    {
      title: 'Şifre Yönetimi',
      icon: 'lock',
      path: '/admin/settings',
    }
  ];

  // Build menu items from configuration
  const buildMenuItems = () => {
    return adminMenuItems.map((item, index) => {
      if (item.children) {
        return (
          <MenuItem key={index} toggle="accordion" trigger="click">
            <MenuLink className="gap-2.5 py-2 px-2.5 rounded-md border border-transparent hover:border-[#13126e] hover:bg-[#e8e8f5]">
              <MenuIcon className="items-start text-gray-600 text-lg menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
                {item.icon && <KeenIcon icon={item.icon} />}
              </MenuIcon>
              <MenuTitle className="font-medium text-sm text-gray-800 menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
                {item.title}
              </MenuTitle>
              {buildMenuArrow()}
            </MenuLink>
            <MenuSub className="menu-accordion gap-px ps-7">
              {item.children.map((childItem, childIndex) => (
                <MenuItem key={childIndex}>
                  <MenuLink
                    path={childItem.path}
                    className="py-2 px-2.5 rounded-md border border-transparent menu-item-active:border-[#13126e] menu-item-active:bg-[#e8e8f5] menu-link-hover:bg-[#e8e8f5] menu-link-hover:border-[#13126e]"
                  >
                    <MenuTitle className="text-2sm text-gray-800 menu-item-active:text-[#13126e] menu-link-hover:text-[#13126e]">
                      {childItem.title}
                    </MenuTitle>
                  </MenuLink>
                </MenuItem>
              ))}
            </MenuSub>
          </MenuItem>
        );
      }
      
      return (
        <MenuItem key={index}>
          <MenuLink
            path={item.path}
            className="gap-2.5 py-2 px-2.5 rounded-md border border-transparent menu-item-active:border-[#13126e] menu-item-active:bg-[#e8e8f5] menu-link-hover:bg-[#e8e8f5] menu-link-hover:border-[#13126e]"
          >
            <MenuIcon className="items-start text-lg text-gray-600 menu-item-active:text-[#13126e] menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
              {item.icon && <KeenIcon icon={item.icon} />}
            </MenuIcon>
            <MenuTitle className="text-sm text-gray-800 font-medium menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
              {item.title}
            </MenuTitle>
          </MenuLink>
        </MenuItem>
      );
    });
  };

  return (
    <Menu highlight={true} multipleExpand={false} className="sidebar-menu-primary flex flex-col w-full gap-1.5 px-3.5">
      {buildMenuItems()}
      <div className="border-b border-gray-300 mt-4 mb-1 mx-3.5"></div>
    </Menu>
  );
};

export { SidebarMenuAdmin };