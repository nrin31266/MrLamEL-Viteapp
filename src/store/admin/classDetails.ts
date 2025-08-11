import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IClazz } from "./classManagement";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";

interface classDetailsState {
    clazz?: IClazz,
    loadings:{
        fetch?: boolean;
    }
    errors:{
        fetch?: string | null;
    }
}
const initialState: classDetailsState = {
    loadings: {
        fetch: false,
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
const classDetailsSlice = createSlice({
  name: "classDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClazz.pending, (state) => {
        state.loadings.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchClazz.fulfilled, (state, action) => {
        state.loadings.fetch = false;
        state.clazz = action.payload;
      })
      .addCase(fetchClazz.rejected, (state, action) => {
        state.loadings.fetch = undefined;
        state.errors.fetch = action.payload as string;
      });
  },
});

export default classDetailsSlice.reducer;
