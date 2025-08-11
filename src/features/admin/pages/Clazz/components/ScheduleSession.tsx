import { Button } from 'antd'
import React from 'react'
import type { IClassSchedule, IClazz } from '../../../../../store/admin/classManagement';
import FormScheduleModal from './FormScheduleModal';
interface ScheduleSessionProps {
  clazz: IClazz; // Replace 'any' with the actual type of clazz
}
const ScheduleSession: React.FC<ScheduleSessionProps> = ({ clazz }) => {
    const isActionDisabled = clazz.status === 'ONGOING' || clazz.status === 'FINISHED' || clazz.status === 'CANCELLED';
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedSchedule, setSelectedSchedule] = React.useState<IClassSchedule>();
  return (
    <div>
         <div className='bg-white  rounded-lg shadow-md mt-4'>
         <div className='flex justify-between items-center bg-gray-200 rounded-t-lg p-4'>
          <h1 className='text-xl font-bold '>Schedules</h1>
          <div>
            <Button type="primary" disabled={isActionDisabled} onClick={() => setIsModalOpen(true)}>Add Schedule</Button>
          </div>
         </div>
         {
          clazz.schedules.length > 0 ? (
            <div className='p-4'>
              {clazz.schedules.map((schedule, index) => (
                <div key={index} className='border-b border-gray-200 py-2'>
                 hihi
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
      />
    </div>
  )
}

export default ScheduleSession