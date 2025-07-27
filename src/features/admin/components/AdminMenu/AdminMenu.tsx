// AdminMenu.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  BookOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { MdDashboard } from "react-icons/md";
import type { MenuProps } from 'antd';
import { Menu, Button } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '/admin', <MdDashboard />),
  getItem('Manage Users', '/admin/users', <UserOutlined />),
  getItem('Teachers', 'sub1', <TeamOutlined />, [
    getItem('All Teachers', '/admin/teachers'),
    getItem('Add Teacher', '/admin/teachers/add'),
  ]),
  getItem('Students', 'sub2', <BookOutlined />, [
    getItem('All Students', '/admin/students'),
    getItem('Add Student', '/admin/students/add'),
  ]),
  getItem('Reports', '/admin/reports', <BarChartOutlined />),
  getItem('Settings', '/admin/settings', <SettingOutlined />),
];

interface AdminMenuProps {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key.startsWith('/admin')) {
      navigate(e.key);
    }
  };

  // Get current selected key based on location
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/admin') return ['/admin'];
    if (path.includes('/admin/users')) return ['/admin/users'];
    if (path.includes('/admin/teachers')) return ['/admin/teachers'];
    if (path.includes('/admin/students')) return ['/admin/students'];
    if (path.includes('/admin/reports')) return ['/admin/reports'];
    if (path.includes('/admin/settings')) return ['/admin/settings'];
    return ['/admin'];
  };

  // Get open keys for submenus
  const getOpenKeys = () => {
    const path = location.pathname;
    const openKeys = [];
    if (path.includes('/admin/teachers')) openKeys.push('sub1');
    if (path.includes('/admin/students')) openKeys.push('sub2');
    return openKeys;
  };

  return (
    <div className="h-full bg-white flex flex-col border-r border-gray-200">
      {/* Logo/Brand Area */}
      <div className="h-16 flex gap-4 items-center justify-center px-4 border-gray-200">
        <img src="/images/logo.png" alt="" className='h-12' />
        {!collapsed && <img src="/images/logo-name.png" alt="" className='h-12' />}
      </div>

      {/* Menu Area with scroll */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Menu
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
          className="border-r-0"
          lang='en'
          
        />
      </div>

      {/* Sticky Collapse Button at Bottom */}
      <div className="border-gray-200 p-2 bg-white">
        <Button
          type="default"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          className="!w-full hover:bg-gray-100 text-gray-600"
          size="large"
        />
      </div>
    </div>
  );
};

export default AdminMenu;
