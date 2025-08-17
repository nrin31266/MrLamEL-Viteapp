import { Button, message, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import {
  assignTeacher,
  fetchAvailableTeachersForClasses,
  setAssignTeacherModal,
} from "../../../../../store/admin/assignTeacher";
import Loading from "../../../../../components/common/Loading";
import { useLocation } from "react-router-dom";
import type { IUser } from "../../../../../store/authSlide";
import { setClazz, type IClassSession } from "../../../../../store/admin/classDetails";
import { fetchClassSessionsByClassId, setClassSessions } from "../../../../../store/admin/classSessions";
const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};
const AssignTeacherModal = () => {
  const openAssignTeacherModal = useAppSelector(
    (state) => state.admin.assignTeacher.open
  );
  const { mode, clazzId, scheduleId, sessionId, availableTeachers } = useAppSelector(
    (state) => state.admin.assignTeacher
  );
  const { assignTeacher: assignTeacherLoading, fetchAvailableTeachers: fetchAvailableTeachersLoading } = useAppSelector(
    (state) => state.admin.assignTeacher.loadings
  );
  const [selectedTeacher, setSelectedTeacher] = useState<IUser | undefined>(undefined);
  const { assignTeacher: assignTeacherError } = useAppSelector((state) => state.admin.assignTeacher.errors);
  const location = useLocation();
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  useEffect(() => {
    if (!openAssignTeacherModal) return;
    const targetId =
      mode === "by-clazz"
        ? clazzId
        : mode === "by-schedule"
        ? scheduleId
        : sessionId;
    if (!targetId) return;
    dispatch(
      fetchAvailableTeachersForClasses({
        mode,
        ...(mode === "by-clazz" && { clazzId: String(targetId) }),
        ...(mode === "by-schedule" && { scheduleId: String(targetId) }),
        ...(mode === "by-session" && { sessionId: String(targetId) }),
      })
    );
  }, [mode, clazzId, scheduleId, sessionId]);
  const handleAssignTeacher = () => {
    if (!selectedTeacher || !clazz) return;
    const targetId =
      mode === "by-clazz"
        ? clazzId
        : mode === "by-schedule"
        ? scheduleId
        : sessionId;
    if (!targetId) return;
    dispatch(
      assignTeacher({
        mode,
        ...(mode === "by-clazz" && { clazzId: String(targetId), teacherId: String(selectedTeacher.id) }),
        ...(mode === "by-schedule" && { scheduleId: String(targetId), teacherId: String(selectedTeacher.id) }),
        ...(mode === "by-session" && { sessionId: String(targetId), teacherId: String(selectedTeacher.id) }),
      })
    ).unwrap().then(() => {
      switch (mode) {
        case "by-clazz":
          // Handle success for by-clazz
          dispatch(setClazz({ ...clazz, schedules: clazz.schedules.map(schedule => ({...schedule, teacher: selectedTeacher})) }));
          dispatch(fetchClassSessionsByClassId(clazz.id));
          break;
        case "by-schedule":
          // Handle success for by-schedule, thay cái teacher
          
          dispatch(setClazz({...clazz, schedules: clazz.schedules.map(schedule => {
            if (schedule.id === targetId) {
              return {...schedule, teacher: selectedTeacher};
            }
            dispatch(fetchClassSessionsByClassId(clazz.id));
            return schedule;
          })}));
          break;
        case "by-session":
          // Handle success for by-session
          dispatch(setClassSessions((pre: IClassSession[]) => pre.map((session) => {
            if (session.id === targetId) {
              return { ...session, teacher: selectedTeacher };
            }
            return session;
          })));
          break;
      }
      
      dispatch(setAssignTeacherModal({ open: false }));
      message.success("Teacher assigned successfully");
    });
  };
  const dispatch = useAppDispatch();
  return (
    <Modal
    width={800}
      title={<h1 className="text-2xl font-semibold">Assign Teacher</h1>}
      open={openAssignTeacherModal}
      okButtonProps={ { disabled: !selectedTeacher || availableTeachers.length === 0
        || availableTeachers.findIndex((teacher) => teacher.id === selectedTeacher.id) === -1, size: "large", loading: assignTeacherLoading }}
      okText="Assign"
      cancelButtonProps={{ size: "large" }}
      onOk={() => {handleAssignTeacher()}}
      onCancel={() => {
        dispatch(setAssignTeacherModal({ open: false }));
      }}
    >
      <div>
        
        <p className="text-gray-600">
          Note: The teaching teacher will be assigned to the classes that have
          not yet been taught.
        </p>
        {
          fetchAvailableTeachersLoading ? <Loading/>:
          availableTeachers.length > 0 ? (
            <div className="">
              <h1 className="text-green-600 font-semibold">Available Teachers</h1>
              <Radio.Group
                value={selectedTeacher?.id}
                onChange={(e) => setSelectedTeacher(availableTeachers.find(teacher => teacher.id === e.target.value))}
                style={style}
                
              >
                <div className="!space-y-4">
                  {availableTeachers.map((teacher) => (
                  <Radio className="w-full border border-gray-200 rounded-md !p-4" key={teacher.id} value={teacher.id}>
                   <div className="grid gap-4 grid-cols-[3rem_1fr_auto]">
                    <span>Id: {teacher.id}</span>
                    <span className="font-semibold">Name: {teacher.fullName}</span>
                    <span className="text-gray-500">Email: {teacher.email}</span>
                   </div>
                  </Radio>
                ))}
                </div>
              </Radio.Group>
            </div>
          ) : (
            <p>No available teachers found.</p>
          )
        }
        {
          assignTeacherError && (
            <p className="error">{assignTeacherError}</p>
          )
        }
      </div>
    </Modal>
  );
};

export default AssignTeacherModal;
