import React from 'react'
import TimeTableDaily from './TimeTableDaily'
import ClassStudying from '../../components/ClassStudying'

const TimeTable = () => {
  // const ref = useScrollRestoration();
  return (
    <div className='flex flex-col gap-4'>
      <TimeTableDaily />
      <ClassStudying />
    </div>
  )
}

export default TimeTable