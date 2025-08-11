import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchClazz } from "../../../../store/admin/classDetails";
import Loading from "../../../../components/common/Loading";
import { Menu, type MenuProps } from "antd";
import { getItem } from "../../components/AdminMenu/AdminMenu";
type MenuItem = Required<MenuProps>['items'][number];

const ClassDetails = () => {
  const { classId } = useParams<{ classId: string }>();
const items: MenuItem[] = [
  getItem('Overview', `/admin/classes/details/${classId}`),
  getItem('Information', `/admin/classes/details/${classId}/information`),
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

  if (loading !== false) {
    return <Loading />;
  }
  if (!clazz) {
    return <div>No class found</div>;
  }
  const getSelectedKeys = () => {
    const path = location.pathname;
    console.log('Current path for selected keys:', path);
    if (path.startsWith('/admin/classes/details/')) {
      return [path];
    }
  };
  return (
    <div className="grid gap-4 grid-cols-[20rem_1fr]">
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">Menu</h1>
            <Menu
          selectedKeys={getSelectedKeys()}
          mode="inline"
          items={items}

          // onClick={handleMenuClick}
          className="border border-gray-200 rounded-md"

        />
        </div>
      </div>
      <div>{clazz && <Outlet />}</div>
    </div>
  );
};

export default ClassDetails;
