import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ErrorUtils } from "../../utils/errorUtils";
import type { ISessionDto } from "../teacher/timeTableForWeek";
import handleAPI from "../../api/handleAPI";

interface IMissedSessionsState {
  missedSessions: ISessionDto[];
  loading: {
    fetchMissedSessions: boolean;
  }
  errors:{
    fetchMissedSessions: string | null;
  }
}
const initialState: IMissedSessionsState = {
  missedSessions: [],
  loading: {
    fetchMissedSessions: false,
  },
  errors: {
    fetchMissedSessions: null,
  },
};

export const fetchMissedSessions = createAsyncThunk<ISessionDto[], {daysAgo: number}>(
  "admin/fetchMissedSessions",
  async ({ daysAgo }, { rejectWithValue }) => {
    try {
      const data = await handleAPI<ISessionDto[]>({
        endpoint: "/api/v1/classes/missed-sessions",
        method: "GET",
        isAuth: true,
        params: {
          daysAgo: daysAgo
        }
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

const missedSessionsSlide = createSlice({
    name: "missedSessions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMissedSessions.pending, (state) => {
                state.loading.fetchMissedSessions = true;
                state.errors.fetchMissedSessions = null;
            })
            .addCase(fetchMissedSessions.fulfilled, (state, action) => {
                state.loading.fetchMissedSessions = false;
                state.missedSessions = action.payload;
            })
            .addCase(fetchMissedSessions.rejected, (state, action) => {
                state.loading.fetchMissedSessions = false;
                state.errors.fetchMissedSessions = action.payload as string;
            });
    }
});

export default missedSessionsSlide.reducer;