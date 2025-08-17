import { combineReducers } from "@reduxjs/toolkit";
import timeTableForWeekSlide from "./timeTableForWeek";

const teacherReducer = combineReducers({
    timeTableForWeek: timeTableForWeekSlide,    
});

export default teacherReducer;
