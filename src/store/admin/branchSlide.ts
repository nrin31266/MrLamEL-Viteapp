import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";


export const createBranch = createAsyncThunk("branch/create", async (branchData: {
    name: string;
    address: string;
    phone: string;
}, { rejectWithValue }) => {
    try {
        // Call your API to create a branch
        const data = await handleAPI<IBranchDto>({
            method: 'POST',
            endpoint: '/api/v1/branches',
            body: branchData,
            isAuth: true
        })
        return data
    } catch (error) {
        return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
});
export const updateBranch = createAsyncThunk("branch/update", async ({ id, branchData }: { id: number, branchData: { name: string; address: string; phone: string; } }, { rejectWithValue }) => {
    try {
        // Call your API to update a branch
        const data = await handleAPI<IBranchDto>({
            method: 'PUT',
            endpoint: `/api/v1/branches/${id}`,
            body: branchData,
            isAuth: true
        })
        return data
    } catch (error) {
        return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
});
export const deleteBranch = createAsyncThunk("branch/delete", async (id: number, { rejectWithValue }) => {
    try {
        // Call your API to delete a branch
        await handleAPI({
            method: 'DELETE',
            endpoint: `/api/v1/branches/${id}`,
            isAuth: true
        })
        return id; // Return the ID of the deleted branch
    } catch (error) {
        return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
});
export const fetchBranches = createAsyncThunk("branch/fetch", async (_, { rejectWithValue }) => {
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
export const fetchBranchById = createAsyncThunk("branch/fetchById", async (id: number, { rejectWithValue }) => {
    try {
        const data = await handleAPI<IBranchDto>({
            method: 'GET',
            endpoint: `/api/v1/branches/${id}`,
            isAuth: true
        })
        return data;
    } catch (error) {
        return rejectWithValue(ErrorUtils.extractErrorMessage(error));
    }
});

interface BranchState {
    data: IBranchDto[] | null;
    selectedBranch: IBranchDto | null;
    loadings: {
        fetch?: boolean;
        create?: boolean;
        update?: boolean;
        delete: Record<number, boolean>;
        fetchById?: boolean;
    };
    error:{
        fetch?: string | null;
        create?: string | null;
        update?: string | null;
        delete: Record<number, any>;
        fetchById?: string | null;
    }
}

const initialState: BranchState = {

    data: null,
    selectedBranch: null,
    loadings: {
        delete: {},
    },
    error: {

        delete: {}
    },
};

export interface IBranchDto {
  id: number
  name: string
  address: string
  phone: string
  roomCount?: number
}


const branchSlide = createSlice({
    name: "dashboard",
    initialState: initialState,
    // Thunk không cần destructure
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranches.pending, (state) => {
                state.loadings.fetch = true;
                state.error.fetch = null;
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.loadings.fetch = false;
                state.data = action.payload;
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.loadings.fetch = false;
                state.error.fetch = action.payload as string;
            })
            .addCase(createBranch.pending, (state) => {
                state.loadings.create = true;
                state.error.create = null;
            })
            .addCase(createBranch.fulfilled, (state, action) => {
                state.loadings.create = false;
                if (state.data) {
                    state.data.push(action.payload);
                } else {
                    state.data = [action.payload];
                }
            })
            .addCase(createBranch.rejected, (state, action) => {
                state.loadings.create = false;
                state.error.create = action.payload as string;
            })
            .addCase(updateBranch.pending, (state) => {
                state.loadings.update = true;
                state.error.update = null;
            })
            .addCase(updateBranch.fulfilled, (state, action) => {
                state.loadings.update = false;
                if (state.data) {
                    const index = state.data.findIndex(branch => branch.id === action.payload.id);
                    if (index !== -1) {
                        state.data[index] = action.payload;
                    }
                }
            })
            .addCase(updateBranch.rejected, (state, action) => {
                state.loadings.update = false;
                state.error.update = action.payload as string;
            })
            .addCase(deleteBranch.pending, (state, action) => {
                const id = action.meta.arg; // Get the ID from the thunk's argument
                state.loadings.delete[id] = true;
                state.error.delete[id] = null;
            })
            .addCase(deleteBranch.fulfilled, (state, action) => {
                const id = action.payload; // The ID of the deleted branch
                delete state.loadings.delete[id];
                delete state.error.delete[id];
                
                if (state.data) {
                    state.data = state.data.filter(branch => branch.id !== id);
                }
            })
            .addCase(deleteBranch.rejected, (state, action) => {
                const id = action.meta.arg; // Get the ID from the thunk's argument
                state.loadings.delete[id] = false;
                state.error.delete[id] = action.payload as string;
            })
            .addCase(fetchBranchById.pending, (state) => {
                state.loadings.fetchById = true;
                state.error.fetchById = null;
            })
            .addCase(fetchBranchById.fulfilled, (state, action) => {
                state.loadings.fetchById = false;
                state.selectedBranch = action.payload;
            })
            .addCase(fetchBranchById.rejected, (state, action) => {
                state.loadings.fetchById = false;
                state.error.fetchById = action.payload as string;
            });
    }
});

export default branchSlide.reducer;