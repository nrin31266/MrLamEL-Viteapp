import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IClazz } from "../admin/classManagement";
import { ErrorUtils } from "../../utils/errorUtils";
import { data } from "react-router-dom";
import handleAPI from "../../api/handleAPI";

interface IClassesStudyingState {
  classesStudying: IClazz[];
  loading: {
    fetchClassesStudying: boolean;
  };
  errors: {
    fetchClassesStudying: string | null;
  };
}

const initialState: IClassesStudyingState = {
  classesStudying: [],
  loading: {
    fetchClassesStudying: false,
  },
  errors: {
    fetchClassesStudying: null,
  },
};

export const fetchClassesStudying = createAsyncThunk<IClazz[]>(
    "classesStudying/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const data = await handleAPI<IClazz[]>({
                endpoint: `/api/v1/student/classes/studying`,
                method: "GET",
                isAuth: true,
            });
            return data;
        } catch (error) {
            return rejectWithValue(ErrorUtils.extractErrorMessage(error));
        }
    }
);

const classStudyingSlice = createSlice({
  name: "classStudying",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassesStudying.pending, (state) => {
        state.loading.fetchClassesStudying = true;
        state.errors.fetchClassesStudying = null;
      })
      .addCase(fetchClassesStudying.fulfilled, (state, action) => {
        state.loading.fetchClassesStudying = false;
        state.classesStudying = action.payload;
      })
      .addCase(fetchClassesStudying.rejected, (state, action) => {
        state.loading.fetchClassesStudying = false;
        state.errors.fetchClassesStudying = action.payload as string;
      });
  },
});

export default classStudyingSlice.reducer;
