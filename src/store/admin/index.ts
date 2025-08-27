import { combineReducers } from "@reduxjs/toolkit";
import dashboardSlide from "./dashboardSlide";
import branchSlide from "./branchSlide";
import roomSlide from "./roomSlide";
import courseSlide from './courseSlide';
import userManagementSlide from './userManagement';
import ClassManagement from "../admin/classManagement";
import classDetailsSlide from "./classDetails";
import preViewSessionsSlide from "./preViewSessions";
import assignTeacherSlide from "./assignTeacher";
import assignRoomSlide from "./assignRoom";
import enrollStudentToClassSlice from "./enrollStudentToClass";
import classSessionsSlide from "./classSessions";
import classPowerSlide from "./classPowerSlide";
import attendanceSlide from "./attendanceSlide";
import todaySessionsSlide from "./todaySessionsSlide";
const adminReducer = combineReducers({
  dashboard: dashboardSlide,
  branch: branchSlide,
  room: roomSlide,
  classManagement: ClassManagement,
  course: courseSlide,
  userManagement: userManagementSlide, 
  classDetails: classDetailsSlide,
  preViewSessions: preViewSessionsSlide,
  assignTeacher: assignTeacherSlide,
  assignRoom: assignRoomSlide,
  enrollStudent: enrollStudentToClassSlice,
  classSessions: classSessionsSlide,
  classPower: classPowerSlide,
  attendance: attendanceSlide,
  todaySessions: todaySessionsSlide
});

export default adminReducer;
