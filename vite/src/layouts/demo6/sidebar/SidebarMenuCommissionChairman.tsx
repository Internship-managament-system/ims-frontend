// /src/layouts/demo6/sidebar/SidebarMenuCommissionChairman.tsx
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

const SidebarMenuCommissionChairman = () => {
  const buildMenuArrow = () => {
    return (
      <MenuArrow className="text-gray-600 menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
        <KeenIcon icon="down" className="text-xs menu-item-show:hidden" />
        <KeenIcon icon="up" className="text-xs hidden menu-item-show:inline-flex" />
      </MenuArrow>
    );
  };

  // Komisyon Başkanı için menü öğeleri
  const commissionChairmanMenuItems = [
    {
      title: 'Genel Durum',
      icon: 'element-11',
      path: '/commissionChairman/dashboard',
    },
    {
      title: 'Komisyon Üyeleri',
      icon: 'people',
      path: '/commissionChairman/commission',
    },
    {
      title: 'Başvuru Yönetimi',
      icon: 'document',
      children: [
        {
          title: 'Başvurular',
          path: '/commissionChairman/internship-applications',
        },
        {
          title: 'Atamalar',
          path: '/commissionChairman/applications/assignments',
        },
      ]
    },
    {
      title: 'Staj Kuralları',
      icon: 'chart-line-up-2',
      children: [
        {
          title: 'Staj Türü Yönetimi',
          path: '/commissionChairman/internship-settings/type-management',
        },
        {
          title: 'Konu Havuzu Yönetimi',
          path: '/commissionChairman/internship-settings/topic-pool',
        },
        {
          title: 'Belgeler',
          path: '/commissionChairman/internship-settings/documents',
        },
      ]
    },
    {
      title: 'Staj Ayarları',
      icon: 'setting-2',
      children: [
        {
          title: 'Red Gerekçeleri',
          path: '/commissionChairman/internship-settings/rejection-reasons',
        },
        {
          title: 'Staj Detayları',
          path: '/commissionChairman/internship-settings/internship-details',
        },
      ]
    },
    {
      title: 'SSS Yönetimi',
      icon: 'questionnaire-tablet',
      path: '/commissionChairman/faq',
    },
    {
      title: 'Hesap Ayarları',
      icon: 'setting-2',
      path: '/commissionChairman/settings',
    }
  ];

  // Build menu items from configuration
  const buildMenuItems = () => {
    return commissionChairmanMenuItems.map((item, index) => {
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
    </Menu>
  );
};

export { SidebarMenuCommissionChairman };