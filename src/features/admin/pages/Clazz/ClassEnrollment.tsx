import React, { useState } from 'react'
import UserEnrollmentModal from './components/UserEnrollmentModal'
import { Button } from 'antd';
import { FaUserPlus } from "react-icons/fa6";
const ClassEnrollment = () => {
    const [openClassEnrollmentModal, setOpenClassEnrollmentModal] = useState(false);
  return (
    <div>
        <div className='bg-white rounded-lg shadow-md h-full flex flex-col gap-4'>
            <div className='bg-gray-200 p-4 rounded-t-lg flex justify-between items-center'>
                <h2 className='text-xl font-bold !mb-0'>Class Enrollment</h2>
                <div>
                    <Button icon={<FaUserPlus />} type='default' onClick={() => setOpenClassEnrollmentModal(true)}>
                        Add students to the class
                    </Button>
                </div>
            </div>
            <div>

            </div>
        </div>
        <UserEnrollmentModal isOpen={openClassEnrollmentModal} onClose={() => setOpenClassEnrollmentModal(false)} />
    </div>
  )
}

export default ClassEnrollment