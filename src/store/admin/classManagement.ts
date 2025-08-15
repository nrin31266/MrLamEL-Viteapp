import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IUser } from "../authSlide"
import { fetchCourses, type ICourseDto } from "./courseSlide"
import { fetchRooms, type IRoomDto } from "./roomSlide"
import type { IPageData } from "./userManagement"
import { ErrorUtils } from "../../utils/errorUtils"
import handleAPI from "../../api/handleAPI"
//  DRAFT, // Draft status, not yet published
//     READY, // Ready to be published
//     OPEN, // Open registration
//     ONGOING, // Create class session here
//     FINISHED,
//     CANCELLED,
export interface IClazz {
  id: number
  name: string
  avatarUrl: string
  startDate: string
  status: "DRAFT" | "READY" | "OPEN" | "ONGOING" | "CANCELLED";
  endDate: string
  totalSessions: number
  createdAt: string
  updatedAt: string
  schedules: IClassSchedule[]
  course: ICourseDto
  createdBy: IUser
  maxSeats: number
  room: IRoomDto
}

export interface ICreateClazzRequest {
  name: string
  avatarUrl: string
  roomId: number
  maxSeats: number
  totalSessions: number
  courseId: number
}
export interface IClassSchedule {
  id: number
  clazz: string
  dayOfWeek: string
  startTime: string
  endTime: string
  teacher: IUser
  room: IRoomDto
}
interface IClazzManagementState {
  page: IPageData<IClazz>;
  rooms: IRoomDto[];
  courses: ICourseDto[];
  loadings:{
    fetch?: boolean;
    create?: boolean;
    fetchCourses?: boolean;
    fetchRooms?: boolean;
  }
  errors:{
    fetch?: string | null;
    create?: string | null;
  }
}
const initialState: IClazzManagementState = {
  page: {
    content: [],
      totalPages: 0,
      totalElements: 0,
      currentSize: 0,
      currentPage: 1,
      first: false,
      last: false,
      empty: false,
  },
  loadings: {
  },
  errors: {
    fetch: null,
    create: null,
  },
  rooms: [],
  courses: [],
};


// @PostMapping
//     public ApiRes<Clazz> createClass(@RequestBody CreateClassRequest createClassRequest) {
//         log.info("Creating a new class");
//         Clazz createdClass = classService.createClass(createClassRequest);
//         return ApiRes.success(createdClass);
//     }
//     @GetMapping
//     public ApiRes<?> getAllClasses(
//             @RequestParam(defaultValue = "1") int page,
//             @RequestParam(defaultValue = "10") int size,
//             @RequestParam(defaultValue = "id") String sortBy,
//             @RequestParam(defaultValue = "asc") String sortDirection,
//             @RequestParam(required = false) String status
//     ) {
//         log.info("Fetching all classes with pagination and sorting");
//         return ApiRes.success(classService.getAllClasses(page - 1, size, sortBy, sortDirection, status));
//     }
// export const fetchUsers = createAsyncThunk<IPageData<IUserDto>, Record<string, string>>(
//   "userManagement/fetchUsers",
//   async (params, { rejectWithValue }) => {
//     try {
//       const data = await handleAPI<IPageData<IUserDto>>({
//         method: "GET",
//         endpoint: "/api/v1/users",
//         params: params,
//         isAuth: true,
//       });
//       return data;
//     } catch (error) {
//       return rejectWithValue(ErrorUtils.extractErrorMessage(error));
//     }
//   }
// );
export const fetchClazzes = createAsyncThunk<IPageData<IClazz>, Record<string, string>>(
  "classManagement/fetchClazzes",
  async (params, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IPageData<IClazz>>({
        method: "GET",
        endpoint: "/api/v1/classes",
        params: params,
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const createClazz = createAsyncThunk<IClazz, Partial<ICreateClazzRequest>>(
  "classManagement/createClazz",
  async (clazzData, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IClazz>({
        method: "POST",
        endpoint: "/api/v1/classes",
        body: clazzData,
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const fetchSelectCourses = createAsyncThunk("classManagement/fetchCourses", async (_, { rejectWithValue }) => {
  try {
    const data = await handleAPI<ICourseDto[]>({
      method: "GET",
      endpoint: "/api/v1/courses",
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});
export const fetchSelectRooms = createAsyncThunk("classManagement/fetchRooms", async (_, { rejectWithValue }) => {
  try {
    const data = await handleAPI<IRoomDto[]>({
      method: "GET",
      endpoint: "/api/v1/rooms",
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});
const classManagementSlice = createSlice({
  name: "classManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClazzes.pending, (state) => {
        state.loadings.fetch = true;
      })
      .addCase(fetchClazzes.fulfilled, (state, action) => {
        state.loadings.fetch = false;
        state.page = action.payload;
      })
      .addCase(fetchClazzes.rejected, (state, action) => {
        state.loadings.fetch = false;
        state.errors.fetch = action.payload as string;
      })
      .addCase(createClazz.pending, (state) => {
        state.loadings.create = true;
      })
      .addCase(createClazz.fulfilled, (state, action) => {
        state.loadings.create = false;
        state.page.content.push(action.payload);
      })
      .addCase(createClazz.rejected, (state, action) => {
        state.loadings.create = false;
        state.errors.create = action.payload as string;
      })
        .addCase(fetchSelectCourses.pending, (state) => {
          state.loadings.fetchCourses = true;
        })
        .addCase(fetchSelectCourses.fulfilled, (state, action) => {
          state.loadings.fetchCourses = false;
          state.courses = action.payload;
        })
        .addCase(fetchSelectCourses.rejected, (state, action) => {
          state.loadings.fetchCourses = false;
        })
        .addCase(fetchSelectRooms.pending, (state) => {
          state.loadings.fetchRooms = true;
        })
        .addCase(fetchSelectRooms.fulfilled, (state, action) => {
          state.loadings.fetchRooms = false;
          state.rooms = action.payload;
        })
        .addCase(fetchSelectRooms.rejected, (state, action) => {
          state.loadings.fetchRooms = false;
        });
  },
});

export const { } = classManagementSlice.actions;

export default classManagementSlice.reducer;
