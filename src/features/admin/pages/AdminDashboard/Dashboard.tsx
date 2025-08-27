import React from 'react'
import TodaySessionsComponent from '../../components/TodaySessionsComponent/TodaySessionsComponent'
import MissedSessionsComponent from '../../components/MissedSessionsComponent/MissedSessionsComponent'

const Dashboard = () => {
  return (
    <div>

    <div className='grid grid-cols-1 gap-4'>
      <TodaySessionsComponent/>
<MissedSessionsComponent/>
    </div>

    </div>
  )
}

export default Dashboard