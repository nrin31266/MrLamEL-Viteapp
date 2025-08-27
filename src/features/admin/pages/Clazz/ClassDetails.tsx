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
      <div className="bg-white rounded-md shadow-sm h-max top-6 sticky z-10">
        <div>
          <div className="bg-sky-950 rounded-t-md">
            <h1 className="text-xl py-2 text-white font-semibold text-center">Menu</h1>
          </div>
          <Menu
            selectedKeys={getSelectedKeys()}
            mode="inline"
            items={items}
            onClick={handleMenuClick}
            className="border-gray-200"
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="grid grid-rows-[1fr] gap-4">
        
        <Outlet />
      </div>
    </div>
  );
};

export default ClassDetails;
