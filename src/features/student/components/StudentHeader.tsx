import { Avatar, Button, Dropdown, Input } from 'antd'
import React from 'react'
import { useAppSelector } from '../../../store/store';
import useDropdownItems from '../../admin/components/Header/components/DropdownMenu';
import MenuItem from 'antd/es/menu/MenuItem';
import { IoMenu } from "react-icons/io5";
interface StudentHeaderProps {
    collapsed: boolean;
    onCollapse: (value: boolean) => void;
}
const StudentHeader = ({ collapsed, onCollapse }: StudentHeaderProps) => {

    const user = useAppSelector((state) => state.auth.user);
    
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <Button onClick={() => onCollapse(!collapsed)} type='default' size='large' icon={<IoMenu />} />
      </div>
      <div className="flex items-center gap-4">
        <Dropdown placement="bottomRight" menu={{ items: useDropdownItems() }} trigger={["click"]}>
           <Avatar
           className="cursor-pointer"
              size={42}
              src={
                <img src={user?.avatarUrl || "/images/dfa.jpg"} alt="avatar" />
              }
            />
        </Dropdown>
      </div>
    </header>
  )
}

export default StudentHeader