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
      title: 'Staj Yönetimi',
      icon: 'element-11',
      children: [
        { title: 'Panel', path: '/student/dashboard' },
        { title: 'Başvurularım', path: '/student/applications' },
        { title: 'Staj Süreçlerim', path: '/student/processes' },
        { title: 'Staj Defteri', path: '/student/notebook' },
      ],
    },
    {
      title: 'Belgeler',
      icon: 'folder',
      children: [
        { title: 'Belge Yükleme', path: '/student/documents' },
      ],
    },
    {
      title: 'Destek',
      icon: 'message-question',
      children: [
        { title: 'Canlı Destek', path: '/student/support' },
        { title: 'SSS', path: '/student/faq' },
      ],
    },
    {
      title: 'Hesap Ayarları',
      icon: 'setting-2',
      children: [
        { title: 'Profilim', path: '/student/profile' },
        { title: 'Şifre Değiştir', path: '/student/change-password' },
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
      return null;
    });
  };

  return (
    <Menu highlight={true} multipleExpand={false} className="sidebar-menu-primary flex flex-col w-full gap-1.5 px-3.5">
      {buildMenuItems()}
      <div className="border-b border-gray-300 mt-4 mb-1 mx-3.5"></div>
    </Menu>
  );
};

export { SidebarMenuStudent }; 