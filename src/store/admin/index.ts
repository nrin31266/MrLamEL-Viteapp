import { combineReducers } from "@reduxjs/toolkit";
import dashboardSlide from "./dashboardSlide";
import branchSlide from "./branchSlide";
import roomSlide from "./roomSlide";
import courseSlide from './courseSlide';
import userManagementSlide from './userManagement';
import ClassManagement from "../admin/classManagement";

const adminReducer = combineReducers({
  dashboard: dashboardSlide,
  branch: branchSlide,
  room: roomSlide,
  classManagement: ClassManagement,
  course: courseSlide,
  userManagement: userManagementSlide,
});

export default adminReducer;
