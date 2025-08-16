import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import handleAPI from "../../api/handleAPI";

import { ErrorUtils } from "../../utils/errorUtils";
import type { IRoomDto } from "./roomSlide";

export const fetchAvailableRoomsForClasses = createAsyncThunk(
  "admin/assignRoom/fetchAvailableRooms",
  async (params: Record<string, string>, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IRoomDto[]>({
        method: "GET",
        endpoint: "/api/v1/rooms/available",
        isAuth: true,
        params,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

export const assignRoom = createAsyncThunk(
  "admin/assignRoom/assignRoom",
  async (params: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await handleAPI({
        method: "PUT",
        endpoint: "/api/v1/rooms/assignment",
        isAuth: true,
        params,
      });
      return response;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

interface IAssignRoomState {
  availableRooms: IRoomDto[];
  open: boolean;
  mode: "by-clazz" | "by-schedule" | "by-session";
  clazzId?: number;
  scheduleId?: number;
  sessionId?: number;
  loadings: {
    fetchAvailableRooms: boolean;
    assignRoom: boolean;
  };
  errors: {
    fetchAvailableRooms?: string | null;
    assignRoom?: string | null;
  };
}

const initialState: IAssignRoomState = {
  availableRooms: [],
  open: false,
  mode: "by-clazz",
  clazzId: undefined,
  scheduleId: undefined,
  sessionId: undefined,
  loadings: {
    fetchAvailableRooms: false,
    assignRoom: false,
  },
  errors: {
    fetchAvailableRooms: null,
    assignRoom: null,
  },
};

const assignRoomSlice = createSlice({
  initialState,
  reducers: {
    setAssignRoomModal: (state, action: PayloadAction<{
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
  name: "admin/assignRoom",
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableRoomsForClasses.pending, (state) => {
        state.loadings.fetchAvailableRooms = true;
        state.errors.fetchAvailableRooms = null;
      })
      .addCase(fetchAvailableRoomsForClasses.fulfilled, (state, action) => {
        state.loadings.fetchAvailableRooms = false;
        state.availableRooms = action.payload;
      })
      .addCase(fetchAvailableRoomsForClasses.rejected, (state, action) => {
        state.loadings.fetchAvailableRooms = false;
        state.errors.fetchAvailableRooms = action.payload as string;
      })
      .addCase(assignRoom.pending, (state) => {
        state.loadings.assignRoom = true;
        state.errors.assignRoom = null;
      })
      .addCase(assignRoom.fulfilled, (state, action) => {
        state.loadings.assignRoom = false;
      })
      .addCase(assignRoom.rejected, (state, action) => {
        state.loadings.assignRoom = false;
        state.errors.assignRoom = action.payload as string;
      });
  },
});

export const { setAssignRoomModal } = assignRoomSlice.actions;
export default assignRoomSlice.reducer;