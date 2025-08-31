import React from 'react';
import type { IChatAIMessage } from '../../store/chatAISlide';
import dayjs from 'dayjs';
import { AiFillRobot } from "react-icons/ai";

interface Props {
  message: IChatAIMessage;
}

const ChatWithAIMessage = ({ message }: Props) => {
  const isAI = message.sender === "ai";

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} items-end`}>
      {isAI && (
        <div className="mr-2">
          <AiFillRobot className="text-gray-500 text-2xl" />
        </div>
      )}
      <div
        className={`max-w-xs p-3 ${
          isAI ? 'bg-gray-200 text-gray-800 rounded-[12px_12px_12px_0px]' : 'bg-blue-500 text-white rounded-[12px_12px_0px_12px]'
        }`}
      >
        <div
          className="text-sm break-words"
          dangerouslySetInnerHTML={{ __html: message.message }}
        ></div>
        <span className={`mt-1 text-[10px] ${isAI ? 'text-gray-600' : 'text-blue-200 text-right'} block`}>
          {dayjs(message.timestamp).format('HH:mm')}
        </span>
      </div>
    </div>
  );
};

export default ChatWithAIMessage;