import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";
import type { IClazz } from "./classManagement";
import type { IUser } from "../authSlide";

interface IClassPowerState {
    loadings:{
        create: boolean;
        removeItem: Record<number, boolean>;
    }
    errors:{
        create?: string | null;
        removeItem: Record<number, string | null>;
    }
}
const initialState: IClassPowerState = {
    loadings: {
        create: false,
        removeItem: {},
    },
    errors: {
        create: null,
        removeItem: {},
    },
};
    // @PutMapping("/{classId}/empower/{teacherId}")
    // public ApiRes<Clazz> empowerClassForTeacher(
    //         @PathVariable Long classId,
    //         @PathVariable Long teacherId
    // ) {
    //     log.info("Empowering class with ID: {} for teacher with ID: {}", classId, teacherId);
    //     return ApiRes.success(classService.empowerClassForTeacher(classId, teacherId));
    // }
    // @DeleteMapping("/{classId}/empower/{teacherId}")
    // public ApiRes<Void> revokeEmpowermentFromClass(
    //         @PathVariable Long classId,
    //         @PathVariable Long teacherId
    // ) {
    //     log.info("Revoking empowerment from class with ID: {} for teacher with ID: {}", classId, teacherId);
    //     classService.revokeEmpowermentFromClass(classId, teacherId);
    //     return ApiRes.success(null);
    // }
//     export const fetchTimeTableForTeacherByDay = createAsyncThunk<ISessionDto[], { teacherId: number, date: string }>(
//   "teacher/timeTableForDay",
//   async (params, { rejectWithValue }) => {
//     try {
//       const data = await handleAPI<ISessionDto[]>({
//         endpoint: `/api/v1/teacher/classes/${params.teacherId}/time-table/day`,
//         method: "GET",
//         params: { date: params.date },
//         isAuth: true,
//       });
//       return data
//     } catch (error) {
//       return rejectWithValue(ErrorUtils.extractErrorMessage(error));
//     }
//   }
// );
export const empowerClassForTeacher = createAsyncThunk<IUser, { classId: number; email: string }>(
    "admin/classPowerSlide/empowerClassForTeacher",
    async (params, { rejectWithValue }) => {
        try {
            const data = await handleAPI<IUser>({
                endpoint: `/api/v1/classes/${params.classId}/empower/${params.email}`,
                method: "PUT",
                isAuth: true,
            });
            return data;
        } catch (error) {
            return rejectWithValue(ErrorUtils.extractErrorMessage(error));
        }
    }
);

export const revokeEmpowermentFromClass = createAsyncThunk<void, { classId: number; teacherId: number }>(
    "admin/classPowerSlide/revokeEmpowermentFromClass",
    async (params, { rejectWithValue }) => {
        try {
            await handleAPI<void>({
                endpoint: `/api/v1/classes/${params.classId}/empower/${params.teacherId}`,
                method: "DELETE",
                isAuth: true,
            });
        } catch (error) {
            return rejectWithValue(ErrorUtils.extractErrorMessage(error));
        }
    }
);

const classPowerSlideSlice = createSlice({
    initialState,
    reducers: {},
    name: "admin/classPowerSlide",
    extraReducers: (builder) => {
        builder.addCase(empowerClassForTeacher.pending, (state) => {
            state.loadings.create = true;
            state.errors.create = null;
        });
        builder.addCase(empowerClassForTeacher.fulfilled, (state, action) => {
            state.loadings.create = false;
            state.errors.create = null;
        });
        builder.addCase(empowerClassForTeacher.rejected, (state, action) => {
            state.loadings.create = false;
            state.errors.create = action.payload as string;
        });
        builder.addCase(revokeEmpowermentFromClass.pending, (state, action) => {
            state.loadings.removeItem[action.meta.arg.teacherId] = true;
            state.errors.removeItem[action.meta.arg.teacherId] = null;
        });
        builder.addCase(revokeEmpowermentFromClass.fulfilled, (state, action) => {
            state.loadings.removeItem[action.meta.arg.teacherId] = false;
            state.errors.removeItem[action.meta.arg.teacherId] = null;
        });
        builder.addCase(revokeEmpowermentFromClass.rejected, (state, action) => {
            state.loadings.removeItem[action.meta.arg.teacherId] = false;
            state.errors.removeItem[action.meta.arg.teacherId] = action.payload as string;
        });
    }
});

export default classPowerSlideSlice.reducer;