import React from 'react';
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

interface MenuChildItem {
  title: string;
  path?: string;
}

interface MenuItemConfig {
  title: string;
  icon: string;
  path?: string;
  children?: MenuChildItem[];
}

const SidebarMenuCommissionMember: React.FC = () => {
  // Komisyon üyesi menü öğeleri
  const commissionMemberMenuItems: MenuItemConfig[] = [
    {
      title: 'Genel Durum',
      icon: 'element-11',
      path: '/commission/dashboard'
    },
    {
      title: 'Staj Yönetimi',
      icon: 'book',
      children: [
        {
          title: 'Atanan Başvurular',
          path: '/commission/assigned-applications'
        }
      ]
    },
    {
      title: 'Hesap Ayarları',
      icon: 'setting-2',
      path: '/commission/settings'
    }
  ];

  // Arrow builder helper
  const buildMenuArrow = () => (
    <MenuArrow className="text-gray-400 menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
      <KeenIcon icon="right" className="text-xs menu-item-show:hidden" />
      <KeenIcon icon="down" className="text-xs hidden menu-item-show:inline-flex" />
    </MenuArrow>
  );

  // Build menu items from configuration
  const buildMenuItems = () => {
    return commissionMemberMenuItems.map((item, index) => {
      if (item.children && item.children.length > 0) {
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
    </Menu>
  );
};

export { SidebarMenuCommissionMember }; 