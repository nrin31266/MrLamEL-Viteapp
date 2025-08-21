import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchClazz } from "../../../../store/admin/classDetails";
import Loading from "../../../../components/common/Loading";
import { Menu, type MenuProps } from "antd";
import ClassHeaderDetails from "./components/ClassHeaderDetails";

const ClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: `/admin/classes/details/${classId}`,
      label: "Overview",
    },
    {
      key: `/admin/classes/details/${classId}/sessions`,
      label: "Sessions",
    },
    {
      key: `/admin/classes/details/${classId}/participants`,
      label: "Participants",
    },
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
    if (path.startsWith("/admin/classes/details/")) {
      if (path.startsWith(`/admin/classes/details/${classId}/sessions`)) {
        return [`/admin/classes/details/${classId}/sessions`];
      }
      return [path];
    }
    return [];
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key.startsWith("/admin/classes/details")) {
      navigate(e.key);
    }
  };

  return (
    <div className="grid gap-4 grid-cols-[16rem_1fr]">
      <div className="bg-white p-4 rounded-md shadow-sm h-max top-6 sticky z-10">
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
