import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";
import {  type IBranchDto } from "./branchSlide";

export interface IRoomDto {
  id: number;
  code: string;
  name: string;
  capacity: number;
  branch: IBranchDto;
}
export const fetchBranches = createAsyncThunk("room/branches/fetch", async (_, { rejectWithValue }) => {
    try {
        // Call your API to fetch branches
        const data = await handleAPI<IBranchDto[]>({
            method: 'GET',
            endpoint: '/api/v1/branches',
            isAuth: true
        })
        return data;
    } catch (error) {
        return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
});
export const fetchRooms = createAsyncThunk("room/fetch", async (_, { rejectWithValue }) => {
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

export const fetchRoomsByBranch = createAsyncThunk("room/fetchByBranch", async (branchId: number, { rejectWithValue }) => {
  try {
    const data = await handleAPI<IRoomDto[]>({
      method: "GET",
      endpoint: `/api/v1/rooms/branch/${branchId}`,
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});

export const fetchRoomById = createAsyncThunk("room/fetchById", async (roomId: number, { rejectWithValue }) => {
  try {
    const data = await handleAPI<IRoomDto>({
      method: "GET",
      endpoint: `/api/v1/rooms/${roomId}`,
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});

export const createRoom = createAsyncThunk("room/create", async (roomData: { code: string; name: string; capacity: number; branchId: number }, { rejectWithValue }) => {
  try {
    const data = await handleAPI<IRoomDto>({
      method: "POST",
      endpoint: "/api/v1/rooms",
      body: roomData,
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});

export const updateRoom = createAsyncThunk("room/update", async ({ id, roomData }: { id: number; roomData: { code: string; name: string; capacity: number; branchId: number } }, { rejectWithValue }) => {
  try {
    const data = await handleAPI<IRoomDto>({
      method: "PUT",
      endpoint: `/api/v1/rooms/${id}`,
      body: roomData,
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});

export const deleteRoom = createAsyncThunk("room/delete", async (id: number, { rejectWithValue }) => {
  try {
    await handleAPI({
      method: "DELETE",
      endpoint: `/api/v1/rooms/${id}`,
      isAuth: true,
    });
    return id;
  } catch (error) {
    return rejectWithValue(ErrorUtils.extractErrorMessage(error));
  }
});

interface RoomState {
  data: IRoomDto[] | null;
  selectedRoom: IRoomDto | null;
  branches: IBranchDto[] | null;
  loadings: {
    fetch?: boolean;
    fetchByBranch?: boolean;
    fetchById?: boolean;
    create?: boolean;
    update?: boolean;
    delete: Record<number, boolean>;
    fetchBranches?: boolean;
  };
  error: {
    fetch?: string | null;
    fetchByBranch?: string | null;
    fetchById?: string | null;
    create?: string | null;
    update?: string | null;
    delete: Record<number, any>;
    fetchBranches?: string | null;
  };
}

const initialState: RoomState = {
  data: null,
    branches: null,
  selectedRoom: null,
  loadings: {
    delete: {},
  },
  error: {
    delete: {},
  },
};

const roomSlide = createSlice({
  name: "room",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loadings.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loadings.fetch = false;
        state.data = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loadings.fetch = false;
        state.error.fetch = action.payload as string;
      })
      .addCase(fetchRoomsByBranch.pending, (state) => {
        state.loadings.fetchByBranch = true;
        state.error.fetchByBranch = null;
      })
      .addCase(fetchRoomsByBranch.fulfilled, (state, action) => {
        state.loadings.fetchByBranch = false;
        state.data = action.payload;
      })
      .addCase(fetchRoomsByBranch.rejected, (state, action) => {
        state.loadings.fetchByBranch = false;
        state.error.fetchByBranch = action.payload as string;
      })
      .addCase(fetchRoomById.pending, (state) => {
        state.loadings.fetchById = true;
        state.error.fetchById = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.loadings.fetchById = false;
        state.selectedRoom = action.payload;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loadings.fetchById = false;
        state.error.fetchById = action.payload as string;
      })
      .addCase(createRoom.pending, (state) => {
        state.loadings.create = true;
        state.error.create = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loadings.create = false;
        if (state.data) {
          state.data.push(action.payload);
        } else {
          state.data = [action.payload];
        }
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loadings.create = false;
        state.error.create = action.payload as string;
      })
      .addCase(updateRoom.pending, (state) => {
        state.loadings.update = true;
        state.error.update = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loadings.update = false;
        if (state.data) {
          const idx = state.data.findIndex(room => room.id === action.payload.id);
          if (idx !== -1) {
            state.data[idx] = action.payload;
          }
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loadings.update = false;
        state.error.update = action.payload as string;
      })
      .addCase(deleteRoom.pending, (state, action) => {
        const id = action.meta.arg;
        state.loadings.delete[id] = true;
        state.error.delete[id] = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        const id = action.payload;
        delete state.loadings.delete[id];
        delete state.error.delete[id];
        if (state.data) {
          state.data = state.data.filter(room => room.id !== id);
        }
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        const id = action.meta.arg;
        state.loadings.delete[id] = false;
        state.error.delete[id] = action.payload as string;
      })
      .addCase(fetchBranches.pending, (state) => {
        state.loadings.fetchBranches = true;
        state.error.fetchBranches = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loadings.fetchBranches = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loadings.fetchBranches = false;
        state.error.fetchBranches = action.payload as string;
      });
  },
});

export default roomSlide.reducer;