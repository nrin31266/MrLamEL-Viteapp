import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { IUser } from "../authSlide"
import handleAPI from "../../api/handleAPI"
import { ErrorUtils } from "../../utils/errorUtils"
import create from "@ant-design/icons/lib/components/IconFont"

export interface IClassEnrollment {
  id: number
  attendee: IUser
  enrolledAt: string
  isPaid: boolean
  tuitionFee: number
  paidAmount: number
}

export interface ICheckStudentDto {
  exists: boolean
  canEnroll: boolean
  reason: string
  user: IUser
}
export interface IAddStudentToClassRq {
  userId: number
  classId: number
  email: string
  fullName: string
}

interface IEnrollStudentToClassState {
    enrollments: IClassEnrollment[]
    classId?: number
    loadings: {
      enrollments: boolean
      addStudent: boolean
      checkStudent: boolean
      removeStudent: boolean
    }
    errors: {
        enrollments?: string | null
        addStudent?: string | null
        checkStudent?: string | null
        removeStudent?: string | null
    }
}
const initialState: IEnrollStudentToClassState = {
    enrollments: [],
    classId: undefined,
    loadings: {
        enrollments: false,
        addStudent: false,
        checkStudent: false,
        removeStudent: false
    },
    errors: {
        enrollments: null,
        addStudent: null,
        checkStudent: null,
        removeStudent: null
    }
};
export const checkStudentBeforeAddingToClass = createAsyncThunk<ICheckStudentDto, { studentEmail: string; classId: number }>(
    "admin/enrollStudent/checkStudentBeforeAdding",
    async (params, { rejectWithValue }) => {
        try {
            const data = await handleAPI<ICheckStudentDto>({
                method: "GET",
                endpoint: `/api/v1/classes/${params.classId}/users/check`,
                isAuth: true,
                params: { studentEmail: params.studentEmail }
            });
            return data;
        } catch (error) {
            return rejectWithValue(ErrorUtils.extractErrorMessage(error));
        }
    }
);
export const addStudentToClass = createAsyncThunk<IClassEnrollment, Partial<IAddStudentToClassRq>>(
    "admin/enrollStudent/addStudentToClass",
    async (body: Partial<IAddStudentToClassRq>, { rejectWithValue }) => {
        try {
            const data = await handleAPI<IClassEnrollment>({
                method: "POST",
                endpoint: `/api/v1/classes/${body.classId}/users`,
                isAuth: true,
                body: body
            });
            return data;
        } catch (error) {
            return rejectWithValue(ErrorUtils.extractErrorMessage(error));
        }
    }
);
export const fetchClassEnrollments = createAsyncThunk<
    IClassEnrollment[],
    number
>(
    "admin/enrollStudent/fetchClassEnrollments",
    async (classId: number, { rejectWithValue }) => {
        try {
            const data = await handleAPI<IClassEnrollment[]>({
                method: "GET",
                endpoint: `/api/v1/classes/${classId}/enrollments`,
                isAuth: true
            });
            return data;
        } catch (error) {
            return rejectWithValue(ErrorUtils.extractErrorMessage(error));
        }
    }
);
//  @DeleteMapping("/{classId}/users/{studentId}")
//     public ApiRes<Void> removeStudentFromClass(@PathVariable Long classId, @PathVariable Long studentId) {
//         log.info("Removing student with ID: {} from class with ID: {}", studentId, classId);
//         classService.removeStudentFromClass(classId, studentId);
//         return ApiRes.success(null);
//     }
export const removeStudentFromClass = createAsyncThunk<void, { classId: number; studentId: number }>(
    "admin/enrollStudent/removeStudentFromClass",
    async (params, { rejectWithValue }) => {
        try {
            await handleAPI<void>({
                method: "DELETE",
                endpoint: `/api/v1/classes/${params.classId}/users/${params.studentId}`,
                isAuth: true
            });
        } catch (error) {
            return rejectWithValue(ErrorUtils.extractErrorMessage(error));
        }
    }
);

