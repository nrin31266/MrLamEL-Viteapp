import { combineReducers } from "@reduxjs/toolkit";
import timeTableForWeekSlide from "./timeTableForWeek";
import timeTableForDaySlice from "./timeTableForDay";
import classStudyingSlice from "./classStudying";
const teacherReducer = combineReducers({
    timeTableForWeek: timeTableForWeekSlide,
    timeTableForDay: timeTableForDaySlice,
    classStudying: classStudyingSlice,
});

export default teacherReducer;