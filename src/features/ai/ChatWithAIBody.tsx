import React from 'react';
import { useAppSelector } from '../../store/store';
import ChatWithAINonMessage from './ChatWithAINonMessage';
import ChatWithAIMessage from './ChatWithAIMessage';

interface IChatAIMessage {
  message: string;
  sender: "user" | "ai";
  timestamp: string;
}

const ChatWithAIBody = () => {
  const aiState = useAppSelector(state => state.ai);
  const chatAIState = useAppSelector(state => state.chatAI);

  return (
    <div className="h-full p-4 border flex flex-col-reverse gap-y-3 border-gray-200 rounded-sm overflow-y-auto">
      {chatAIState.messages.length === 0 ? (
        <ChatWithAINonMessage />
      ) : (
        <>
        {
            aiState.loading.askLoading && (
              <div className="flex justify-start mt-4 items-center">
                <div className="mr-2 flex gap-2 items-center text-gray-500 text-sm italic">
                  <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                  I'm thinking. Please wait a moment.
                </div>
              </div>
            )
          }
          {chatAIState.messages.map((message: IChatAIMessage, index: number) => (
            <ChatWithAIMessage key={message.timestamp || index} message={message} />
          ))}

          
        </>
      )}
    </div>
  );
};

export default ChatWithAIBody;