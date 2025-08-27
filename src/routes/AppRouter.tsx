import { BrowserRouter, Navigate, Route, Router, Routes } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import Login from "../features/auth/pages/Login/Login";
import AuthLayout from "../features/auth/layouts/AuthLayout";
import Register from "../features/auth/pages/Register/Register";
import VerifyEmail from "../features/auth/pages/VerifyEmail/VerifyEmail";
import UpdateProfile from "../features/auth/pages/UpdateProfile/UpdateProfile";
import ResetPassword from "../features/auth/pages/ResetPassword/ResetPassword";
import AdminLayout from "../features/admin/layout/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard/Dashboard";
import BranchList from "../features/admin/pages/Branch/BranchList";
import BranchForm from "../features/admin/pages/Branch/BranchForm";
import RoomList from "../features/admin/pages/Room/RoomList";
import RoomForm from "../features/admin/pages/Room/RoomForm";
import CourseList from "../features/admin/pages/Course/CourseList";
import CourseForm from "../features/admin/pages/Course/CourseForm";
import UserManagement from "../features/admin/pages/UserManagement/UserManagement";
import Tools from "../features/admin/pages/Tools/Tools";
import AddUser from "../features/admin/pages/UserManagement/AddUser";
import ClassManagement from "../features/admin/pages/Clazz/ClassManagement";
import ClassForm from "../features/admin/pages/Clazz/ClassForm";
import ClassDetails from "../features/admin/pages/Clazz/ClassDetails";
import ClassOverview from "../features/admin/pages/Clazz/ClassOverview";
import Holidays from "../features/common/pages/Holidays";
import ClassSessions from "../features/admin/pages/Clazz/ClassSessions";
import ClassEnrollment from "../features/admin/pages/Clazz/ClassEnrollment";
import TeacherLayout from "../features/teacher/layout/TeacherLayout";
import TeacherProfile from "../features/teacher/pages/Profile/TeacherProfile";
import TimeTableWeekly from "../features/teacher/pages/TimeTable/TimeTableWeekly";
import TimeTable from "../features/teacher/pages/TimeTable/TimeTable";
import Attendance from "../features/teacher/pages/Attendance/Attendance";
import AdminAttendance from "../features/admin/pages/Attendance/Attendance";
import StudentLayout from "../features/student/layout/StudentLayout";
import StudentTimeTableWeekly from "../features/student/pages/TimeTable/TimeTableWeekly";
import StudentTimeTable from "../features/student/pages/TimeTable/TimeTable";
import StudentProfile from "../features/student/pages/Profile/StudentProfile";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - không cần đăng nhập */}
        <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
         
        <Route path="*" element={<div>Not Found Page</div>} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<div>Introduction Page</div>} />
        </Route>
        <Route element={<AuthLayout />}>
          {/* Các route liên quan đến auth */}
          <Route element={<AuthGuard />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register/>} />
            <Route
              path="/auth/request-password-reset"
              element={<ResetPassword />}
              // element={<div>Request Password Reset Page</div>}
            />
          </Route>
          <Route
            element={
              <AuthGuard allowedRoles={["ADMIN", "TEACHER", "STUDENT"]} />
            }
          >
            <Route
              path="/auth/verify-email"
              element={<VerifyEmail />}
            />
             <Route
              path="/auth/profile/:userId"
              element={<UpdateProfile />}
            />
           
          </Route>
        </Route>

       <Route element={<AuthGuard allowedRoles={["ADMIN", "SENIOR_ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />} >
              <Route index element={<AdminDashboard />} />
              <Route path="branches" element={<BranchList />} />
              <Route path="branches/create" element={<BranchForm />} />
              <Route path="branches/edit/:id" element={<BranchForm />} />
              <Route path="rooms" element={<RoomList />} />
              <Route path="rooms/branches/:branchId" element={<RoomList />} />
              <Route path="rooms/create" element={<RoomForm />} />
              <Route path="rooms/edit/:id" element={<RoomForm />} />
              <Route path="courses" element={<CourseList />} />
              <Route path="courses/create" element={<CourseForm />} />
              <Route path="courses/edit/:id" element={<CourseForm />} />
              <Route path="users/:role" element={<UserManagement />} />
              <Route path="users/:role/add" element={<AddUser />} />
              <Route path="holidays" element={<Holidays />} />
              <Route path="users/:role/edit/:id" element={<AddUser />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="classes/create" element={<ClassForm />} />
              <Route path="classes/details/:classId" element={<ClassDetails />} >
                <Route index element={<ClassOverview/>} />
                <Route path="sessions" element={<ClassSessions />} />
                <Route path="participants" element={<ClassEnrollment />} />
                <Route path="sessions/:sessionId/attendance" element={<AdminAttendance />} />
              </Route>
              <Route path="tools" element={<Tools />} />
              <Route path="teachers" element={<div>Manage Teachers</div>} />
              <Route path="teachers/add" element={<div>Add Teacher</div>} />
              <Route path="students" element={<div>Manage Students</div>} />
              <Route path="students/add" element={<div>Add Student</div>} />
              <Route path="reports" element={<div>Reports</div>} />
              <Route path="settings" element={<div>Admin Settings</div>} />
              {/* <Route path="*" element={<div>Admin Not Found</div>} /> */}
            </Route>
          </Route>

        {/* Route chỉ dành cho User */}
        <Route element={<AuthGuard allowedRoles={["TEACHER"]} />}>
          <Route path="/teacher" element={<TeacherLayout />} >
            <Route path="timetable" element={<TimeTable />} />
            <Route path="timetable/weekly" element={<TimeTableWeekly />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="attendance/:sessionId" element={<Attendance />} />
          </Route>
        </Route>
        {/* Route chỉ dành cho Student */}
        <Route element={<AuthGuard allowedRoles={["STUDENT"]} />}>
          <Route path="/student" element={<StudentLayout />} >
            <Route path="timetable" element={<StudentTimeTable />} />
            <Route path="timetable/weekly" element={<StudentTimeTableWeekly />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
