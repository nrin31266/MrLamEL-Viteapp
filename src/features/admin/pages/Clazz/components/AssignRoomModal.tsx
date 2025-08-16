import { Button, message, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import {
  assignRoom,
  fetchAvailableRoomsForClasses,
  setAssignRoomModal,
} from "../../../../../store/admin/assignRoom";
import Loading from "../../../../../components/common/Loading";
import { useLocation } from "react-router-dom";
import type { IRoomDto } from "../../../../../store/admin/roomSlide";
import { setClazz } from "../../../../../store/admin/classDetails";
import { fetchClassSessionsByClassId } from "../../../../../store/admin/classSessions";

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const AssignRoomModal = () => {
  const openAssignRoomModal = useAppSelector(
    (state) => state.admin.assignRoom.open
  );
  const { mode, clazzId, scheduleId, sessionId, availableRooms } = useAppSelector(
    (state) => state.admin.assignRoom
  );
  const { assignRoom: assignRoomLoading, fetchAvailableRooms: fetchAvailableRoomsLoading } = useAppSelector(
    (state) => state.admin.assignRoom.loadings
  );
  const [selectedRoom, setSelectedRoom] = useState<IRoomDto | undefined>(undefined);
  const { assignRoom: assignRoomError } = useAppSelector((state) => state.admin.assignRoom.errors);
  const location = useLocation();
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);

  useEffect(() => {
    if (!openAssignRoomModal) return;
    const targetId =
      mode === "by-clazz"
        ? clazzId
        : mode === "by-schedule"
        ? scheduleId
        : sessionId;
    if (!targetId) return;
    dispatch(
      fetchAvailableRoomsForClasses({
        mode,
        ...(mode === "by-clazz" && { clazzId: String(targetId) }),
        ...(mode === "by-schedule" && { scheduleId: String(targetId) }),
        ...(mode === "by-session" && { sessionId: String(targetId) }),
      })
    );
  }, [mode, clazzId, scheduleId, sessionId]);

  const handleAssignRoom = () => {
    if (!selectedRoom || !clazz) return;
    const targetId =
      mode === "by-clazz"
        ? clazzId
        : mode === "by-schedule"
        ? scheduleId
        : sessionId;
    if (!targetId) return;
    dispatch(
      assignRoom({
        mode,
        ...(mode === "by-clazz" && { clazzId: String(targetId), roomId: String(selectedRoom.id) }),
        ...(mode === "by-schedule" && { scheduleId: String(targetId), roomId: String(selectedRoom.id) }),
        ...(mode === "by-session" && { sessionId: String(targetId), roomId: String(selectedRoom.id) }),
      })
    ).unwrap().then(() => {
      switch (mode) {
        case "by-clazz":
          dispatch(setClazz({ ...clazz, schedules: clazz.schedules.map(schedule => ({...schedule, room: selectedRoom})) }));
          dispatch(fetchClassSessionsByClassId(clazz.id));
          break;
        case "by-schedule":
          dispatch(setClazz({...clazz, schedules: clazz.schedules.map(schedule => {
            if (schedule.id === targetId) {
              return {...schedule, room: selectedRoom};
            }
            return schedule;
          })}));
          dispatch(fetchClassSessionsByClassId(clazz.id));
          break;
        case "by-session":
          break;

        
      }
      
      dispatch(setAssignRoomModal({ open: false }));
      message.success("Room assigned successfully");
    });
  };

  const dispatch = useAppDispatch();

  return (
    <Modal
      width={800}
      title={<h1 className="text-2xl font-semibold">Assign Room</h1>}
      open={openAssignRoomModal}
      okButtonProps={{ 
        disabled: !selectedRoom || availableRooms.length === 0
          || availableRooms.findIndex((room) => room.id === selectedRoom.id) === -1, 
        size: "large", 
        loading: assignRoomLoading 
      }}
      okText="Assign"
      cancelButtonProps={{ size: "large" }}
      onOk={() => { handleAssignRoom(); }}
      onCancel={() => {
        dispatch(setAssignRoomModal({ open: false }));
      }}
    >
      <div>
        <p className="text-gray-600">
          Note: The room will be assigned to the classes that have not yet been assigned a room.
        </p>
        {
          fetchAvailableRoomsLoading ? <Loading /> :
          availableRooms.length > 0 ? (
            <div className="">
              <h1 className="text-green-600 font-semibold">Available Rooms</h1>
              <Radio.Group
                value={selectedRoom?.id}
                onChange={(e) => setSelectedRoom(availableRooms.find(room => room.id === e.target.value))}
                style={style}
              >
                <div className="!space-y-4">
                  {availableRooms.map((room) => (
                    <Radio className="w-full border border-gray-200 rounded-md !p-4" key={room.id} value={room.id}>
                      <div className="grid gap-4 grid-cols-[auto_1fr_auto] ">
                        <span>Id: {room.id}</span>
                        <span className="font-semibold">Name: {room.name}</span>
                        <span className="text-gray-500">Capacity: {room.capacity}</span>
                      </div>
                      {room.branch && (
                        <div className="grid gap-4 grid-cols-[auto_1fr_auto]">
                          <span>Branch:</span>
                          <span className="font-semibold">{room.branch.name}</span>
                          <span className="text-gray-500">{`${room.branch.address} (Phone: ${room.branch.phone})`}</span>
                        </div>
                      )}
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            </div>
          ) : (
            <p>No available rooms found.</p>
          )
        }
        {
          assignRoomError && (
            <p className="error">{assignRoomError}</p>
          )
        }
      </div>
    </Modal>
  );
};

export default AssignRoomModal;