const enrollStudentToClassSlice = createSlice({
    name: "admin/enrollStudent",
    initialState,
    reducers: {
        setClassIdForEnrollments: (state, action : PayloadAction<{ clazzId: number }>) => {
            if (action.payload.clazzId && action.payload.clazzId !== state.classId) {
                state.classId = action.payload.clazzId;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkStudentBeforeAddingToClass.pending, (state) => {
                state.loadings.checkStudent = true;
                state.errors = {}
            })
            .addCase(checkStudentBeforeAddingToClass.fulfilled, (state, action) => {
                state.loadings.checkStudent = false;
            })
            .addCase(checkStudentBeforeAddingToClass.rejected, (state, action) => {
                state.loadings.checkStudent = false;
                state.errors.checkStudent = action.payload as string;
            })
            .addCase(addStudentToClass.pending, (state) => {
                state.loadings.addStudent = true;
                state.errors.addStudent = null;
            })
            .addCase(addStudentToClass.fulfilled, (state, action) => {
                state.loadings.addStudent = false;
                state.enrollments = [...state.enrollments, action.payload];
            })
            .addCase(addStudentToClass.rejected, (state, action) => {
                state.loadings.addStudent = false;
                state.errors.addStudent = action.payload as string;
            })
            .addCase(fetchClassEnrollments.pending, (state) => {
                state.loadings.enrollments = true;
                state.errors.enrollments = null;
            })
            .addCase(fetchClassEnrollments.fulfilled, (state, action) => {
                state.loadings.enrollments = false;
                state.enrollments = action.payload;
            })
            .addCase(fetchClassEnrollments.rejected, (state, action) => {
                state.loadings.enrollments = false;
                state.errors.enrollments = action.payload as string;
            })
            .addCase(removeStudentFromClass.pending, (state) => {
                state.loadings.removeStudent = true;
                state.errors.removeStudent = null;
            })
            .addCase(removeStudentFromClass.fulfilled, (state, action) => {
                state.loadings.removeStudent = false;
                state.enrollments = state.enrollments.filter(
                    (enrollment) => enrollment.attendee.id !== action.meta.arg.studentId
                );
            })
            .addCase(removeStudentFromClass.rejected, (state, action) => {
                state.loadings.removeStudent = false;
                state.errors.removeStudent = action.payload as string;
            });
    }
});
export const { setClassIdForEnrollments } = enrollStudentToClassSlice.actions;
export default enrollStudentToClassSlice.reducer;


    //         @PathVariable Long clazzId
    // ) {
    //     log.info("Checking student before adding to class with ID: {}", clazzId);
    //     return ApiRes.success(classService.checkStudentBeforeAddingToClass(studentEmail, clazzId));
    // }

    // @PostMapping("/{clazzId}/users")
    // public ApiRes<ClassEnrollment> addStudentToClass(
    //         @RequestBody @Valid AddStudentToClassRq addStudentToClassRq,
    //         @PathVariable Long clazzId

    // ) {
    //     log.info("Adding student to class with ID: {}", clazzId);
    //     return ApiRes.success(classService.addStudentToClass(addStudentToClassRq));
    // }
    // @GetMapping("/{classId}/enrollments")
    // public ApiRes<List<ClassEnrollment>> getClassEnrollmentsByClassId(@PathVariable Long classId) {
    //     log.info("Fetching class enrollments for class ID: {}", classId);
    //     List<ClassEnrollment> enrollments = classService.getClassEnrollmentsByClassId(classId);
    //     return ApiRes.success(enrollments);
    // }
//     export const fetchAvailableRoomsForClasses = createAsyncThunk(
//   "admin/assignRoom/fetchAvailableRooms",
//   async (params: Record<string, string>, { rejectWithValue }) => {
//     try {
//       const data = await handleAPI<IRoomDto[]>({
//         method: "GET",
//         endpoint: "/api/v1/rooms/available",
//         isAuth: true,
//         params,
//       });
//       return data;
//     } catch (error) {
//       return rejectWithValue(ErrorUtils.extractErrorMessage(error));
//     }
//   }
// );