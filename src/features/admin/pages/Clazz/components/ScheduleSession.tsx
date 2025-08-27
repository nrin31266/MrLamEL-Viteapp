import { Button, message, Modal } from 'antd';
import React from 'react';
import { deleteClassSchedule } from '../../../../../store/admin/classDetails';
import type { IClassSchedule, IClazz } from '../../../../../store/admin/classManagement';
import { useAppDispatch } from '../../../../../store/store';
import FormScheduleModal from './FormScheduleModal';
interface ScheduleSessionProps {
  clazz: IClazz; // Replace 'any' with the actual type of clazz
}
const ScheduleSession: React.FC<ScheduleSessionProps> = ({ clazz }) => {
    const isAllowCreate = clazz.status === 'DRAFT';
    const isAllowDelete = clazz.status === 'DRAFT';
    const isAllowUpdate = clazz.status === 'DRAFT';
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
    <div className='col-span-8'>
         <div className='bg-white  rounded-lg shadow-md'>
         <div className='flex justify-between items-center bg-sky-950 rounded-t-lg px-4 py-2'>
          <h2 className='text-xl font-bold text-white'>Schedules</h2>
          <div>
            <Button hidden={!isAllowCreate} type='primary' className=''  disabled={!isAllowCreate} onClick={() => {
              setIsModalOpen(true);
              setSelectedSchedule(undefined);
            }}>Add Schedule</Button>
          </div>
         </div>
         {
          clazz.schedules.length > 0 ? (
            <div className='p-4 space-y-4'>
              {clazz.schedules.map((schedule, index) => (
                <div key={index} className='not-last:border-b border-gray-200'>
                  <div className='flex justify-between items-center py-2'>
                    <div>
                      <p className='font-semibold'>{`Schedule ${index + 1}`}</p>
                      <p className='text-gray-600'>{`Day: ${schedule.dayOfWeek}`}</p>
                      <p className='text-gray-600'>{`Time: ${schedule.startTime} - ${schedule.endTime}`}</p>
                    </div>
                    <div className='flex gap-4'>
                      <Button disabled={!isAllowUpdate} hidden={!isAllowUpdate} type="link" onClick={() => {
                        setSelectedSchedule(schedule);
                        setIsModalOpen(true);
                      }}>Edit</Button>
                      <Button disabled={!isAllowDelete} hidden={!isAllowDelete} type="link" danger onClick={() => {
                        handleRemoveSchedule(schedule.id);
                      }}>Delete</Button>
                     
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