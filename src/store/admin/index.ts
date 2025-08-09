import { combineReducers } from "@reduxjs/toolkit";
import dashboardSlide from "./dashboardSlide";
import branchSlide from "./branchSlide";
import roomSlide from "./roomSlide";
import courseSlide from './courseSlide';
import userManagementSlide from './userManagement';

const adminReducer = combineReducers({
  dashboard: dashboardSlide,
  branch: branchSlide,
  room: roomSlide,
  course: courseSlide,
  userManagement: userManagementSlide,
});

export default adminReducer;
