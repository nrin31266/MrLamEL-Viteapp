// @GetMapping("/{teacherId}/time-table/day")
//     public ApiRes<List<SessionDto>> getTimeTableForTeacherByDay(
//             @PathVariable Long teacherId,
//             @RequestParam(value = "date", required = false) LocalDate date
//     ) {
//         if (date == null) {
//             date = LocalDate.now();
//         }
//         return ApiRes.success(classService.getTimeTableForTeacherByDay(teacherId, date));
//     }

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import handleAPI from "../../api/handleAPI"
import { ErrorUtils } from "../../utils/errorUtils"
import type { IClazz } from "../admin/classManagement"
import type { IRoomDto } from "../admin/roomSlide"
import type { IUser } from "../authSlide"

export interface ISessionDto {
  id: number
  clazz: IClazz
  date: string
  startTime: string
  endTime: string
  note: string
  teacher: IUser
  status: string
  createdAt: string
  room: IRoomDto
  content: string
}
interface ITimeTableForTeacherByWeekDto {
  weekNumber: number
  sessions: ISessionDto[]
  weekStartDate: string
weekEndDate: string
}

interface ITimeTableForWeekState {
  sessions: ISessionDto[]
  weekNumber: number
  weekStartDate: string
  weekEndDate: string
  loading: boolean
  error: string | null
}
const initialState: ITimeTableForWeekState = {
  sessions: [],
  weekNumber: 0,
  weekStartDate: "",
  weekEndDate: "",
  loading: false,
  error: null
}
// export const requestPasswordReset = createAsyncThunk(
//   "auth/requestPasswordReset",
//   async (email: string, { rejectWithValue }) => {
//     try {
//       await handleAPI({
//         endpoint: "/api/v1/auth/send-reset-password?email=" + email,
//         method: "POST",
//       });
//     } catch (error) {
//       return rejectWithValue(ErrorUtils.extractErrorMessage(error));
//     }
//   }
// );
export const fetchTimeTableForStudentWeekly = createAsyncThunk<ITimeTableForTeacherByWeekDto, { studentId: number, weekNumber: number }>(
  "student/timeTableForWeek",
  async (params, { rejectWithValue }) => {
    try {
      const data = await handleAPI<ITimeTableForTeacherByWeekDto>({
        endpoint: `/api/v1/student/classes/time-table/week`,
        method: "GET",
        params: { weekNumber: params.weekNumber },
        isAuth: true,
      });
      return data
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

const timeTableForWeekSlice = createSlice({
  name: "timeTableForWeek",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeTableForStudentWeekly.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeTableForStudentWeekly.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.sessions;
        state.weekNumber = action.payload.weekNumber;
        state.weekStartDate = action.payload.weekStartDate;
        state.weekEndDate = action.payload.weekEndDate;
      })
      .addCase(fetchTimeTableForStudentWeekly.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { } = timeTableForWeekSlice.actions;

export default timeTableForWeekSlice.reducer;