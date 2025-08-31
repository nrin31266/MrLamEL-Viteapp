import { createSlice } from "@reduxjs/toolkit";

export interface IChatAIMessage {
  message: string;
  sender: "user" | "ai";
  timestamp: string; // key
}
interface IChatAIState {
  messages: IChatAIMessage[];
}
const initialState: IChatAIState = {
  messages: [],
};

const chatAISlice = createSlice({
  name: "chatAI",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages = [action.payload, ...state.messages];
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = chatAISlice.actions;
export default chatAISlice.reducer;
