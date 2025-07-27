import { Avatar, type MenuProps } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { logout, resetAuthState } from "../../../../../store/authSlide";
import { useNavigate } from "react-router-dom";
import { UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";

const useDropdownItems = (): MenuProps["items"] => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const logoutLoading = useAppSelector((state) => state.auth.loadings.logout);

  const handleLogout = async () => {
    await dispatch(logout())
      .unwrap()
      .then(() => {
        dispatch(resetAuthState());
        navigate("/auth/login", { replace: true });
      });
  };

  return [
    {
      key: "user",
      disabled: true,
      label: (
        <div className="flex items-center gap-2 py-2">
          <Avatar size={50} src={<img src={user?.avatarUrl || "/images/dfa.jpg"} />} />
          <div className="flex flex-col">
            <span className="text-gray-700 font-semibold">{user?.fullName || "User"}</span>
            <span className="text-gray-500 text-sm">{user?.email || "Email"}</span>
          </div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "settings",
    //   icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      key: "logout",
    //   icon: <LogoutOutlined />,
      danger: true,
      disabled: logoutLoading,
      label: logoutLoading ? "Logging out..." : "Logout",
      onClick: handleLogout,
      
    },
  ];
};

export default useDropdownItems;
