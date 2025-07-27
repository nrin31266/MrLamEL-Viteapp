import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        
    },
});

export default dashboardSlice.reducer;