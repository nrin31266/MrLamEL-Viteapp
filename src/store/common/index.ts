import { combineReducers } from "@reduxjs/toolkit";
import holidaysSlide from "./holidaysSlide";

const commonReducer = combineReducers({
    holidays: holidaysSlide,
});

export default commonReducer;
