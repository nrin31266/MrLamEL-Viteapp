import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatWithAIBody from "./ChatWithAIBody";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addMessage, updateLastAIMessage } from "../../store/chatAISlide";
import { useAIStream } from "./useAIStream";
import dayjs from "dayjs";
interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [messageCounter, setMessageCounter] = useState(0);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const aiState = useAppSelector(state => state.ai);
  const [autoScroll, setAutoScroll] = useState(true);
  const chatAIState = useAppSelector(state => state.chatAI);
  const dispatch = useAppDispatch();
  
  const { 
    data: streamingData, 
    thinking, 
    isLoading: isStreamLoading, 
    isThinking, 
    isStreaming, 
    error: streamError, 
    askQuestion: askStreamQuestion, 
    reset: resetStream 
  } = useAIStream();

  const token = localStorage.getItem("accessToken") || "";

  // Refs để theo dõi trạng thái trước đó
  const prevStreamingData = useRef<string>('');
  const prevThinking = useRef<string>('');
  const prevStreamError = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isOpen]);

  // useEffect cho streamingData - FIXED
  useEffect(() => {
    if (streamingData && streamingData !== prevStreamingData.current && chatAIState.messages.length > 0) {
      const lastMessage = chatAIState.messages[chatAIState.messages.length - 1];
      if (lastMessage.sender === "ai") {
        dispatch(updateLastAIMessage(streamingData));
      }
      prevStreamingData.current = streamingData;
    }
  }, [streamingData, dispatch, chatAIState.messages]);

  // useEffect cho thinking - FIXED
  // useEffect(() => {
  //   if (thinking && thinking !== prevThinking.current && chatAIState.messages.length > 0) {
  //     const lastMessage = chatAIState.messages[chatAIState.messages.length - 1];
  //     if (lastMessage.sender === "ai") {
  //       dispatch(updateLastAIMessage(`<div class="thinking-process">${thinking}</div>`));
  //     }
  //     prevThinking.current = thinking;
  //   }
  // }, [thinking, dispatch, chatAIState.messages]);

  // useEffect cho streamError - FIXED
  useEffect(() => {
    if (streamError && streamError !== prevStreamError.current && chatAIState.messages.length > 0) {
      const lastMessage = chatAIState.messages[chatAIState.messages.length - 1];
      if (lastMessage.sender === "ai") {
        dispatch(updateLastAIMessage(`Error: ${streamError}`));
      }
      prevStreamError.current = streamError;
    }
  }, [streamError, dispatch, chatAIState.messages]);

  const defaultHeight = 44;

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setMessage("");
    // Tạo unique timestamp với counter để tránh trùng lặp
    const timestamp = new Date().toISOString();
    const uniqueTimestamp = `${timestamp}-${messageCounter}`;

    // Thêm message user
    dispatch(addMessage({ 
      message: message.trim(), 
      sender: "user", 
      timestamp: timestamp,
      key: uniqueTimestamp
    }));

    // Tăng counter
    setMessageCounter(prev => prev + 1);

    // Thêm message AI placeholder với unique timestamp
    const aiTimestamp = new Date().toISOString();
    const uniqueAiTimestamp = `${aiTimestamp}-${messageCounter}`;
    
    dispatch(addMessage({ 
      message: "Thinking...", 
      sender: "ai", 
      timestamp: aiTimestamp,
      key: uniqueAiTimestamp
    }));

    // Tăng counter tiếp
    setMessageCounter(prev => prev + 1);

    // Reset các refs trước khi gọi API mới
    prevStreamingData.current = '';
    prevThinking.current = '';
    prevStreamError.current = null;
    setAutoScroll(true);

    // Gọi streaming API
    try {
      await askStreamQuestion(message, token);
    } catch (error) {
      dispatch(updateLastAIMessage(`Error: ${error}`));
    }

    

    if (messageInputRef.current) {
      messageInputRef.current.style.height = defaultHeight + "px";
      messageInputRef.current.style.overflowY = "hidden";
      messageInputRef.current.focus();
    }
  };

  const handleClose = () => {
    resetStream();
    // Reset các refs khi đóng modal
    prevStreamingData.current = '';
    prevThinking.current = '';
    prevStreamError.current = null;
    onClose();
  };

  return (
    <div
      className={`fixed z-20 bottom-20 h-[80%] right-10 bg-white rounded-lg shadow-lg transition-transform transform ${
        isOpen
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-10 opacity-0 pointer-events-none"
      }`}
      style={{ width: "800px" }}
    >
      <div className="p-4 grid grid-rows-[auto_1fr_auto] h-full">
        <div className="flex justify-between border-gray-300 items-center">
          <button
            className="absolute border rounded-full  w-6 h-6 flex items-center justify-center cursor-pointer
            top-4 right-4 border-gray-100 bg-gray-100 hover:bg-gray-200  transform duration-150  hover:ease-in-out"
            onClick={handleClose}
          >
            ✕
          </button>
          <h2 className="text-lg font-bold text-blue-600">Chat with AI</h2>
        </div>

        <ChatWithAIBody 
          isThinking={isThinking} 
          thinkingContent={thinking}
          isStreaming={isStreaming}
          autoScroll={autoScroll}
          setAutoScroll={setAutoScroll}
        />

        <div className="py-2 border-gray-300">
          <div className="relative flex items-center justify-center">
            <textarea
              ref={messageInputRef}
              className={`
          w-full
          min-h-[${defaultHeight}px]
          max-h-[200px]
          resize-none
          rounded-sm
          border-2
          border-gray-300
          focus:border-[var(--primary-color)]
          focus:outline-none
          transform
          duration-150
          active:ease-in-out
          pl-3
          py-2.5
          pr-[3rem]
          text-base
          text-gray-900
          placeholder:text-gray-400
          box-border
          leading-5
        `}
              style={{
                fontSize: "1rem",
                height: defaultHeight + "px",
                overflowY: "hidden",
              }}
              placeholder="Type your message..."
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if(isStreamLoading || isThinking || isStreaming) {
                  return;
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                const scrollHeight =
                  target.scrollHeight < defaultHeight
                    ? defaultHeight
                    : target.scrollHeight;
                const maxHeight = 200;

                if (scrollHeight > maxHeight) {
                  target.style.height = `${maxHeight}px`;
                  target.style.overflowY = "auto";
                } else {
                  target.style.height = `${scrollHeight}px`;
                  target.style.overflowY = "hidden";
                }
              }}
              // disabled={isStreamLoading || isThinking || isStreaming}
            />
            <div className="absolute top-1/2 right-3 pb-1 transform -translate-y-[50%] flex flex-col-reverse h-full">
              <button
                onClick={handleSendMessage}
                className={`text-gray-500 p-2 transform duration-300 rounded-full ${
                  (message.trim() && !isStreamLoading && !isThinking && !isStreaming)
                    ? "cursor-pointer ease-in !text-white bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)]"
                    : "cursor-not-allowed bg-gray-200"
                }`}
                disabled={isStreamLoading || isThinking || isStreaming}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                  height={20}
                  width={20}
                >
                  <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;