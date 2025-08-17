import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IClassSchedule, IClazz } from "./classManagement";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";
import type { IRoomDto } from "./roomSlide";
import type { IUser } from "../authSlide";
import type { IClassSession } from "./classDetails";

interface IClassSessionState {
  classSessions: IClassSession[];
  clazzId: number;
  loadings: {
    fetchClassSessions: boolean;
  };
  errors: {
    fetchClassSessions: string | null;
  };
}
export const fetchClassSessionsByClassId = createAsyncThunk<
  IClassSession[],
  number
>(
  "classSessions/fetchClassSessionsByClassId",
  async (classId, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IClassSession[]>({
        method: "GET",
        endpoint: `/api/v1/classes/${classId}/sessions`,
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

const initialState: IClassSessionState = {
  classSessions: [],
  clazzId: -1,
  loadings: {
    fetchClassSessions: false,
  },
  errors: {
    fetchClassSessions: null,
  },
};
const classDetailsSlice = createSlice({
  name: "classSessions",
  initialState,
  reducers: {
    setClassSessions: (state, action) => {
      if (typeof action.payload === "function") {
        // truyền state.classSessions hiện tại vào để tính ra giá trị mới
        state.classSessions = action.payload(state.classSessions);
      } else {
        state.classSessions = action.payload;
      }
    },

    setClazzId: (state, action) => {
      state.clazzId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassSessionsByClassId.pending, (state) => {
        state.loadings.fetchClassSessions = true;
        state.errors.fetchClassSessions = null;
      })
      .addCase(fetchClassSessionsByClassId.fulfilled, (state, action) => {
        state.loadings.fetchClassSessions = false;
        state.classSessions = action.payload;
      })
      .addCase(fetchClassSessionsByClassId.rejected, (state, action) => {
        state.loadings.fetchClassSessions = false;
        state.errors.fetchClassSessions = action.payload as string;
      });
  },
});

export const { setClazzId, setClassSessions } = classDetailsSlice.actions;

export default classDetailsSlice.reducer;
