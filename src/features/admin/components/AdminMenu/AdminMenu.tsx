// AdminMenu.tsx
import React from "react";
import { Menu, type MenuProps, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BsFillCCircleFill } from "react-icons/bs";
import { FaBook, FaTools } from "react-icons/fa";
import { GrHomeOption } from "react-icons/gr";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../store/store";
import { isPermissionContained } from "../../../../store/authSlide";

interface AdminMenuProps {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const admin= useAppSelector(state => state.auth.user);

  const items: MenuProps["items"] = [
    {
      key: "/admin",
      label: "Dashboard",
      icon: <MdDashboard />,
    },
    {
      key: "/admin/classes",
      label: "Classes",
      icon: <BsFillCCircleFill />,
    },
    {
      key: "/admin/tools",
      label: "Tools",
      icon: <FaTools />,
    },
    {
      key: "/admin/courses",
      label: "Course",
      icon: <FaBook />,
    },
    {
      key: "/admin/branches",
      label: "Branches",
      icon: <HiBuildingOffice2 />,
    },
    {
      key: "/admin/rooms",
      label: "Rooms",
      icon: <GrHomeOption />,
    },
    {
      key: "sub3",
      label: "Users",
      icon: <UserOutlined />,
      children: [
        {
          key: "/admin/users/students",
          label: "Students",
        },
        {
          key: "/admin/users/teachers",
          label: "Teachers",
        },
        {
          key: "/admin/users/admins",
          label: "Admins",
          style: { display: isPermissionContained(admin?.permissions || [], "MANAGE_ADMIN") ? "block" : "none" }, // Hide Admins for now
        },
      ],
    },
    {
      key: "/admin/settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key.startsWith("/admin")) {
      navigate(e.key);
    }
  };

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith("/admin")) {
      if(path.startsWith("/admin/classes")) return ["/admin/classes"];
      return [path];
    }
    return [];
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Logo/Brand Area */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 gap-4">
        <img src="/images/logo.png" alt="" className="h-10" />
        {!collapsed && <img src="/images/logo-name.png" alt="" className="h-10" />}
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          items={items}
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
          className="border-r-0"
        />
      </div>

      {/* Collapse Button */}
      <div className="p-2 bg-white">
        <Button
          type="default"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          className="!w-full"
          size="large"
        />
      </div>
    </div>
  );
};

export default AdminMenu;
