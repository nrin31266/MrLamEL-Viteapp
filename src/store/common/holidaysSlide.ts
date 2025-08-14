import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleAPI from "../../api/handleAPI";
import { ErrorUtils } from "../../utils/errorUtils";


export interface IHolidaySolarDto{
    date: string,
    name: string,
    year: number,
    originDate: string,
    rootType: string,
}

export const getSolarHolidays = createAsyncThunk<IHolidaySolarDto[]>(
    "holidays/getSolarHolidays",
    async (_, { rejectWithValue }) => {
        try {
            const data = await handleAPI<IHolidaySolarDto[]>({
                endpoint: `/common/holidays/solar`,
                method: "GET",
                isAuth: true,
            })
            return data;
        } catch (error) {
            return rejectWithValue(ErrorUtils.extractErrorMessage(error));
        }
    }
);
interface HolidaysState {
    solarHolidays?: IHolidaySolarDto[];
    loadings: {
        getSolarHolidays: boolean;
    };
    errors: {
        getSolarHolidays: string | null;
    };
}
const initialValues: HolidaysState = {
    solarHolidays: undefined,
    loadings: {
        getSolarHolidays: false,
    },
    errors: {
        getSolarHolidays: null,
    },
};
const holidaysSlide = createSlice({
    name: "holidays",
    initialState: initialValues,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSolarHolidays.pending, (state) => {
                state.loadings.getSolarHolidays = true;
            })
            .addCase(getSolarHolidays.fulfilled, (state, action) => {
                state.loadings.getSolarHolidays = false;
                state.solarHolidays = action.payload;
            })
            .addCase(getSolarHolidays.rejected, (state, action) => {
                state.loadings.getSolarHolidays = false;
                state.errors.getSolarHolidays = action.payload as string;
            });
    },
});

export default holidaysSlide.reducer;
