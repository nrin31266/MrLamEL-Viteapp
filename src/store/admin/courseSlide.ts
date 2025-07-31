import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";

export interface ICourseDto {
  id: number;
  code: string;
  name: string;
  logoUrl: string;
  totalSessions: number;
  fee: number;
  mrpFee: number;
  createdAt: string;
  updatedAt: string;
}

export const fetchCourses = createAsyncThunk("course/fetchAll", async (_, { rejectWithValue }) => {
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

export const fetchCourseById = createAsyncThunk("course/fetchById", async (id: number, { rejectWithValue }) => {
  try {
    const data = await handleAPI<ICourseDto>({
      method: "GET",
      endpoint: `/api/v1/courses/${id}`,
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});

export const createCourse = createAsyncThunk("course/create", async (courseData: Partial<ICourseDto>, { rejectWithValue }) => {
  try {
    const data = await handleAPI<ICourseDto>({
      method: "POST",
      endpoint: "/api/v1/courses",
      body: courseData,
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});

export const updateCourse = createAsyncThunk("course/update", async ({ id, courseData }: { id: number; courseData: Partial<ICourseDto> }, { rejectWithValue }) => {
  try {
    const data = await handleAPI<ICourseDto>({
      method: "PUT",
      endpoint: `/api/v1/courses/${id}`,
      body: courseData,
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});

export const deleteCourse = createAsyncThunk("course/delete", async (id: number, { rejectWithValue }) => {
  try {
    await handleAPI({
      method: "DELETE",
      endpoint: `/api/v1/courses/${id}`,
      isAuth: true,
    });
    return id;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});

interface CourseState {
  data: ICourseDto[] | null;
  selectedCourse: ICourseDto | null;
  loadings: {
    fetch?: boolean;
    fetchById?: boolean;
    create?: boolean;
    update?: boolean;
    delete: Record<number, boolean>;
  };
  error: {
    fetch?: string | null;
    fetchById?: string | null;
    create?: string | null;
    update?: string | null;
    delete: Record<number, any>;
  };
}

const initialState: CourseState = {
  data: null,
  selectedCourse: null,
  loadings: {
    delete: {},
  },
  error: {
    delete: {},
  },
};

const courseSlide = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loadings.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loadings.fetch = false;
        state.data = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loadings.fetch = false;
        state.error.fetch = action.payload as string;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loadings.fetchById = true;
        state.error.fetchById = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loadings.fetchById = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loadings.fetchById = false;
        state.error.fetchById = action.payload as string;
      })
      .addCase(createCourse.pending, (state) => {
        state.loadings.create = true;
        state.error.create = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loadings.create = false;
        if (state.data) {
          state.data.push(action.payload);
        } else {
          state.data = [action.payload];
        }
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loadings.create = false;
        state.error.create = action.payload as string;
      })
      .addCase(updateCourse.pending, (state) => {
        state.loadings.update = true;
        state.error.update = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loadings.update = false;
        if (state.data) {
          const idx = state.data.findIndex(course => course.id === action.payload.id);
          if (idx !== -1) {
            state.data[idx] = action.payload;
          }
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loadings.update = false;
        state.error.update = action.payload as string;
      })
      .addCase(deleteCourse.pending, (state, action) => {
        const id = action.meta.arg;
        state.loadings.delete[id] = true;
        state.error.delete[id] = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        const id = action.payload;
        delete state.loadings.delete[id];
        delete state.error.delete[id];
        if (state.data) {
          state.data = state.data.filter(course => course.id !== id);
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        const id = action.meta.arg;
        state.loadings.delete[id] = false;
        state.error.delete[id] = action.payload as string;
      });
  },
});

export default courseSlide.reducer;
