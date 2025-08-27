import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ISessionDto } from "../teacher/timeTableForWeek";
import { ErrorUtils } from "../../utils/errorUtils";
import handleAPI from "../../api/handleAPI";

interface ITodaySessionsSlideState {
  sessions: ISessionDto[];
  loading: {
    getFullCourseTimeTableLoading: boolean;
  };
  errors: {
    getFullCourseTimeTableLoading: string | null;
  };
}
const initialState: ITodaySessionsSlideState = {
  sessions: [],
  errors: { getFullCourseTimeTableLoading: null },
  loading: {
    getFullCourseTimeTableLoading: false,
  },
};

export const getFullCourseTimeTable = createAsyncThunk<ISessionDto[]>(
  "admin/getFullCourseTimeTable",
  (_, { rejectWithValue }) => {
    try {
      const data = handleAPI<ISessionDto[]>({
        endpoint: "/api/v1/classes/full-course-timetable",
        isAuth: true,
        method: "GET",
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

const todaySessionsSlide = createSlice({
  initialState: initialState,
  reducers: {},
  name: "todaySessionsSlide",
  extraReducers: (builder) => {
    builder.addCase(getFullCourseTimeTable.pending, (state)=>{
        state.loading.getFullCourseTimeTableLoading = true;
        state.errors.getFullCourseTimeTableLoading = null;
    })
    .addCase(getFullCourseTimeTable.fulfilled, (state, action)=>{
        state.sessions = action.payload;
        state.loading.getFullCourseTimeTableLoading = false;
    })
    .addCase(getFullCourseTimeTable.rejected, (state, action)=>{
        state.errors.getFullCourseTimeTableLoading = action.payload as string;
        state.loading.getFullCourseTimeTableLoading = false;
    })
  },
});

export default todaySessionsSlide.reducer;
