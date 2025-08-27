import React from "react";
import { Menu, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
type MenuItem = Required<MenuProps>["items"][number];
import { FaCalendarAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
interface StudentMenuProps {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
  isLarge: boolean;
}
const StudentMenu = ({ collapsed, onCollapse, isLarge }: StudentMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const items: MenuItem[] = [
    {
      key: "/sub1",
      label: "Timetable",
      icon: <FaCalendarAlt />,
      children: [
        {
          key: "/Student/timetable",
          label: "General",
        },
        {
          key: "/Student/timetable/weekly",
          label: "Weekly",
        },
      ],
    },
    {
      key: "/Student/profile",
      label: "Profile",
      icon: <CgProfile />,
    },
  ];
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith("/Student")) {
      return [path];
    }
    return [];
  };
//   const getOpenKeys = () => {
//     const path = location.pathname;
//     // console.log('Current path for open keys:', path);
//     const openKeys = [];
//     if (path.includes('/Student/timetable')) openKeys.push('sub1');
//     return openKeys;
//   };

  return (
    <div
        hidden={!isLarge && collapsed}
        className="flex flex-col h-[100vh]"
    >
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 gap-4">
        <img src="/images/logo.png" alt="" className="h-10" />
        {(!collapsed && isLarge) && (
          <img src="/images/logo-name.png" alt="" className="h-10" />
        )}
      </div>

       <Menu
          mode="inline"
          items={items}
          selectedKeys={getSelectedKeys()}
          
          onClick={handleMenuClick}
          inlineCollapsed={collapsed || !isLarge}
          className={`flex-1 ${(collapsed || !isLarge) ? "!w-16" : "!w-64"}`}
        />
    </div>
  );
};

export default StudentMenu;
