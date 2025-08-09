import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";

export interface IUserDto {
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
//   private List<T> content;
//     private Integer totalPages;
//     private Long totalElements;
//     private Integer currentSize;
//     private Integer currentPage;
//     private Boolean first;
//     private Boolean last;
//     private Boolean empty;
//     private Boolean hasMore;
export interface IPageData<R> {
  content: R[];
  totalPages: number;
  totalElements: number;
  currentSize: number;
  currentPage: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
interface IUserManagementState {
  page: IPageData<IUserDto>;
  loadings:{
    fetch?: boolean;
  }
  errors:{
    fetch?: string | null;
  }
}



const initialState: IUserManagementState = {
    loadings:{},
    errors:{},
    page: {
      content: [],
      totalPages: 0,
      totalElements: 0,
      currentSize: 0,
      currentPage: 0,
      first: false,
      last: false,
      empty: false,
    },
};
export const fetchUsers = createAsyncThunk<IPageData<IUserDto>, Record<string, string>>(
  "userManagement/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IPageData<IUserDto>>({
        method: "GET",
        endpoint: "/api/v1/users",
        params: params,
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadings.fetch = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadings.fetch = false;
        state.page = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loadings.fetch = false;
        state.errors.fetch = action.error.message;
      });
  },
});

export const { } = userManagementSlice.actions;

export default userManagementSlice.reducer;