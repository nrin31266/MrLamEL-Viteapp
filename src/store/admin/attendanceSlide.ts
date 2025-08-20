import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IClazz } from "../admin/classManagement"

import handleAPI from "../../api/handleAPI"
import { ErrorUtils } from "../../utils/errorUtils"
import type { ISessionDto } from "../teacher/timeTableForWeek";
// public enum ATTENDANCE_STATUS {
//     PRESENT,        // Có mặt
//     ABSENT,         // Vắng mặt
//     LATE,           // Đi trễ
//     EXCUSED,        // Nghỉ có phép
//     NOT_JOINED_YET  // Buổi học diễn ra trước khi học sinh gia nhập
// }
export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  EXCUSED: "EXCUSED",
  NOT_JOINED_YET: "NOT_JOINED_YET"
};
export interface IAttendance {
  id: number
  status: typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS]
  note: string
  attendanceEnrollment: IAttendanceEnrollment
  absenceCount: number
}

export interface IAttendanceEnrollment {
  id: number
  attendee: IAttendee
  enrolledAt: string
  isPaid: boolean
  tuitionFee: number
  paidAmount: number
}
export interface IAttendee {
  id: number
  email: string
  fullName: string
  phoneNumber: string
  dob: string
  status: string
  role: string
  avatarUrl: string
  address: string
  completedProfile: boolean
  gender: string
  createdAt: string
  updatedAt: string
  active: boolean
  profileComplete: boolean
}

export interface IAttendanceSessionDTO {
  clazz: IClazz
  session: ISessionDto
  attendances: IAttendance[]
}
    // public ApiRes<AttendanceSessionDTO> getAttendancesBySession(
    //         @PathVariable Long sessionId,
    //         Authentication authentication
    // ) {
    //     return ApiRes.success(attendanceService.getAttendancesBySessionId(sessionId,authentication));
    // }
//     export const fetchTimeTableForTeacherByDay = createAsyncThunk<ISessionDto[], { teacherId: number, date: string }>(
//   "teacher/timeTableForDay",
//   async (params, { rejectWithValue }) => {
//     try {
//       const data = await handleAPI<ISessionDto[]>({
//         endpoint: `/api/v1/teacher/classes/${params.teacherId}/time-table/day`,
//         method: "GET",
//         params: { date: params.date },
//         isAuth: true,
//       });
//       return data
//     } catch (error) {
//       return rejectWithValue(ErrorUtils.extractErrorMessage(error));
//     }
//   }
// );
    // @PutMapping("/mark/{attendanceId}")
    // public ApiRes<Attendance> markStatusAttendance(
    //         @PathVariable Long attendanceId,
    //         @RequestParam ATTENDANCE_STATUS status,
    //         Authentication authentication
    // ) {
    //     return ApiRes.success(attendanceService.markStatusAttendance(attendanceId, status, authentication));
    // }
export const fetchAttendanceBySession = createAsyncThunk<IAttendanceSessionDTO, { sessionId: number }, { rejectValue: string }>(
  "teacher/fetchAttendanceBySession",
  async (params, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IAttendanceSessionDTO>({
        endpoint: `/api/v1/attendances/${params.sessionId}`,
        method: "GET",
        isAuth: true,
      });
      return data
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const markAttendanceStatus = createAsyncThunk<IAttendance, { attendanceId: number; status: string }, { rejectValue: string }>(
  "teacher/markAttendanceStatus",
  async (params, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IAttendance>({
        endpoint: `/api/v1/attendances/mark/${params.attendanceId}`,
        method: "PUT",
        params: { status: params.status }, // Ensure 'status' is passed as a query parameter
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
interface IAttendanceSlideState {
  attendance: IAttendanceSessionDTO | null;
  loadings:{
    fetchAttendanceBySession: boolean;
    markAttendanceStatus: Record<number, boolean>;
  }
  errors: {
    fetchAttendanceBySession: string | null;
    markAttendanceStatus: Record<number, string | null>;
  }
}
const initialState: IAttendanceSlideState = {
  attendance: null,
  loadings: {
    fetchAttendanceBySession: false,
    markAttendanceStatus: {},
  },
  errors: {
    fetchAttendanceBySession: null,
    markAttendanceStatus: {},
  },
};
const attendanceSlide = createSlice({
    initialState,
    name: "teacher/attendanceSlide",
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAttendanceBySession.pending, (state) => {
          state.loadings.fetchAttendanceBySession = true;
        })
        .addCase(fetchAttendanceBySession.fulfilled, (state, action) => {
          state.loadings.fetchAttendanceBySession = false;
          state.attendance = action.payload;
        })
        .addCase(fetchAttendanceBySession.rejected, (state, action) => {
          state.loadings.fetchAttendanceBySession = false;
          state.errors.fetchAttendanceBySession = action.payload as string;
        })
        .addCase(markAttendanceStatus.pending, (state, action) => {
          state.loadings.markAttendanceStatus[action.meta.arg.attendanceId] = true;
        })
        .addCase(markAttendanceStatus.fulfilled, (state, action) => {
          state.loadings.markAttendanceStatus[action.meta.arg.attendanceId] = false;
          const attendance = state.attendance?.attendances.find(
            (a) => a.id === action.payload.id
          );
          if (attendance) {
            Object.assign(attendance, action.payload);
          }
        })
        .addCase(markAttendanceStatus.rejected, (state, action) => {
          state.loadings.markAttendanceStatus[action.meta.arg.attendanceId] = false;
          state.errors.markAttendanceStatus[action.meta.arg.attendanceId] = action.payload as string;
        });
    },
});

export default attendanceSlide.reducer;