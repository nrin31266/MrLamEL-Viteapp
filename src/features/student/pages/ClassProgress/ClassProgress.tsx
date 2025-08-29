import React from 'react'
import ClassProgressComponent from '../../components/ClassProgressComponent'
import { useParams } from 'react-router-dom'

const ClassProgress = () => {
  const { classId } = useParams<{ classId: string }>();
  if(!classId) return null;

  return (
    <div>
      
      <ClassProgressComponent classId={classId} />
    </div>
  )
}

export default ClassProgress