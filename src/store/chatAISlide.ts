// store/chatAISlide.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IChatAIMessage {
  message: string;
  sender: "user" | "ai";
  timestamp: string;
  key: string,
}

interface ChatAIState {
  messages: IChatAIMessage[];
}

const initialState: ChatAIState = {
  messages: [],
};

export const chatAISlice = createSlice({
  name: 'chatAI',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IChatAIMessage>) => {
      state.messages.push(action.payload);
    },
    updateLastAIMessage: (state, action: PayloadAction<string>) => {
      const lastIndex = state.messages.length - 1;
      if (lastIndex >= 0 && state.messages[lastIndex].sender === "ai") {
        state.messages[lastIndex].message = action.payload;
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, updateLastAIMessage, clearMessages } = chatAISlice.actions;
export default chatAISlice.reducer;