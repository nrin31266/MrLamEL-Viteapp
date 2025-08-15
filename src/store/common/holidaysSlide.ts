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

export const getSolarHolidays = createAsyncThunk<IHolidaySolarDto[], number[]>(
    "holidays/getSolarHolidays",
    async (years, { rejectWithValue }) => {
        try {
            // Chuyển array sang chuỗi query: 2025,2026,2027
            const yearQuery = years.join(",");
            const data = await handleAPI<IHolidaySolarDto[]>({
                endpoint: `/common/holidays/solar?years=${yearQuery}`,
                method: "GET",
                isAuth: true,
            });
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
