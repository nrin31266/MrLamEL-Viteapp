import { Button, Divider } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';
interface Props {
  // Define any props if needed
  searchParams: URLSearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
  
}
const ClassControlPanel = ({ searchParams, setSearchParams }: Props) => {
    const navigate = useNavigate();
    const changeSearchParams = (key: string, value: string) => {
    // Nếu truyền "" thì xóa key khỏi searchParams
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      return newParams;
    });
  };
  return (
    <div className='bg-white p-4 shadow-md mb-6 flex justify-between items-center gap-4'>
      <div>
        <h1 className='text-xl font-bold text-gray-800'>Class Management</h1>
      </div>
        <div className='flex items-center gap-4'>
          <Divider variant='solid' type='vertical'/>
          <h2 className='text-lg font-semibold'>Tools</h2>
          <Button onClick={() => navigate('/admin/classes/create')} type="primary">Add Class</Button>
        </div>
    </div>
  )
}

export default ClassControlPanel