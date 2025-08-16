import { Button, message, Modal } from 'antd'
import React from 'react'
import type { IClassSchedule, IClazz } from '../../../../../store/admin/classManagement';
import FormScheduleModal from './FormScheduleModal';
import { useAppDispatch } from '../../../../../store/store';
import { deleteClassSchedule } from '../../../../../store/admin/classDetails';
import { setAssignTeacherModal } from '../../../../../store/admin/assignTeacher';
import { setAssignRoomModal } from "../../../../../store/admin/assignRoom";
import { FaChalkboardTeacher, FaDoorOpen } from "react-icons/fa";
interface ScheduleSessionProps {
  clazz: IClazz; // Replace 'any' with the actual type of clazz
}
const ScheduleSession: React.FC<ScheduleSessionProps> = ({ clazz }) => {
    const isAllowCreate = clazz.status === 'DRAFT';
    const isAllowDelete = clazz.status === 'DRAFT';
    const isAllowUpdate = clazz.status === 'DRAFT';
      const isAllowAssign =
    clazz?.status !== "DRAFT" && clazz?.status !== "CANCELLED";
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const dispatch = useAppDispatch();
    const [selectedSchedule, setSelectedSchedule] = React.useState<IClassSchedule>();
    const handleRemoveSchedule =async (id: number) => {
      // Dispatch deleteClassSchedule action
      Modal.confirm({
        title: 'Confirm Deletion',
        content: 'Are you sure you want to delete this schedule?',
        onOk: async () => {
          await dispatch(deleteClassSchedule(id));
          if(selectedSchedule && selectedSchedule.id === id) {
            setSelectedSchedule(undefined);
          }
          message.success('Schedule deleted successfully');
        },
      });
    };
  return (
    <div>
         <div className='bg-white  rounded-lg shadow-md mt-4'>
         <div className='flex justify-between items-center bg-gray-200 rounded-t-lg p-4'>
          <h1 className='text-xl font-bold '>Schedules</h1>
          <div>
            <Button type="primary" disabled={!isAllowCreate} hidden={!isAllowCreate} onClick={() => {
              setIsModalOpen(true);
              setSelectedSchedule(undefined);
            }}>Add Schedule</Button>
          </div>
         </div>
         {
          clazz.schedules.length > 0 ? (
            <div className='p-4 space-y-4'>
              {clazz.schedules.map((schedule, index) => (
                <div key={index} className='border-b border-gray-200'>
                  <div className='flex justify-between items-center py-2'>
                    <div>
                      <p className='font-semibold'>{`Schedule ${index + 1}`}</p>
                      <p className='text-gray-600'>{`Day: ${schedule.dayOfWeek}`}</p>
                      <p className='text-gray-600'>{`Time: ${schedule.startTime} - ${schedule.endTime}`}</p>
                      <p><span className='font-semibold'>Teacher: </span>
                      <span>{schedule.teacher ? schedule.teacher.id + '- ' + schedule.teacher.fullName + ' (' + schedule.teacher.email + ')' : 'Not assigned'}</span>
                      </p>
                      <p><span className='font-semibold'>Room: </span>
                      <span>
                        {schedule.room 
                          ? `${schedule.room.code} - ${schedule.room.name} (Capacity: ${schedule.room.capacity})`
                          : 'Not assigned'}
                      </span>
                      </p>
                      {schedule.room?.branch && (
                        <p><span className='font-semibold'>Branch: </span>
                        <span>
                          {`${schedule.room.branch.name}, ${schedule.room.branch.address} (Phone: ${schedule.room.branch.phone})`}
                        </span>
                        </p>
                      )}
                    </div>
                    <div className='flex gap-4'>
                      <Button disabled={!isAllowUpdate} hidden={!isAllowUpdate} type="link" onClick={() => {
                        setSelectedSchedule(schedule);
                        setIsModalOpen(true);
                      }}>Edit</Button>
                      <Button disabled={!isAllowDelete} hidden={!isAllowDelete} type="link" danger onClick={() => {
                        handleRemoveSchedule(schedule.id);
                      }}>Delete</Button>
                      <Button icon={<FaChalkboardTeacher />} disabled={!isAllowAssign} hidden={!isAllowAssign} type="primary" onClick={() => {
                        dispatch(setAssignTeacherModal({open: true, mode: 'by-schedule', scheduleId: schedule.id}));
                      }}>Assign Teacher</Button>
                      <Button icon={<FaDoorOpen />} disabled={!isAllowAssign} hidden={!isAllowAssign} type="primary" onClick={() => {
                        dispatch(setAssignRoomModal({open: true, mode: 'by-schedule', scheduleId: schedule.id}));
                      }}>Assign Room</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='p-4'>No schedules available</div>
          )}
      </div>
      <FormScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSchedule={selectedSchedule}
      />
    </div>
  )
}

export default ScheduleSession