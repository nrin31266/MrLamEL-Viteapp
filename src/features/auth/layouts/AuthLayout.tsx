import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='grid grid-rows-[auto_1fr_auto] h-screen container max-w-[73rem] mx-auto'>
        <div className='sticky top-0 bg-white z-50 p-2 flex gap-4 items-center'>
            <img src="/images/logo.png" alt="Logo" className='h-12' />
            <img src="/images/logo-name.png" alt="Auth" className='h-12' />
        </div>
        <div className='bg-gray-50 h-full flex items-center justify-center'>
            <Outlet />
        </div>
        <div className='bg-gray-100 text-center p-4 grid grid-rows-2 gap-2'>
            <div className='flex gap-4 text-gray-700 justify-center flex-wrap'>
                <a href="mailto:support@mrlamel.com" className='flex gap-1 items-center underline'><img src="/images/mail.png" alt="Logo" className='h-4' /> <span>support@mrlamel.com</span></a>
                <a href="" className='underline'>Zalo Group</a>
                <a href="" className='underline'>Zalo Support</a>
                <a href="" className='underline'>Facebook</a>
                <a href="tel:+1234567890" className='underline'>Phone: <span className='font-medium'>+1 234 567 890</span></a>
            </div>
            <div className='text-gray-500'>© 2025 MrLamEL. All rights reserved</div>
        </div>
    </div>
  )
}

export default AuthLayout