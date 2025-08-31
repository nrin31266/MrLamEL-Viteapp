import React, { useState } from 'react';
import { AiFillRobot } from "react-icons/ai";
import ChatModal from './ChatModal';


const ChatWithAI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='relative'>
      <div
        className='
          absolute bottom-20 z-10 right-10 w-max bg-blue-500 text-white p-3 items-center flex gap-1 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all duration-300'
        onClick={handleOpenModal}
      >
        <AiFillRobot className='inline-block size-6 animate-pulse' />
        Chat
      </div>
      <ChatModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ChatWithAI;