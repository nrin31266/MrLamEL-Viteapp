// hooks/useAIStream.ts
import { useCallback, useState } from 'react';

export interface AskRequest {
  question: string;
}

interface UseAIStreamReturn {
  data: string;              // Kết quả cuối cùng
  thinking: string;          // Nội dung đang suy nghĩ (think process)
  isLoading: boolean;        // Đang loading ban đầu
  isThinking: boolean;       // Đang trong quá trình suy nghĩ
  isStreaming: boolean;      // Đang stream kết quả
  error: string | null;
  askQuestion: (question: string, token: string) => Promise<void>;
  reset: () => void;
}

export const useAIStream = (): UseAIStreamReturn => {



  const [data, setData] = useState<string>(''); 
  const [thinking, setThinking] = useState<string>('')  ;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = useCallback(async (question: string, token: string) => {
    setIsLoading(true);
    setIsThinking(false);
    setIsStreaming(false);
    setError(null);
    setData('');
    setThinking('');

    try {
      const request: AskRequest = { question };
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/api/v1/ai/ask-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Could not get reader from response');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let inThinkTag = false;
      let thinkContent = '';
      let resultContent = '';
      let thinkTagTotal = 0;

      setIsLoading(false);
      setIsStreaming(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsThinking(false);
          setIsStreaming(false);
          setData(resultContent);

          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const parseChunk = chunk
          .split("\n")
          .map(line => line.startsWith("data:") ? line.slice(5) : line)
          .filter(line => line.trim() !== "")
          .join("\n");

          

        // const cleaned = cleaned0.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
        // console.log(cleaned)
        // console.log("Chunk received:", cleaned);


        buffer += parseChunk;

        // console.log("Buffer:", buffer);
        //  // Lấy phần nội dung mới chưa xử lý gán vào buffer
        //  console.log("Chunk add", cleaned.slice(0, buffer.length));
        //   buffer += cleaned.slice(0, buffer.length);
        // // buffer += cleaned;

        // let processed = false;

        if (!inThinkTag && parseChunk.includes('<think>') && thinkTagTotal == 0) {
          thinkContent += "<think>";
          inThinkTag = true;
          setIsThinking(true);
          thinkTagTotal += 1;
          console.log("Enter <think> tag");

        } else
          if (inThinkTag && !parseChunk.includes('</think>') && thinkTagTotal == 1) {
            thinkContent += parseChunk;
            setThinking(thinkContent);
            // console.log("Add think content: ", thinkContent);

          } else
            if (inThinkTag && parseChunk.includes('</think>') && thinkTagTotal == 1) {
              thinkContent += '</think>';
              // Khong 
              setIsThinking(false);
              thinkTagTotal += 1;
              console.log("Exit <think> tag");
              inThinkTag = false;

            } else

              if (!inThinkTag) {
                resultContent += parseChunk;
                setData(resultContent);
                // console.log("Add result content: ", resultContent);


              } else {
                setIsStreaming(true);
              }

        // // // if (!processed) break; // Nếu không có gì để xử lý, thoát khỏi vòng lặp
      }

    } catch (err) {
      setIsLoading(false);
      setIsThinking(false);
      setIsStreaming(false);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  }, []);

  const reset = useCallback(() => {
    setData('');
    setThinking('');
    setIsLoading(false);
    setIsThinking(false);
    setIsStreaming(false);
    setError(null);
  }, []);

  return {
    data,
    thinking,
    isLoading,
    isThinking,
    isStreaming,
    error,
    askQuestion,
    reset
  };
};
