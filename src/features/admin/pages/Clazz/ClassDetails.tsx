import React from 'react'
import { useParams } from 'react-router-dom';

const ClassDetails = () => {
  const {classId} = useParams<{ classId: string }>();
  return (
    <div>ClassDetails: {classId}</div>
  )
}

export default ClassDetails