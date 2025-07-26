import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
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
  completedProfile: boolean;
  gender: "MALE" | "FEMALE" | "OTHER";
  profileComplete?: boolean;
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

const getUserAuthData = (credentials: { email: string; password: string }) => {
  const deviceInfo = DeviceUtils.getDeviceInfo();
  return {
    ...credentials,
    deviceId: deviceInfo.deviceId,
    deviceName: deviceInfo.deviceName,
  };
};
export const login = createAsyncThunk(
  "/auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await handleAPI<{ accessToken: string }>({
        endpoint: "/api/v1/auth/login",
        method: "POST",
        body: getUserAuthData(credentials),
        withCredentials: true
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await handleAPI<{ accessToken: string }>({
        endpoint: "/api/v1/auth/register",
        method: "POST",
        body: getUserAuthData(userData),
        withCredentials: true
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const sendEmailVerification = createAsyncThunk(
  "auth/sendEmailVerification",
  async (_, { rejectWithValue }) => {
    try {
      await handleAPI({
        endpoint: "/api/v1/auth/send-email-verification",
        method: "POST",
        isAuth: true,
      });
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email: string, { rejectWithValue }) => {
    try {
      await handleAPI({
        endpoint: "/api/v1/auth/send-reset-password?email=" + email,
        method: "POST",
      });
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    data: { email: string; newPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      await handleAPI({
        endpoint:
          "/api/v1/auth/reset-password?email=" +
          data.email +
          "&newPassword=" +
          data.newPassword +
          "&token=" +
          data.token,
        method: "PUT",
      });
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      await handleAPI({
        endpoint: `/api/v1/auth/verify-email?token=${token}`,
        method: "PUT",
        isAuth: true,
      });
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    data: {
      fullName: string;
      phoneNumber: string;
      dob: string;
      address: string;
      gender: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await handleAPI({
        endpoint: "/api/v1/auth/update-profile",
        method: "PUT",
        body: data,
        isAuth: true,
      });
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<{ accessToken: string }>({
        endpoint: "/api/v1/auth/refresh-token",
        method: "POST",
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(err));
    }
  }
);

interface AuthState {
  user: IUser | null;
  loadings: {
    fetchMyInfo?: boolean;
    login?: boolean;
    register?: boolean;
    sendEmailVerification?: boolean;
    requestPasswordReset?: boolean;
    resetPassword?: boolean;
    verifyEmail?: boolean;
    updateProfile?: boolean;
    refreshToken?: boolean;
  };
  errors: {
    fetchMyInfo?: string | null;
    login?: string | null;
    register?: string | null;
    emailVerification?: string | null;
    passwordReset?: string | null;
    updateProfile?: string | null;
    refreshToken?: string | null;
  };
}
const initialState: AuthState = {
  user: null,
  loadings: {},
  errors: {},
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.loadings = {};
      state.errors = {};
    },
    setMyInfo: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },
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
        console.log("Here ");
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
        state.loadings.login = false;
        state.errors.login = action.payload as string;
        console.log("Login error:", action.payload); // Log the error for debugging
      })
      .addCase(register.pending, (state) => {
        state.loadings.register = true;
        state.errors.register = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loadings.register = false;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.loadings.register = false;
        state.errors.register = action.payload as string;
        console.log("Register error:", action.payload); // Log the error for debugging
      })
      .addCase(sendEmailVerification.pending, (state) => {
        state.loadings.sendEmailVerification = true;
        state.errors.emailVerification = null;
      })
      .addCase(sendEmailVerification.fulfilled, (state) => {
        state.loadings.sendEmailVerification = false;
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.loadings.sendEmailVerification = false;
        state.errors.emailVerification = action.payload as string;
        console.log("Email verification error:", action.payload); // Log the error for debugging
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.loadings.requestPasswordReset = true;
        state.errors.passwordReset = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loadings.requestPasswordReset = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loadings.requestPasswordReset = false;
        state.errors.passwordReset = action.payload as string;
        console.log("Password reset error:", action.payload); // Log the error for debugging
      })
      .addCase(resetPassword.pending, (state) => {
        state.loadings.resetPassword = true;
        state.errors.passwordReset = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loadings.resetPassword = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loadings.resetPassword = false;
        state.errors.passwordReset = action.payload as string;
        console.log("Reset password error:", action.payload); // Log the error for debugging
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loadings.verifyEmail = true;
        state.errors.emailVerification = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loadings.verifyEmail = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loadings.verifyEmail = false;
        state.errors.emailVerification = action.payload as string;
        console.log("Email verification error:", action.payload); // Log the error for debugging
      })
      .addCase(updateProfile.pending, (state) => {
        state.loadings.updateProfile = true;
        state.errors.updateProfile = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loadings.updateProfile = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loadings.updateProfile = false;
        state.errors.updateProfile = action.payload as string;
        console.log("Update profile error:", action.payload); // Log the error for debugging
      })
      .addCase(refreshTokenThunk.pending, (state) => {
        state.loadings.refreshToken = true;
        state.errors.refreshToken = null;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.loadings.refreshToken = false;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loadings.refreshToken = false;
        state.errors.refreshToken = action.payload as string;
        console.log("Refresh token error:", action.payload); // Log the error for debugging
      });
  },
});

export default authSlice.reducer;
export const { resetAuthState, setMyInfo } = authSlice.actions;
