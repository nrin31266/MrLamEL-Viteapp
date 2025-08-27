// // @GetMapping("/{teacherId}/time-table/day")
// //     public ApiRes<List<SessionDto>> getTimeTableForTeacherByDay(
// //             @PathVariable Long teacherId,
// //             @RequestParam(value = "date", required = false) LocalDate date
// //     ) {
// //         if (date == null) {
// //             date = LocalDate.now();
// //         }
// //         return ApiRes.success(classService.getTimeTableForTeacherByDay(teacherId, date));
// //     }

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import handleAPI from "../../api/handleAPI"
import { ErrorUtils } from "../../utils/errorUtils"
import type { IClazz } from "../admin/classManagement"
import type { IRoomDto } from "../admin/roomSlide"
import type { IUser } from "../authSlide"
import type { ISessionDto } from "./timeTableForWeek"

// export interface ISessionDto {
//   id: number
//   clazz: IClazz
//   date: string
//   startTime: string
//   endTime: string
//   note: string
//   teacher: IUser
//   status: string
//   createdAt: string
//   room: IRoomDto
// }

// interface ITimeTableForWeekState {
//   sessions: ISessionDto[]
//   loading: boolean
//   error: string | null
// }
// const initialState: ITimeTableForWeekState = {
//   sessions: [],
//   loading: false,
//   error: null
// }
// // export const requestPasswordReset = createAsyncThunk(
// //   "auth/requestPasswordReset",
// //   async (email: string, { rejectWithValue }) => {
// //     try {
// //       await handleAPI({
// //         endpoint: "/api/v1/auth/send-reset-password?email=" + email,
// //         method: "POST",
// //       });
// //     } catch (error) {
// //       return rejectWithValue(ErrorUtils.extractErrorMessage(error));
// //     }
// //   }
// // );
// export const fetchTimeTableForWeek = createAsyncThunk<ISessionDto[], { teacherId: number, date: string }>(
//   "teacher/timeTableForWeek",
//   async (params, { rejectWithValue }) => {
//     try {
//       const data = await handleAPI<ISessionDto[]>({
//         endpoint: `/teachers/${params.teacherId}/time-table/week`,
//         method: "GET",
//         params: { date: params.date },
//       });
//       return data
//     } catch (error) {
//       return rejectWithValue(ErrorUtils.extractErrorMessage(error));
//     }
//   }
// );

// const timeTableForWeekSlice = createSlice({
//   name: "timeTableForWeek",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTimeTableForWeek.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTimeTableForWeek.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sessions = action.payload;
//       })
//       .addCase(fetchTimeTableForWeek.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { } = timeTableForWeekSlice.actions;

// export default timeTableForWeekSlice.reducer;
interface ITimeTableForDayState {
  sessions: ISessionDto[]
  loading: boolean
  error: string | null
}
const initialState: ITimeTableForDayState = {
  sessions: [],
  loading: false,
  error: null
}

export const fetchTimeTableForStudentByDay = createAsyncThunk<ISessionDto[], { studentId: number, date: string }>(
  "student/timeTableForDay",
  async (params, { rejectWithValue }) => {
    try {
      const data = await handleAPI<ISessionDto[]>({
        endpoint: `/api/v1/student/classes/time-table/day`,
        method: "GET",
        params: { date: params.date },
        isAuth: true,
      });
      return data
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

const timeTableForDaySlice = createSlice({
  name: "timeTableForDay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeTableForStudentByDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeTableForStudentByDay.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchTimeTableForStudentByDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { } = timeTableForDaySlice.actions;

export default timeTableForDaySlice.reducer;
