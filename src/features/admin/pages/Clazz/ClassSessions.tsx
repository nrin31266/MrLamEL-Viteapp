import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import Loading from '../../../../components/common/Loading';
import { fetchClassSessionsByClassId } from './../../../../store/admin/classDetails';

const ClassSessions = () => {
    const dispatch = useAppDispatch();
    const sessions = useAppSelector((state) => state.admin.classDetails.classSessions);
    const isLoading = useAppSelector((state) => state.admin.classDetails.loadings.fetchClassSessions);
    const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
    const notShow = clazz?.status === "DRAFT" || !clazz;

    useEffect(() => {
      if (clazz && !sessions && clazz.status !== "DRAFT") {
        dispatch(fetchClassSessionsByClassId(clazz.id));
      }
    }, [dispatch, clazz?.id]);

    if (isLoading) return <Loading/>;
  return (
    <div className=' bg-white rounded-lg shadow-md h-full'>
      <h2 className='text-xl font-semibold p-4 bg-gray-200 rounded-t-lg'>Class Sessions</h2>
      {
        notShow ? (
          <p className='text-gray-500 p-4'>No sessions available</p>
        ) : (
          <ul className='p-4'>
            {sessions && sessions.map((session) => (
              <li key={session.id}>{session.id}</li>
            ))}
          </ul>
        )
      }
    </div>
  )
}

export default ClassSessions