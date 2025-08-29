import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IClazz } from "./admin/classManagement"
import type { ISessionDto } from "./teacher/timeTableForWeek"
import { ErrorUtils } from "../utils/errorUtils"
import handleAPI from "../api/handleAPI"
export interface ILearnedSessionDto {
  session: ISessionDto
  absentStudents: string[]
  lateStudents: string[]
  excuseStudents: string[]
}
export interface IClassProgressDTO{
  clazz: IClazz
  learnedSessions: ILearnedSessionDto[],
}

interface IClassProgressState {
  classProgress: IClassProgressDTO | null;
  loading:{
    fetchClassProgress: boolean;
  }
  errors:{
    fetchClassProgress: string | null;
  }
}

const initialState: IClassProgressState = {
  classProgress: null,
  loading: {
    fetchClassProgress: false,
  },
  errors: {
    fetchClassProgress: null,
  },
};
export const fetchClassProgress = createAsyncThunk<IClassProgressDTO, {classId: string}>(
  "classProgress/fetchClassProgress",
  async ({ classId }, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IClassProgressDTO>({
        endpoint: `/api/v1/student/classes/class-progress/${classId}`,
        method: "GET",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
const classProgressSlice = createSlice({
  name: "classProgress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassProgress.pending, (state) => {
        state.loading.fetchClassProgress = true;
        state.errors.fetchClassProgress = null;
      })
      .addCase(fetchClassProgress.fulfilled, (state, action) => {
        state.loading.fetchClassProgress = false;
        state.classProgress = action.payload;
      })
      .addCase(fetchClassProgress.rejected, (state, action) => {
        state.loading.fetchClassProgress = false;
        state.errors.fetchClassProgress = action.payload as string;
      });
  },
});

export const { } = classProgressSlice.actions;

export default classProgressSlice.reducer;