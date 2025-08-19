import React from 'react'
import { useAppSelector } from '../../../../store/store';
import { CurrencyUtils } from '../../../../utils/CurrencyUtils';
import { Avatar, Button } from 'antd';
import ScheduleSession from './components/ScheduleSession';
import ManagersForClassSession from './components/ManagersForClassSession';

const ClassOverview = () => {
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  if (!clazz) return null;
  return (
    <div className='space-y-4'>
      <div className='bg-white  rounded-lg shadow-md'>
        <h1 className='text-xl font-bold bg-gray-200 rounded-t-lg p-4'>Class Overview</h1>
        <div className='p-4 grid grid-cols-12'>
          <div className='col-span-12'>
            <Avatar key={clazz.id} src={clazz.avatarUrl} 
            className='!h-42 !w-42' shape='square'
            alt={clazz.name} />
          </div>
          <p className='col-span-6'>
            <strong>Class Id: </strong> {clazz.id}
          </p>
          <p className='col-span-6'>
            <strong>Class Name: </strong> {clazz.name}
          </p>
          <p className='col-span-6'>
            <strong>Created At: </strong> {new Date(clazz.createdAt).toLocaleString()}
          </p>
          <p className='col-span-6'>
            <strong>Created By: </strong> {clazz.createdBy.fullName}
          </p>
          <p className='col-span-12'>
            <strong>Max Seats: </strong> {clazz.maxSeats}
          </p>
          <p className='col-span-12'>
            <strong>Total Sessions: </strong> {clazz.totalSessions}
          </p>
        </div>
      </div>
      <div className='bg-white  rounded-lg shadow-md'>
        <h1 className='text-xl font-bold bg-gray-200 rounded-t-lg p-4'>Course</h1>
        <div className='p-4'>
          <p>
            <strong>Code: </strong> {clazz.course.code}
          </p>
          <p>
            <strong>Name: </strong> {clazz.course.name}
          </p>
          <p>
            <strong>Fee: </strong> {CurrencyUtils.formatVND(clazz.course.fee)}
          </p>
        </div>
      </div>
     <ScheduleSession clazz={clazz} />
     <ManagersForClassSession clazz={clazz} />
    </div>
  )
}

export default ClassOverview