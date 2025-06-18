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

const SidebarMenuStudent = () => {
  const buildMenuArrow = () => (
    <MenuArrow className="text-gray-600 menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
      <KeenIcon icon="down" className="text-xs menu-item-show:hidden" />
      <KeenIcon icon="up" className="text-xs hidden menu-item-show:inline-flex" />
    </MenuArrow>
  );

  // Student specific menu items (submenu yapısı)
  const studentMenuItems = [
    {
      title: 'Anasayfa',
      icon: 'home-2',
      path: '/student/dashboard',
    },
    {
      title: 'Staj İşlemleri',
      icon: 'briefcase',
      children: [
        { title: 'Staj Başvurusu', path: '/student/internship-application' },
        { title: 'Başvurularım', path: '/student/my-applications' },
        { title: 'Staj Defteri Yükleme', path: '/student/notebook-upload' },
      ],
    },
    {
      title: 'Hesap Ayarları',
      icon: 'setting-2',
      path: '/student/settings',
    },
    {
      title: 'Destek',
      icon: 'message-question',
      children: [
        { title: 'Canlı Destek', path: '/student/support' },
        { title: 'SSS', path: '/student/faq' },
      ],
    },
  ];

  // Build menu items from configuration
  const buildMenuItems = () => {
    return studentMenuItems.map((item, index) => {
      if (item.children) {
        return (
          <MenuItem key={index} toggle="accordion" trigger="click">
            <MenuLink className="gap-2.5 py-2 px-2.5 rounded-md border border-transparent hover:border-[#13126e] hover:bg-[#e8e8f5]">
              <MenuIcon className="items-start text-gray-600 text-lg menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
                <KeenIcon icon={item.icon} />
              </MenuIcon>
              <MenuTitle className="font-medium text-sm text-gray-800 menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
                {item.title}
              </MenuTitle>
              {buildMenuArrow()}
            </MenuLink>
            <MenuSub className="menu-accordion gap-px ps-7">
              {item.children.map((child, childIndex) => (
                <MenuItem key={childIndex}>
                  <MenuLink
                    path={child.path}
                    className="py-2 px-2.5 rounded-md border border-transparent menu-item-active:border-[#13126e] menu-item-active:bg-[#e8e8f5] menu-link-hover:bg-[#e8e8f5] menu-link-hover:border-[#13126e]"
                  >
                    <MenuTitle className="text-2sm text-gray-800 menu-item-active:text-[#13126e] menu-link-hover:text-[#13126e]">
                      {child.title}
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
              <KeenIcon icon={item.icon} />
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

export { SidebarMenuStudent }; 