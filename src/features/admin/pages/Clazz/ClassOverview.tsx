import { Avatar } from 'antd';
import { useAppSelector } from '../../../../store/store';
import { CurrencyUtils } from '../../../../utils/CurrencyUtils';
import ClassHeaderDetails from './components/ClassHeaderDetails';
import ScheduleSession from './components/ScheduleSession';

const ClassOverview = () => {
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  if (!clazz) return null;
  return (
    <div className='space-y-4'>
      <ClassHeaderDetails />
      <div className='bg-white  rounded-lg shadow-md'>
        <h1 className='text-xl font-bold bg-sky-950 rounded-t-lg px-4 py-2 text-white'>Class Overview</h1>
        <div className='p-4 grid gap-4 grid-cols-12'>
          <div className='col-span-12'>
            <Avatar key={clazz.id} src={clazz.avatarUrl} 
            className='!h-42 !w-42' shape='square'
            alt={clazz.name} />
          </div>
          <span className='col-span-6'>
            <strong>Class Id: </strong> {clazz.id}
          </span>
          <span className='col-span-6'>
            <strong>Class Name: </strong> {clazz.name}
          </span>
          <span className='col-span-6'>
            <strong>Created At: </strong> {new Date(clazz.createdAt).toLocaleString()}
          </span>
          <span className='col-span-6'>
            <strong>Created By: </strong> {clazz.createdBy.fullName}
          </span>
          <span className='col-span-12'>
            <strong>Max Seats: </strong> {clazz.maxSeats}
          </span>
          <span className='col-span-12'>
            <strong>Total Sessions: </strong> {clazz.totalSessions}
          </span>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-4'>
        <div className='bg-white col-span-4 rounded-lg shadow-md'>
        <h1 className='text-xl font-bold  bg-sky-950 rounded-t-lg px-4 py-2 text-white'>Course</h1>
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
      </div>
     {/* <ManagersForClassSession clazz={clazz} /> */}
    </div>
  )
}

export default ClassOverview