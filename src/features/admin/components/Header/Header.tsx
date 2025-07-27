import { Avatar, Button, Dropdown, Input, Space, type MenuProps } from "antd";
import { useAppSelector } from "../../../../store/store";
import useDropdownItems from "./components/DropdownMenu";


const Header = () => {
  const user = useAppSelector((state) => state.auth.user);
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Input placeholder="Search..." size="large" />
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
  );
};

export default Header;
