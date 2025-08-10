import { Button } from 'antd';
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
    <div className='bg-white p-4 rounded-lg shadow-md mb-6 flex justify-start items-center gap-4'>
        <Button onClick={() => navigate('/admin/classes/create')} type="primary">Add Class</Button>
    </div>
  )
}

export default ClassControlPanel