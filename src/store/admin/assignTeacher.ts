// @GetMapping("/available")
// public ApiRes<List<User>> getAvailableTeachersForClasses(
//         @RequestParam(required = false) Long clazzId,
//         @RequestParam(required = false) Long scheduleId,
//         @RequestParam(required = false) Long sessionId,
//         @RequestParam(name = "mode") String mode
// ) {
//     if(mode.equals("by-clazz") && clazzId != null) {
//         return ApiRes.success(userService.getAvailableTeachersForSessions(classService.getClassSessionsByClassId(clazzId)));
//     } else if(mode.equals("by-schedule") && scheduleId != null) {
//         return ApiRes.success(userService.getAvailableTeachersForSessions(classService.getClassSessionsByClassScheduleId(scheduleId)));
//     } else if(mode.equals("by-session") && sessionId != null) {
//         return ApiRes.success(userService.getAvailableTeachersForSessions(List.of(classService.getClassSessionById(sessionId))));
//     }
//     return ApiRes.success(userService.getAllTeachers());
// }

import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import handleAPI from "../../api/handleAPI";
import type { IUserDto } from "./userManagement";
import { ErrorUtils } from "../../utils/errorUtils";

// @PreAuthorize("hasAuthority('ROLE_ADMIN')")
// @PostMapping("assignment")
// public ApiRes<Void> assignTeacher(
//         @RequestParam(required = false) Long scheduleId,
//         @RequestParam(required = false) Long sessionId,
//         @RequestParam(required = false) Long clazzId,
//         @RequestParam(name = "mode") String mode,
//         @RequestParam Long teacherId
// ) {
//     List<ClassSession> classSessions;
//     if (mode.equals("by-clazz") && clazzId != null) {
//         classSessions = classService.getClassSessionsByClassId(clazzId);
//     } else if (mode.equals("by-schedule") && scheduleId != null) {
//         classSessions = classService.getClassSessionsByClassScheduleId(scheduleId);
//     } else if (mode.equals("by-session") && sessionId != null) {
//         classSessions = List.of(classService.getClassSessionById(sessionId));
//     } else {
//         classSessions = new ArrayList<>();
//     }
//     userService.assignTeacherToSessions(teacherId, classSessions);
//     return ApiRes.success(null);
// }
// export const fetchCourses = createAsyncThunk("course/fetchAll", async (_, { rejectWithValue }) => {
//   try {
//     const data = await handleAPI<ICourseDto[]>({
//       method: "GET",
//       endpoint: "/api/v1/courses",
//       isAuth: true,
//     });
//     return data;
//   } catch (error) {
//     return rejectWithValue(ErrorUtils.extractErrorMessage(error));
//   }
// });
export const fetchAvailableTeachersForClasses = createAsyncThunk(
  "admin/assignTeacher/fetchAvailableTeachers",
  async (params: Record<string, string>, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IUserDto[]>({
        method: "GET",
        endpoint: "/api/v1/teachers/available",
        isAuth: true,
        params,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const assignTeacher = createAsyncThunk(
  "admin/assignTeacher/assignTeacher",
  async (params: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await handleAPI({
        method: "PUT",
        endpoint: "/api/v1/teachers/assignment",
        isAuth: true,
        params,
      });
      return response;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

interface IAssignTeacherState {
  availableTeachers: IUserDto[];
  open: boolean;
  mode: "by-clazz" | "by-schedule" | "by-session";
  clazzId?: number;
  scheduleId?: number;
  sessionId?: number;
  loadings: {
    fetchAvailableTeachers: boolean;
    assignTeacher: boolean;
  };
  errors: {
    fetchAvailableTeachers?: string | null;
    assignTeacher?: string | null;
  };
}
const initialState: IAssignTeacherState = {
  availableTeachers: [],
  open: false,
  mode: "by-clazz",
  clazzId: undefined,
  scheduleId: undefined,
  sessionId: undefined,
  loadings: {
    fetchAvailableTeachers: false,
    assignTeacher: false,
  },
  errors: {
    fetchAvailableTeachers: null,
    assignTeacher: null,
  },
};
const assignTeacherSlide = createSlice({
  initialState,
  reducers: {
    setAssignTeacherModal: (state, action: PayloadAction<{
        open: boolean;
        mode?: "by-clazz" | "by-schedule" | "by-session";
        clazzId?: number;
        scheduleId?: number;
        sessionId?: number;
    }>) => {
      const { open, mode, clazzId, scheduleId, sessionId } = action.payload;

      state.open = open;
      if (mode) {
        state.mode = mode;
      }


      // Check theo mode
      if (mode === "by-clazz" && clazzId !== undefined) {
        state.clazzId = clazzId;
        state.scheduleId = undefined;
        state.sessionId = undefined;
      }
      if (mode === "by-schedule" && scheduleId !== undefined) {
        state.scheduleId = scheduleId;
        state.clazzId = undefined;
        state.sessionId = undefined;
      }
      if (mode === "by-session" && sessionId !== undefined) {
        state.sessionId = sessionId;
        state.clazzId = undefined;
        state.scheduleId = undefined;
      }
    },
   
  },
  name: "admin/assignTeacher",
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableTeachersForClasses.pending, (state) => {
        state.loadings.fetchAvailableTeachers = true;
        state.errors.fetchAvailableTeachers = null;
      })
      .addCase(fetchAvailableTeachersForClasses.fulfilled, (state, action) => {
        state.loadings.fetchAvailableTeachers = false;
        state.availableTeachers = action.payload;
      })
      .addCase(fetchAvailableTeachersForClasses.rejected, (state, action) => {
        state.loadings.fetchAvailableTeachers = false;
        state.errors.fetchAvailableTeachers = action.payload as string;
      })
      .addCase(assignTeacher.pending, (state) => {
        state.loadings.assignTeacher = true;
        state.errors.assignTeacher = null;
      })
      .addCase(assignTeacher.fulfilled, (state, action) => {
        state.loadings.assignTeacher = false;
      })
      .addCase(assignTeacher.rejected, (state, action) => {
        state.loadings.assignTeacher = false;
        state.errors.assignTeacher = action.payload as string;
      });
  },
});
export const {setAssignTeacherModal} = assignTeacherSlide.actions;
export default assignTeacherSlide.reducer;
