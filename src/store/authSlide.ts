import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ErrorUtils } from "../utils/errorUtils";
import handleAPI from "../api/handleAPI";
import { DeviceUtils } from "../utils/deviceUtils";

export interface IUser {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  dob: any;
  status: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  avatarUrl: any;
  address: any;
  createdAt: string;
  updatedAt: any;
  active: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  deviceId: string;
  deviceName: string;
}

export const fetchMyInfo = createAsyncThunk(
  "auth/fetchMyInfo",
  async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IUser>({
        endpoint: "/api/v1/auth/my",
        isAuth: true,
        method: "GET",
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

export const login = createAsyncThunk(
  "/auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const deviceInfo = DeviceUtils.getDeviceInfo();
      const reqBody = {
        ...credentials,
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
      };
      const data = await handleAPI<{ accessToken: string }>({
        endpoint: "/api/v1/auth/login",
        method: "POST",
        body: reqBody,
      });
      return data;
    } catch (error) {
    //   return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    return rejectWithValue("Failed");
    }
  }
);

interface AuthState {
  user: IUser | null;
  loadings: {
    fetchMyInfo?: boolean;
    login?: boolean;
  };
  errors: {
    fetchMyInfo?: string | null;
    login?: string | null;
  };
}
const initialState: AuthState = {
  user: null,
  loadings: {
  },
  errors:{}
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyInfo.pending, (state) => {
        state.loadings.fetchMyInfo = true;
        state.errors.fetchMyInfo = null;
      })
      .addCase(fetchMyInfo.fulfilled, (state, action) => {
        state.loadings.fetchMyInfo = false;
        state.user = action.payload;
      })
      .addCase(fetchMyInfo.rejected, (state, action) => {
        console.log("Here ")
        state.loadings.fetchMyInfo = false;
        // state.errors.fetchMyInfo = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loadings.login = true;
        state.errors.login = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loadings.login = false;
        localStorage.setItem("accessToken", action.payload.accessToken);

      })
      .addCase(login.rejected, (state, action) => {
        console.log("Here ")
        state.loadings.login = false;
        state.errors.login = action.payload as string;
      })


}});

export default authSlice.reducer;
