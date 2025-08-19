import { combineReducers } from "@reduxjs/toolkit";
import timeTableForWeekSlide from "./timeTableForWeek";
import timeTableForDaySlice from "./timeTableForDay";
import attendanceSlide from "./AttendanceSlide";
const teacherReducer = combineReducers({
    timeTableForWeek: timeTableForWeekSlide,
    timeTableForDay: timeTableForDaySlice,
    attendance: attendanceSlide
});

export default teacherReducer;
