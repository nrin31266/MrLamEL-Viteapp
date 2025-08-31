import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ErrorUtils } from "../utils/errorUtils";
import handleAPI from "../api/handleAPI";

interface IAIState{
    loading:{
        askLoading: boolean,
    }
    errors:{
        askError: string | null,
    }
}

const initialState: IAIState = {
    loading: {
        askLoading: false,
    },
    errors: {
        askError: null,
    },
};


export const askAI = createAsyncThunk<{answer: string}, { question: string }>(
    "ai/ask",
    async ({ question }, { rejectWithValue }) => {
        try {
            const data = await handleAPI<{ answer: string }>({
                endpoint: `/api/v1/ai/deep-seek/ask`,
                method: "POST",
                body: { question: question },
                isAuth: true,
                timeout: 600000, // 10 phút
            });
            return data;
        } catch (error) {
            return rejectWithValue(ErrorUtils.extractErrorMessage(error));
        }
    }
);

const aiSlide = createSlice({
    name: "ai",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(askAI.pending, (state) => {
                state.loading.askLoading = true;
            })
            .addCase(askAI.fulfilled, (state, action) => {
                state.loading.askLoading = false;
                // Handle successful response
            })
            .addCase(askAI.rejected, (state, action) => {
                state.loading.askLoading = false;
                state.errors.askError = action.payload as string;
            });
    },
});

export default aiSlide.reducer;
