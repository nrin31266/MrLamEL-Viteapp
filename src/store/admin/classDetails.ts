import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IClassSchedule, IClazz } from "./classManagement";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";
import type { IRoomDto } from "./roomSlide";
import type { IUser } from "../authSlide";

// src/types/classSchedule.ts
export interface ClassScheduleReq {
  classId: number;
  dayOfWeek: EDayOfWeek;
  startTime: any; // dùng string ở dạng "HH:mm:ss" hoặc ISO time
  endTime: any; // dùng string ở dạng "HH:mm:ss" hoặc ISO time
}

export interface IClassSession {
  id: number
  baseSchedule: IClassSchedule
  date: string
  startTime: string
  endTime: string
  room: IRoomDto
  note: string
  teacher: IUser
  status: string
  createdAt: string
}
export type EDayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

  interface MarkClassOnReadyRq{
    unavailableDates: string[];
    startDate: string;
  }
export const EDayOfWeek = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY",
} as const;

interface classDetailsState {
  clazz?: IClazz;
  classSessions?: IClassSession[];
  loadings: {
    fetch?: boolean;
    createSchedule?: boolean;
    updateSchedule?: boolean;
    deleteSchedule?: boolean;
    markClassOnReady?: boolean;
    fetchClassSessions?: boolean;
  };
  errors: {
    fetch?: string | null;
    createSchedule?: string | null;
    updateSchedule?: string | null;
    deleteSchedule?: string | null;
    markClassOnReady?: string | null;
    fetchClassSessions?: string | null;
  };
}
const initialState: classDetailsState = {
  clazz: undefined,
  loadings: {
    fetch: false,
    createSchedule: false,
  },
  errors: {
    fetch: null,
  },
};

export const fetchClazz = createAsyncThunk<IClazz, string>(
  "classManagement/fetchClazzes",
  async (id, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IClazz>({
        method: "GET",
        endpoint: `/api/v1/classes/${id}`,
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const createClassSchedule = createAsyncThunk<
  IClassSchedule,
  Partial<ClassScheduleReq>
>(
  "classManagement/createClassSchedule",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IClassSchedule>({
        method: "POST",
        endpoint: "/api/v1/classes/schedules",
        isAuth: true,
        body: payload,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

export const updateClassSchedule = createAsyncThunk<
  IClassSchedule,
  { id: number; data: Partial<ClassScheduleReq> }
>(
  "classManagement/updateClassSchedule",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IClassSchedule>({
        method: "PUT",
        endpoint: `/api/v1/classes/schedules/${payload.id}`,
        isAuth: true,
        body: payload.data,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
// @DeleteMapping("/schedules/{classScheduleId}")
// public ApiRes<Void> deleteClassSchedule(@PathVariable Long classScheduleId) {
//     log.info("Deleting class schedule with ID: {}", classScheduleId);
//     classService.deleteClassSchedule(classScheduleId);
//     return ApiRes.success(null);
// }
export const deleteClassSchedule = createAsyncThunk<void, number>(
  "classManagement/deleteClassSchedule",
  async (id, { rejectWithValue }) => {
    try {
      await handleAPI({
        method: "DELETE",
        endpoint: `/api/v1/classes/schedules/${id}`,
        isAuth: true,
      });
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
// @PutMapping("/mark-ready/{clazzId}")
//   public ApiRes<List<ClassSession>> markClassOnReady(
//           @PathVariable Long clazzId,
//           @RequestBody MarkClassOnReadyRq markClassOnReadyRq
//   ) {
//       log.info("Marking class with ID: {} as ready", clazzId);
//       return ApiRes.success(classService.markClassOnReady(clazzId, markClassOnReadyRq));
//   }
export const markClassOnReady = createAsyncThunk<
  IClazz,
  { clazzId: number; data: MarkClassOnReadyRq }
>("classManagement/markClassOnReady", async (payload, { rejectWithValue }) => {
  try {
    const data = await handleAPI<IClazz>({
      method: "PUT",
      endpoint: `/api/v1/classes/mark-ready/${payload.clazzId}`,
      isAuth: true,
      body: payload.data,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});
  // @GetMapping("/{classId}/sessions")
  //   public ApiRes<List<ClassSession>> getClassSessionsByClassId(@PathVariable Long classId) {
  //       log.info("Fetching class sessions for class ID: {}", classId);
  //       List<ClassSession> classSessions = classService.getClassSessionsByClassId(classId);
  //       return ApiRes.success(classSessions);
  //   }
  export const fetchClassSessionsByClassId = createAsyncThunk<
    IClassSession[],
    number
  >("classManagement/fetchClassSessionsByClassId", async (classId, { rejectWithValue }) => {
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
  });

const classDetailsSlice = createSlice({
  name: "classDetails",
  initialState,
  reducers: {
    setClazz: (state, action) => {
      state.clazz = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClazz.pending, (state) => {
        state.loadings.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchClazz.fulfilled, (state, action) => {
        state.loadings.fetch = false;
        state.clazz = action.payload;
        state.classSessions = undefined; // Reset class sessions when fetching class details
      })
      .addCase(fetchClazz.rejected, (state, action) => {
        state.loadings.fetch = false;
        state.errors.fetch = action.payload as string;
      })
      .addCase(createClassSchedule.pending, (state) => {
        state.loadings.createSchedule = true;
        state.errors.createSchedule = null;
      })
      .addCase(createClassSchedule.fulfilled, (state, action) => {
        state.loadings.createSchedule = false;
        state.clazz?.schedules.push(action.payload);
      })
      .addCase(createClassSchedule.rejected, (state, action) => {
        state.loadings.createSchedule = false;
        state.errors.createSchedule = action.payload as string;
      })
      .addCase(updateClassSchedule.pending, (state) => {
        state.loadings.updateSchedule = true;
        state.errors.updateSchedule = null;
      })
      .addCase(updateClassSchedule.fulfilled, (state, action) => {
        state.loadings.updateSchedule = false;
        const index = state.clazz?.schedules.findIndex(
          (schedule) => schedule.id === action.payload.id
        );
        if (index !== undefined && index !== -1) {
          state.clazz!.schedules[index] = action.payload;
        }
      })
      .addCase(updateClassSchedule.rejected, (state, action) => {
        state.loadings.updateSchedule = false;
        state.errors.updateSchedule = action.payload as string;
      })
      .addCase(deleteClassSchedule.pending, (state) => {
        state.loadings.deleteSchedule = true;
        state.errors.deleteSchedule = null;
      })
      .addCase(deleteClassSchedule.fulfilled, (state, action) => {
        state.loadings.deleteSchedule = false;
        if (state.clazz) {
          state.clazz.schedules = state.clazz.schedules.filter(
            (schedule) => schedule.id !== action.meta.arg
          );
        }
      })
      .addCase(deleteClassSchedule.rejected, (state, action) => {
        state.loadings.deleteSchedule = false;
        state.errors.deleteSchedule = action.payload as string;
      })
      .addCase(markClassOnReady.pending, (state) => {
        state.loadings.markClassOnReady = true;
        state.errors.markClassOnReady = null;
      })
      .addCase(markClassOnReady.fulfilled, (state, action) => {
        state.loadings.markClassOnReady = false;
        if (!state.clazz) return;
        state.clazz = {...state.clazz, status: "READY"}
      })
      .addCase(markClassOnReady.rejected, (state, action) => {
        state.loadings.markClassOnReady = false;
        state.errors.markClassOnReady = action.payload as string;
      })
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

export const { setClazz } = classDetailsSlice.actions;

export default classDetailsSlice.reducer;
