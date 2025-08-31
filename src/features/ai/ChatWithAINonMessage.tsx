import React from 'react';
import { AiOutlineMessage } from 'react-icons/ai';

const ChatWithAINonMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <AiOutlineMessage className="text-4xl mb-2" />
      <p className="text-lg font-semibold">No AI messages yet</p>
      <p className="text-sm">Ask something to start a conversation with AI.</p>
    </div>
  );
};

export default ChatWithAINonMessage;