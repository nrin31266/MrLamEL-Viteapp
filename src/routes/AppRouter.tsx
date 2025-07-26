import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import Login from "../features/auth/pages/Login/Login";
import AuthLayout from "../features/auth/layouts/AuthLayout";

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
          {/* Auth routes - check đăng nhập */}
          <Route element={<AuthGuard />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<div>Register Page</div>} />
            <Route
              path="/auth/request-password-reset"
              element={<div>Request Password Reset Page</div>}
            />
          </Route>
          <Route
            element={
              <AuthGuard allowedRoles={["ADMIN", "TEACHER", "STUDENT"]} />
            }
          >
            <Route
              path="/auth/verify-email"
              element={<div>Verify email</div>}
            />
          </Route>
        </Route>

        {/* Route chỉ dành cho Admin */}
        <Route element={<AuthGuard allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/*" element={<div>Admin Layout</div>} />
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
