import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { Button, Tooltip, type MenuProps } from "antd";
import MarkClassOnReadyModal from "./MarkClassOnReadyModal";
import AssignTeacherModal from "./AssignTeacherModal";
import AssignRoomModal from "./AssignRoomModal";

const ClassHeaderDetails = () => {
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  if (!clazz) return null;

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

    const hidden = clazz?.status !== "DRAFT";
    const title = clazz?.status === "DRAFT" && clazz.schedules.length > 0 ? "Open class now" : "Please complete the schedule to open the class";

  return (
    <header className=" h-max bg-white p-2 shadow flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Class Details</h1>
      </div>
      <div className="flex justify-end items-center gap-4">
        <Tooltip title={tooltipText}>
          <Button
            hidden={hidden}
            onClick={() => setIsOpenMarkClassOnReady(true)}
            size="large"
            type="primary"
            disabled={!isAllowReady}
          >
            {title}
          </Button>
        </Tooltip>
       
      </div>
      <MarkClassOnReadyModal
        isOpen={isOpenMarkClassOnReady}
        onClose={() => setIsOpenMarkClassOnReady(false)}
      />
      
    </header>
  );
};

export default ClassHeaderDetails;
