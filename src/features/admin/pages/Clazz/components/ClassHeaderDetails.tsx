import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { Button, Dropdown, Space, Tooltip, type MenuProps } from "antd";
import MarkClassOnReadyModal from "./MarkClassOnReadyModal";
import AssignTeacherModal from "./AssignTeacherModal";
import AssignRoomModal from "./AssignRoomModal";

const ClassHeaderDetails = () => {
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);

  const isAllowReady =
    clazz?.status === "DRAFT" && clazz?.schedules?.length > 0;
  
  const [isOpenMarkClassOnReady, setIsOpenMarkClassOnReady] = useState(false);
 
  const dispatch = useAppDispatch();
  // Mô tả tooltip khi chưa ready
  const tooltipText = !isAllowReady
    ? clazz?.status !== "DRAFT"
      ? "Class must be in Draft status to Ready"
      : "At least one schedule is required"
    : "";

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
       
      </div>
      <MarkClassOnReadyModal
        isOpen={isOpenMarkClassOnReady}
        onClose={() => setIsOpenMarkClassOnReady(false)}
      />
      <AssignTeacherModal />
      <AssignRoomModal />
    </header>
  );
};

export default ClassHeaderDetails;
