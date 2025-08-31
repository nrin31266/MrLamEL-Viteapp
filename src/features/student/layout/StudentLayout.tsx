import React, { useEffect, useState } from 'react'
import StudentMenu from '../components/StudentMenu';
import StudentHeader from '../components/StudentHeader';
import { Outlet } from 'react-router-dom';
import ChatWithAI from '../../ai/ChatWithAI';

const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768 ? true : false);
  const [isLarge, setIsLarge] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 768) {
        setIsLarge(false);
      } else {
        setIsLarge(true);
      }
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
    const onCollapse = (value: boolean) => {
      setCollapsed(value);
    };

  return (
     <div className="h-screen flex bg-gray-50">
      {/* Sidebar Menu */}
      <div className={`transition-all duration-300 flex-shrink-0`}>
        <StudentMenu collapsed={collapsed} onCollapse={onCollapse} isLarge={isLarge} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <StudentHeader collapsed={collapsed} onCollapse={onCollapse} />
        {/* Content Area with scroll */}
        <main className="flex-1 overflow-auto">
          <div className='px-1 py-4'>
            <Outlet/>
            
          </div>
          
          {/* Footer */}
          <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-sm text-gray-600">
            Student Panel ©2024 Created by MrLamEL
          </footer>
        </main>
        <ChatWithAI/>
      </div>
      
    </div>
  )
}

export default StudentLayout