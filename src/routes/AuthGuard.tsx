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
  const isLoading = (loadings.fetchMyInfo || loadings.refreshToken) || false;

  useEffect(() => {
    if (!user) {
      dispatch(fetchMyInfo());
    }
  }, []);
  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  if( !user && !isAuthPage && !isLoading && location.pathname !== "/") {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra các điều kiện sau khi đã login
  if (user) {
    if (isAuthPage) {
      // Nếu đã đăng nhập và đang ở trang auth, redirect về trang chính của role
      const redirectPath = getDefaultRouteByRole(user.role);
      return <Navigate to={redirectPath} replace />;
    }
    // Kiểm tra role nếu route yêu cầu
    if (user && !allowedRoles.includes(user.role) && allowedRoles.length > 0) {
      return <Navigate to="/unauthorized" />;
    }
    // Email chưa verify
    if (!user.active && !location.pathname.startsWith("/auth/verify-email")) {
      return <Navigate to="/auth/verify-email" />;
    }
  
    // // Chưa hoàn tất profile
    // if (user.active && !user.profileComplete && !location.pathname.includes('/auth/profile')) {
    //   return <Navigate to={`/auth/profile/${user.id}`} />;
    // }

    if (user.active && !user.profileComplete && !location.pathname.startsWith("/auth/profile/")) {
      return <Navigate to={"/auth/profile/"+user.id} replace />;
    }

    // Email đã verify nhưng vẫn ở trang verify-email. replace: để không lưu vào history
    if (user.active && location.pathname.startsWith("/auth/verify-email")) {
      return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
    }

    if (user.active && user.profileComplete && location.pathname.startsWith("/auth/profile/")) {
      return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
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
      return "/admin";
    case "TEACHER":
      return "/teacher";
    case "STUDENT":
      return "/student";
    default:
      return "/"; // Nếu không xác định được role, trả về trang chính
  }
};

export default AuthGuard;
