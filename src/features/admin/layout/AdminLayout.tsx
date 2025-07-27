import React, { useState } from 'react'
import { Outlet } from "react-router-dom";
import AdminMenu from '../components/AdminMenu/AdminMenu';
import AdminContent from '../components/AdminContent/AdminContent';
import Header from '../components/Header/Header';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (value: boolean) => {
    setCollapsed(value);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar Menu */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex-shrink-0`}>
        <AdminMenu collapsed={collapsed} onCollapse={onCollapse} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <Header/>
        {/* Content Area with scroll */}
        <main className="flex-1 overflow-auto">
          <AdminContent />
          
          {/* Footer */}
          <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-sm text-gray-600">
            Admin Panel ©2024 Created by MrLamEL
          </footer>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout