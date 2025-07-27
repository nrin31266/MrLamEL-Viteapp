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
import AdminContent from "../features/admin/components/AdminContent/AdminContent";
import BranchList from "../features/admin/pages/Branch/BranchList";
import BranchForm from "../features/admin/pages/Branch/BranchForm";

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

       <Route element={<AuthGuard allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />} >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<div>Manage Users</div>} />
              <Route path="branches" element={<BranchList />} />
              <Route path="branches/create" element={<BranchForm />} />
              <Route path="branches/edit/:id" element={<BranchForm />} />
              <Route path="teachers" element={<div>Manage Teachers</div>} />
              <Route path="teachers/add" element={<div>Add Teacher</div>} />
              <Route path="students" element={<div>Manage Students</div>} />
              <Route path="students/add" element={<div>Add Student</div>} />
              <Route path="reports" element={<div>Reports</div>} />
              <Route path="settings" element={<div>Admin Settings</div>} />
              <Route path="*" element={<div>Admin Not Found</div>} />
            </Route>
          </Route>

        {/* Route chỉ dành cho User */}
        <Route element={<AuthGuard allowedRoles={["TEACHER"]} />}>
          <Route path="/teacher/*" element={<div>Teacher Layout</div>} />
        </Route>
        {/* Route chỉ dành cho Student */}
        <Route element={<AuthGuard allowedRoles={["STUDENT"]} />}>
          <Route path="/student/*" element={<div>Student Layout</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
