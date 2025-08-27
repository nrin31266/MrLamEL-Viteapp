import { combineReducers } from "@reduxjs/toolkit";
import timeTableForWeekSlide from "./timeTableForWeek";
import timeTableForDaySlice from "./timeTableForDay";
const teacherReducer = combineReducers({
    timeTableForWeek: timeTableForWeekSlide,
    timeTableForDay: timeTableForDaySlice,
});

export default teacherReducer;