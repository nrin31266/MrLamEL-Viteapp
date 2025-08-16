import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchClazz } from "../../../../store/admin/classDetails";
import Loading from "../../../../components/common/Loading";
import { Menu, type MenuProps } from "antd";
import { getItem } from "../../components/AdminMenu/AdminMenu";
import ClassHeaderDetails from "./components/ClassHeaderDetails";
type MenuItem = Required<MenuProps>["items"][number];

const ClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const items: MenuItem[] = [
    getItem("Overview", `/admin/classes/details/${classId}`),
    getItem("Sessions", `/admin/classes/details/${classId}/sessions`),
    getItem("Participants", `/admin/classes/details/${classId}/participants`),
  ];

  const loading = useAppSelector(
    (state) => state.admin.classDetails.loadings.fetch
  );

  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (classId) {
      dispatch(fetchClazz(classId));
    }
  }, [classId, dispatch]);

  if (loading) {
    return <Loading />;
  }
  if (!clazz || clazz.id !== Number(classId)) {
    return <div>No class found</div>;
  }
  const getSelectedKeys = () => {
    const path = location.pathname;
    // console.log("Current path for selected keys:", path);
    if (path.startsWith("/admin/classes/details/")) {
      return [path];
    }
  };
  
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key.startsWith("/admin/classes/details")) {
      navigate(e.key);
    }
  };

  return (
    <div className="grid gap-4 grid-cols-[16rem_1fr]">
      <div className="bg-white p-4 rounded-md shadow-sm  sticky h-[calc(100vh-8rem)] top-6">
        <div>
          <h1 className="text-xl font-semibold">Menu</h1>
          <Menu
            selectedKeys={getSelectedKeys()}
            mode="inline"
            items={items}
            onClick={handleMenuClick}
            className="border border-gray-200 rounded-md"
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="grid grid-rows-[auto_1fr] gap-4">
        <ClassHeaderDetails />
        <Outlet />
      </div>
    </div>
  );
};

export default ClassDetails;
