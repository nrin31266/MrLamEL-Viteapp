import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";

export interface IUserDto {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  dob: any;
  status: "OK" | "BANNED" | "EXPIRED";
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
  selectedUser?: IUserDto | null;
  loadings:{
    fetch?: boolean;
    create?: boolean;
    update?: boolean;
    fetchById?: boolean;
  }
  errors:{
    fetch?: string | null;
    create?: string | null;
    update?: string | null;
    fetchById?: string | null;
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

    // @PreAuthorize("hasRole('ADMIN')")
    // @PostMapping("/create")
    // public ApiRes<Void> createUser(@RequestBody CreateUserRq createUserRq) throws MessagingException {
    //     userService.createUser(createUserRq);
    //     return ApiRes.success(null);
    // }
    // @PreAuthorize("hasRole('ADMIN')")
    // @PutMapping("/{userId}/update")
    // public ApiRes<Void> updateUser(
    //         @PathVariable String userId,
    //         @RequestBody UpdateUserReq updateUserRq
    // ) {
    //     userService.updateUser(userId, updateUserRq);
    //     return ApiRes.success(null);
    // }
    export const createUser = createAsyncThunk<void, Partial<IUserDto>>(
  "userManagement/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      await handleAPI<void>({
        method: "POST",
        endpoint: "/api/v1/users",
        body: userData,
        isAuth: true,
      });
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
export const updateUser = createAsyncThunk<void, { id: number; userData: Partial<IUserDto> }>(
  "userManagement/updateUser",
  async ({ id, userData }, { rejectWithValue }) => { 
    try {
      await handleAPI<void>({
        method: "PUT",
        endpoint: `/api/v1/users/${id}`,
        body: userData,
        isAuth: true,
      });
    } catch (error) {
      return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
  }
);
// @PreAuthorize("hasRole('ADMIN')")
//     @GetMapping("/{userId}")
//     public ApiRes<User> getUserById(@PathVariable String userId) {
//         return ApiRes.success(
//                 userService.getUserById(userId)
//         );
//     }

export const fetchUserById = createAsyncThunk<IUserDto, number>(
  "userManagement/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IUserDto>({
        method: "GET",
        endpoint: `/api/v1/users/${userId}`,
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
        state.errors.fetch = action.payload as string;
        state.page = initialState.page; // Reset page on error
      })
      .addCase(createUser.pending, (state) => {
        state.loadings.create = true;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loadings.create = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loadings.create = false;
        state.errors.create = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loadings.update = true;
        state.errors.update = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loadings.update = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loadings.update = false;
        state.errors.update = action.payload as string;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loadings.fetchById = true;
        state.errors.fetchById = null;
        state.selectedUser = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loadings.fetchById = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loadings.fetchById = false;
        state.errors.fetchById = action.payload as string;
      });
  },
});

export const { } = userManagementSlice.actions;

export default userManagementSlice.reducer;