import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Tools = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate('/admin/holidays')}>View Holidays</Button>
    </div>
  )
}

export default Tools