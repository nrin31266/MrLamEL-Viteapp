import { combineReducers } from "@reduxjs/toolkit";
import dashboardSlide from "./dashboardSlide";
import branchSlide from "./branchSlide";
import roomSlide from "./roomSlide";

const adminReducer = combineReducers({
  dashboard: dashboardSlide,
  branch: branchSlide,
  room: roomSlide,
});

export default adminReducer;
