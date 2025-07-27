// AdminContent.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminContent: React.FC = () => {
  

  return (
    <div className='min-h-full p-6'>
        <Outlet />
    </div>
  );
};

export default AdminContent;
             