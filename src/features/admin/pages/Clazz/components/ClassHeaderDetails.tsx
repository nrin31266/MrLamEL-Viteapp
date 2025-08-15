import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { Button, Dropdown, Space, Tooltip, type MenuProps } from "antd";
import MarkClassOnReadyModal from "./MarkClassOnReadyModal";
import AssignTeacherModal from "./AssignTeacherModal";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { setAssignTeacherModal } from "../../../../../store/admin/assignTeacher";

const ClassHeaderDetails = () => {
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);

  const isAllowReady =
    clazz?.status === "DRAFT" && clazz?.schedules?.length > 0;
  const isAllowAssign =
    clazz?.status !== "DRAFT" && clazz?.status !== "CANCELLED";
  const [isOpenMarkClassOnReady, setIsOpenMarkClassOnReady] = useState(false);
 
  const dispatch = useAppDispatch();
  // Mô tả tooltip khi chưa ready
  const tooltipText = !isAllowReady
    ? clazz?.status !== "DRAFT"
      ? "Class must be in Draft status to Ready"
      : "At least one schedule is required"
    : "";
  const items: MenuProps["items"] = [
    {
      label: <a onClick={(e) => {
        e.preventDefault();
        dispatch(setAssignTeacherModal({open: true, mode: 'by-clazz', clazzId: clazz?.id}));
      }}>All Sessions</a>,
      key: "0",
    },
    {
      label: (
        <Link to={`/admin/classes/details/${clazz?.id}`}>
          Classified by schedule
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <Link to={`/admin/classes/details/${clazz?.id}/sessions`}>
          Specific lesson
        </Link>
      ),
      key: "2",
    },
  ];
  return (
    <header className="sticky top-0 z-10 h-max bg-white p-2 shadow">
      <div className="flex justify-end items-center gap-4">
        <Tooltip title={tooltipText}>
          <Button
            onClick={() => setIsOpenMarkClassOnReady(true)}
            size="large"
            type="primary"
            disabled={!isAllowReady}
          >
            {clazz?.status === "READY" ? "Readied" : "Not Ready"}
          </Button>
        </Tooltip>
        <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
          <Button
            icon={<DownOutlined />}
            disabled={!isAllowAssign}
            type="primary"
            size="large"
            onClick={(e) => e.preventDefault()}
          >
            Assign Teacher
          </Button>
        </Dropdown>
      </div>
      <MarkClassOnReadyModal
        isOpen={isOpenMarkClassOnReady}
        onClose={() => setIsOpenMarkClassOnReady(false)}
      />
      <AssignTeacherModal/>
    </header>
  );
};

export default ClassHeaderDetails;
