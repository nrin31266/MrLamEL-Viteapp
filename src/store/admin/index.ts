import { combineReducers } from "@reduxjs/toolkit";
import dashboardSlide from "./dashboardSlide";
import branchSlide from "./branchSlide";

const adminReducer = combineReducers({
  dashboard: dashboardSlide,
  branch: branchSlide
});

export default adminReducer;
