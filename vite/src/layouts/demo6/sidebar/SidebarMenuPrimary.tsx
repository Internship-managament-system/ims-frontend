import clsx from 'clsx';
import { KeenIcon } from '@/components/keenicons';
import {
  IMenuItemConfig,
  Menu,
  MenuArrow,
  TMenuConfig,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle
} from '@/components/menu';
import { useMenus } from '@/providers';

const SidebarMenuPrimary = () => {
  const subIndetion = ['ps-7', 'ps-2.5', 'ps-2.5'];

  const buildMenu = (items: TMenuConfig) => {
    return items.map((item, index) => {
      if (!item.heading && !item.disabled && item.title != 'Dashboards') {
        return buildMenuItemRoot(item, index, 0);
      }
    });
  };

  const buildMenuItemRoot = (item: IMenuItemConfig, index: number, level: number) => {
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
          <MenuSub className={clsx('menu-accordion gap-px', subIndetion[level])}>
            {buildMenuItemChildren(item.children, index, level + 1)}
          </MenuSub>
        </MenuItem>
      );
    } else {
      return (
        <MenuItem key={index}>
          <MenuLink
            path={item.path}
            className={clsx(
              'gap-2.5 py-2 px-2.5 rounded-md border border-transparent menu-item-active:border-[#13126e] menu-item-active:bg-[#e8e8f5] menu-link-hover:bg-[#e8e8f5] menu-link-hover:border-[#13126e]',
              subIndetion[level]
            )}
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
    }
  };

  const buildMenuItemChildren = (items: TMenuConfig, index: number, level: number = 0) => {
    return items.map((item, index) => {
      if (!item.disabled) {
        return buildMenuItemChild(item, index, level);
      }
    });
  };

  const buildMenuItemChild = (item: IMenuItemConfig, index: number, level: number = 0) => {
    if (item.children) {
      return (
        <MenuItem
          key={index}
          toggle="accordion"
          trigger="click"
          className={clsx(item.collapse && 'flex-col-reverse')}
        >
          <MenuLink className="py-2 px-2.5 rounded-md border border-transparent hover:border-[#13126e] hover:bg-[#e8e8f5]">
            {item.collapse ? (
              <MenuTitle className="text-2sm text-gray-600 menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
                <span className="hidden menu-item-show:!flex">{item.collapseTitle}</span>
                <span className="flex menu-item-show:hidden">{item.expandTitle}</span>
              </MenuTitle>
            ) : (
              <MenuTitle className="text-2sm text-gray-800 menu-item-active:text-[#13126e] menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
                {item.title}
              </MenuTitle>
            )}

            {buildMenuArrow()}
          </MenuLink>
          <MenuSub className={clsx('menu-accordion gap-px', !item.collapse && subIndetion[level])}>
            {buildMenuItemChildren(item.children, index, item.collapse ? level : level + 1)}
          </MenuSub>
        </MenuItem>
      );
    } else {
      return (
        <MenuItem key={index}>
          <MenuLink
            path={item.path}
            className="py-2 px-2.5 rounded-md border border-transparent menu-item-active:border-[#13126e] menu-item-active:bg-[#e8e8f5] menu-link-hover:bg-[#e8e8f5] menu-link-hover:border-[#13126e]"
          >
            <MenuTitle className="text-2sm text-gray-800 menu-item-active:text-[#13126e] menu-link-hover:text-[#13126e]">
              {item.title}
            </MenuTitle>
          </MenuLink>
        </MenuItem>
      );
    }
  };

  const buildMenuArrow = () => {
    return (
      <MenuArrow className="text-gray-600 menu-item-here:text-[#13126e] menu-item-show:text-[#13126e] menu-link-hover:text-[#13126e]">
        <KeenIcon icon="down" className="text-xs menu-item-show:hidden" />
        <KeenIcon icon="up" className="text-xs hidden menu-item-show:inline-flex" />
      </MenuArrow>
    );
  };

  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');

  return (
    <Menu highlight={true} multipleExpand={false} className="sidebar-menu-primary flex flex-col w-full gap-1.5 px-3.5">
      {menuConfig && buildMenu(menuConfig)}
    </Menu>
  );
};

export { SidebarMenuPrimary };