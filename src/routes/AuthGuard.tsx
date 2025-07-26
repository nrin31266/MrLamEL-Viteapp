import React, { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import Loading from "../components/common/Loading";
import { fetchMyInfo } from "../store/authSlide";

const AuthGuard = ({
  allowedRoles = [],
}: {
  allowedRoles?: string[];
}) => {
  const dispatch = useAppDispatch();
  const { user, loadings } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const authPages = [
    "/auth/login",
    "/auth/register",
    "/auth/request-password-reset",
  ];

  const isAuthPage = authPages.some((path) =>
    location.pathname.match(path)
  );

  useEffect(() => {
    if (!user && !loadings.fetchMyInfo) {
      dispatch(fetchMyInfo());
    }
  }, [dispatch, location.pathname, user]);

  // Loading state
  if (loadings.fetchMyInfo) {
    return <Loading />;
  }

  if( !user && !isAuthPage && loadings.fetchMyInfo == false && location.pathname !== "/") {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra các điều kiện sau khi đã login
  if (user) {
    if (isAuthPage) {
      // Nếu đã đăng nhập và đang ở trang auth, redirect về trang chính của role
      const redirectPath = getDefaultRouteByRole(user.role);
      return <Navigate to={redirectPath} replace />;
    }
    // Email chưa verify
    if (!user.active && !location.pathname.startsWith("/auth/verify-email")) {
      return <Navigate to="/auth/verify-email" />;
    }
    // Email đã verify nhưng vẫn ở trang verify-email
    if (user.active && location.pathname.startsWith("/auth/verify-email")) {
      return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
    }

    // // Chưa hoàn tất profile
    // if (user.active && !user.profileComplete && !location.pathname.includes('/auth/profile')) {
    //   return <Navigate to={`/auth/profile/${user.id}`} />;
    // }

    // Kiểm tra role nếu route yêu cầu
    if (user && !allowedRoles.includes(user.role) && allowedRoles.length > 0) {
      return <Navigate to="/unauthorized" />;
    }

    if(user && location.pathname === "/") {
      // Nếu đã đăng nhập và ở trang chính, redirect về trang mặc định theo role
      // Ví dụ: /admin/dashboard, /teacher/dashboard, /student/dashboard
      return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
    }


  }

  return <Outlet />;
};

// Helper function để xác định route mặc định theo role
const getDefaultRouteByRole = (role: "ADMIN" | "TEACHER" | "STUDENT") => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "TEACHER":
      return "/teacher/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/"; // Nếu không xác định được role, trả về trang chính
  }
};

export default AuthGuard;
