// AdminMenu.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  BookOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { MdDashboard } from "react-icons/md";
import type { MenuProps } from 'antd';
import { Menu, Button } from 'antd';
import { HiBuildingOffice2 } from "react-icons/hi2";
import { GrHomeOption } from "react-icons/gr";
type MenuItem = Required<MenuProps>['items'][number];
import { FaBook, FaTools } from "react-icons/fa";
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
  getItem('Tools', '/admin/tools', <FaTools />),
  getItem('Course', '/admin/courses', <FaBook />),
  getItem('Branches', '/admin/branches', <HiBuildingOffice2 />),
  getItem('Rooms', '/admin/rooms', <GrHomeOption />),
  getItem('Users', 'sub3', <UserOutlined />, [
    getItem('Students', '/admin/users/students'),
    getItem('Teachers', '/admin/users/teachers'),
  ]),
  
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
    // console.log('Current path:', path);
    if (path === '/admin') return ['/admin'];
    if (path.includes('/admin/courses')) return ['/admin/courses'];
    if (path.includes('/admin/branches')) return ['/admin/branches'];
    if (path.includes('/admin/tools')) return ['/admin/tools'];
    if (path.includes('/admin/rooms')) return ['/admin/rooms'];
    if (path.includes('/admin/users/teachers')) return ['/admin/users/teachers'];
    if (path.includes('/admin/users/students')) return ['/admin/users/students'];
    if (path.includes('/admin/teachers')) return ['/admin/teachers'];
    if (path.includes('/admin/teachers/add')) return ['/admin/teachers/add'];
    
    if (path.includes('/admin/reports')) return ['/admin/reports'];
    if (path.includes('/admin/settings')) return ['/admin/settings'];
    return ['/admin'];
  };

  // // Get open keys for submenus
  const getOpenKeys = () => {
    const path = location.pathname;
    console.log('Current path for open keys:', path);
    const openKeys = [];
    if (path.includes('/admin/teachers')) openKeys.push('sub1');
    if (path.includes('/admin/students')) openKeys.push('sub2');
    if (path.startsWith('/admin/users')) openKeys.push('sub3');
    return openKeys;
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Logo/Brand Area */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 gap-4">
          <img src="/images/logo.png" alt="" className='h-10' />
        {!collapsed && <img src="/images/logo-name.png" alt="" className='h-10' />}
      </div>

      {/* Menu Area with scroll */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
          className="border-r-0"
        />
      </div>

      {/* Sticky Collapse Button at Bottom */}
      <div className="p-2 bg-white">
        <Button
          type="default"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          className="!w-full "
          size="large"
        />
      </div>
    </div>
  );
};

export default AdminMenu;
