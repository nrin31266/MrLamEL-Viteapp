import React, { useEffect, useState, type SetStateAction } from 'react';
import { useAppSelector } from '../../store/store';
import ChatWithAINonMessage from './ChatWithAINonMessage';
import ChatWithAIMessage from './ChatWithAIMessage';
import type { Dispatch } from '@reduxjs/toolkit';

interface IChatAIMessage {
  message: string;
  sender: "user" | "ai";
  timestamp: string;
  key: string;
}

interface ChatWithAIBodyProps {
  isThinking?: boolean;
  thinkingContent?: string;
  isStreaming?: boolean;
  autoScroll?: boolean;
  setAutoScroll: React.Dispatch<SetStateAction<boolean>>;
}

const ChatWithAIBody: React.FC<ChatWithAIBodyProps> = ({
  isThinking = false,
  thinkingContent = "",
  isStreaming = false,
  autoScroll = false,
  setAutoScroll
}) => {
  const aiState = useAppSelector(state => state.ai);
  const chatAIState = useAppSelector(state => state.chatAI);
  const thinkingContentRef = React.useRef<HTMLDivElement>(null);
  const [autoScrollThinking, setAutoScrollThinking] = useState(true);
  const autoScrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScrollThinking && thinkingContentRef.current) {
      const el = thinkingContentRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [thinkingContent, autoScrollThinking]);

  useEffect(() => {
    if (autoScroll && autoScrollRef.current) {
      const el = autoScrollRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [chatAIState.messages, autoScroll, thinkingContent]);

  // Lắng nghe khi user scroll
  useEffect(() => {
    const el = autoScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      // vị trí scroll hiện tại
      const { scrollTop, scrollHeight, clientHeight } = el;

      const isAtBottom = scrollHeight - scrollTop === clientHeight;

      if (!isAtBottom) {
        // Người dùng kéo lên -> tắt auto scroll
        setAutoScroll(false);
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={autoScrollRef} className="h-full p-4 border flex flex-col gap-y-3 border-gray-200 rounded-sm overflow-y-auto">
      {chatAIState.messages.length === 0 ? (
        <ChatWithAINonMessage />
      ) : (
        <>
          {/* Hiển thị messages với key unique */}
          {chatAIState.messages.map((message: IChatAIMessage, index: number) => (
            <ChatWithAIMessage
              key={index}
              message={message}
            />
          ))}
          {/* Hiển thị thinking process */}
          {isThinking && (
            <div className="flex justify-start items-center">
              <div className="mr-2 flex gap-2 items-center text-gray-500 text-sm italic">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
                AI is thinking...
              </div>
            </div>
          )}

          {/* Hiển thị thinking content nếu có */}
          {isThinking && thinkingContent && (
            <div className="flex justify-start">
              <div ref={thinkingContentRef} className="p-3 pointer-events-none max-w-[100%] max-h-[100px]  overflow-auto bg-gray-100 text-gray-600 rounded-[12px_12px_12px_0px] text-sm">
                <div className="thinking-process italic ">
                  {thinkingContent}
                </div>
              </div>
            </div>
          )}

          {/* Hiển thị streaming indicator */}
          {isStreaming && !isThinking && (
            <div className="flex justify-start items-center">
              <div className="mr-2 flex gap-2 items-center text-gray-500 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></span>
                  <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-150"></span>
                  <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-300"></span>
                </div>
                AI is responding...
              </div>
            </div>
          )}


        </>
      )}
    </div>
  );
};

export default ChatWithAIBody;